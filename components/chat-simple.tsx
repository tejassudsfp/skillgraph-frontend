"use client";

import { useState, useRef, useEffect } from "react";
import { WebSearchResults } from "./web-search-results";
import { SkillModeRenderer } from "./skill-mode-renderer";

// Message types
type MessageRole = "user" | "assistant";

type TextPart = {
  type: "text";
  text: string;
};

type SkillResultPart = {
  type: "skill-result";
  skillName: string;
  renderType: string;
  data: any;
  cached?: boolean;
};

type MessagePart = TextPart | SkillResultPart;

type Message = {
  id: string;
  role: MessageRole;
  parts: MessagePart[];
  messageNumber?: number;
  thinking?: boolean;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export function ChatSimple() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      parts: [{ type: "text", text }],
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      // Create conversation if needed
      let convId = conversationId;
      if (!convId) {
        const createRes = await fetch(`${BACKEND_URL}/api/v1/conversations`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-API-Key": "dev-key-123" },
          body: JSON.stringify({ title: "New Conversation" }),
        });
        const createData = await createRes.json();
        convId = createData.id;
        setConversationId(convId);
      }

      // Stream response
      const response = await fetch(
        `${BACKEND_URL}/api/v1/conversations/${convId}/messages/stream`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-API-Key": "dev-key-123" },
          body: JSON.stringify({ message: text }),
          signal: abortControllerRef.current.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let currentAssistantMessage: Message | null = null;
      let currentMessageNumber = 1;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6);

          try {
            let parsed = JSON.parse(data);

            // Unwrap if data is wrapped in {chunk: "..."} by proxy
            if (parsed.chunk && typeof parsed.chunk === 'string') {
              parsed = JSON.parse(parsed.chunk);
            }

            console.log("[CHAT-SIMPLE] Event:", parsed.type, parsed);

            if (parsed.type === "message_start") {
              // Start new assistant message
              currentMessageNumber = parsed.message_number;
              currentAssistantMessage = {
                id: `assistant-${parsed.message_number}-${Date.now()}`,
                role: "assistant",
                parts: [],
                messageNumber: parsed.message_number,
              };
              setMessages((prev) => [...prev, currentAssistantMessage!]);
            } else if (parsed.type === "chunk") {
              // Add text chunk
              if (currentAssistantMessage) {
                setMessages((prev) =>
                  prev.map((msg) => {
                    if (msg.id !== currentAssistantMessage!.id) return msg;

                    // Find existing text part (not a thinking indicator)
                    const existingTextPart = msg.parts.find(
                      (p) => p.type === "text" && !p.text.startsWith("_")
                    ) as TextPart | undefined;

                    // Keep all non-text parts and thinking indicators
                    const otherParts = msg.parts.filter(
                      (p) => p.type !== "text" || p.text.startsWith("_")
                    );

                    // Create updated text part
                    const updatedTextPart: TextPart = {
                      type: "text",
                      text: (existingTextPart?.text || "") + parsed.content,
                    };

                    return {
                      ...msg,
                      parts: [...otherParts, updatedTextPart],
                    };
                  })
                );
              }
            } else if (parsed.type === "thinking") {
              // Show thinking indicator
              if (currentAssistantMessage) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === currentAssistantMessage!.id
                      ? {
                          ...msg,
                          thinking: true,
                          parts: [
                            ...msg.parts,
                            { type: "text", text: `_${parsed.action}..._\n` } as TextPart,
                          ],
                        }
                      : msg
                  )
                );
              }
            } else if (parsed.type === "skill_result") {
              // Add skill result as separate message
              const skillResultMessage: Message = {
                id: `skill-${parsed.message_number}-${Date.now()}`,
                role: "assistant",
                parts: [
                  {
                    type: "skill-result",
                    skillName: parsed.skill_name,
                    renderType: parsed.render_type,
                    data: parsed.data,
                    cached: parsed.cached,
                  } as SkillResultPart,
                ],
                messageNumber: parsed.message_number,
              };
              setMessages((prev) => [...prev, skillResultMessage]);
            } else if (parsed.type === "message_done") {
              console.log("[CHAT-SIMPLE] Message complete:", parsed.message_number);
            } else if (parsed.done) {
              console.log("[CHAT-SIMPLE] Stream complete");
            }
          } catch (e) {
            console.error("[CHAT-SIMPLE] Failed to parse:", data, e);
          }
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("[CHAT-SIMPLE] Request aborted");
      } else {
        console.error("[CHAT-SIMPLE] Error:", error);
        // Add error message
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            parts: [{ type: "text", text: `Error: ${error.message}` }],
          },
        ]);
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="flex h-screen flex-col" style={{ backgroundColor: "#fff9ef" }}>
      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-4xl space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 border-2 ${
                  message.role === "user"
                    ? "border-[#2d2d2d]"
                    : "border-[#2d2d2d]"
                }`}
                style={{
                  backgroundColor: message.role === "user" ? "#2d2d2d" : "rgba(45, 45, 45, 0.05)",
                }}
              >
                {message.parts.map((part, idx) => (
                  <div key={idx}>
                    {part.type === "text" && (
                      <div
                        className="whitespace-pre-wrap"
                        style={{ color: message.role === "user" ? "#fff9ef" : "#2d2d2d" }}
                      >
                        {part.text}
                      </div>
                    )}
                    {part.type === "skill-result" && (
                      <div className="mt-2 w-full">
                        {part.skillName === "web_search" ? (
                          // Beautiful search result cards for web_search
                          <WebSearchResults
                            data={part.data}
                            cached={part.cached || false}
                          />
                        ) : part.skillName === "ticket_booking" ? (
                          // Interactive skill mode UI for ticket_booking
                          <SkillModeRenderer
                            skillName={part.skillName}
                            renderType={part.renderType}
                            data={part.data}
                            onUserAction={(input) => {
                              // Send user's action back to backend
                              sendMessage(input);
                            }}
                          />
                        ) : (
                          // Fallback for other skill types
                          <div>
                            <div className="mb-2 text-sm font-semibold" style={{ color: "#2d2d2d" }}>
                              🔍 {part.skillName} Results {part.cached && "(cached)"}
                            </div>
                            <div className="rounded-lg border border-[#2d2d2d] p-3" style={{ backgroundColor: "rgba(45, 45, 45, 0.05)" }}>
                              <pre className="text-xs overflow-x-auto" style={{ color: "#2d2d2d" }}>
                                {JSON.stringify(part.data, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t-2 p-4" style={{ borderColor: "#2d2d2d" }}>
        <div className="mx-auto max-w-4xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ask me anything..."
              disabled={isStreaming}
              className="flex-1 rounded-xl border-2 px-4 py-3 focus:outline-none focus:ring-2"
              style={{
                borderColor: "#2d2d2d",
                backgroundColor: "rgba(45, 45, 45, 0.05)",
                color: "#2d2d2d",
              }}
            />
            <button
              onClick={() => (isStreaming ? stopStreaming() : sendMessage(input))}
              disabled={!isStreaming && !input.trim()}
              className="rounded-xl px-6 py-3 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#2d2d2d",
                color: "#fff9ef",
              }}
            >
              {isStreaming ? "Stop" : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
