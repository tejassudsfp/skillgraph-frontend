"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { WebSearchResults } from "@/components/web-search-results";
import { SkillModeRenderer } from "@/components/skill-mode-renderer";
import { TokenUsageDisplay } from "@/components/token-usage-display";
import { TokenStatsDialog } from "@/components/token-stats-dialog";

interface Conversation {
  id: string;
  title: string;
  updated_at: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  extra_metadata?: {
    skill_results?: Array<{
      skill_name: string;
      render_type: string;
      data: any;
      cached?: boolean;
    }>;
    type?: string;
    skill_name?: string;
    render_type?: string;
    data?: any;
    cached?: boolean;
  };
  skillResult?: {
    skill_name: string;
    render_type?: string;
    data: any;
    cached?: boolean;
  };
}

interface TokenUsageData {
  total_input_tokens: number;
  total_output_tokens: number;
  total_cache_write_tokens: number;
  total_cache_read_tokens: number;
  total_cost_usd: number;
  total_api_calls: number;
}

const funkyWords = [
  "talking to the llm gods...",
  "filtering tokens...",
  "brewing the code...",
  "banging my head...",
  "engineers engineering...",
  "summoning the algorithms...",
  "consulting the neural nets...",
  "debugging reality...",
  "compiling thoughts...",
  "optimizing brain cells...",
  "yelling at tensors...",
  "bribing the AI overlords...",
  "caffeinating the models...",
  "untangling the weights...",
  "negotiating with gradients...",
  "begging for convergence..."
];

export default function ChatPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [loadingWordIndex, setLoadingWordIndex] = useState(0);
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<TokenUsageData | null>(null);
  const [tokenUsageLoading, setTokenUsageLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
    loadConversations();
  }, []);

  // Load messages and token usage when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      loadMessages(currentConversationId);
      fetchTokenUsage(currentConversationId);
    }
  }, [currentConversationId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Stream funky loading messages character by character
  useEffect(() => {
    if (!loading) {
      setStreamedText("");
      setIsStreaming(false);
      setLoadingWordIndex(0);
      return;
    }

    setIsStreaming(true);
    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let streamInterval: NodeJS.Timeout;

    const streamNextChar = () => {
      const currentWord = funkyWords[currentWordIndex];

      if (currentCharIndex < currentWord.length) {
        // Stream next character
        setStreamedText(currentWord.substring(0, currentCharIndex + 1));
        currentCharIndex++;
      } else {
        // Word complete, wait 2 seconds then move to next word
        clearInterval(streamInterval);
        setTimeout(() => {
          if (loading) {
            currentWordIndex = (currentWordIndex + 1) % funkyWords.length;
            currentCharIndex = 0;
            setStreamedText("");
            streamInterval = setInterval(streamNextChar, 50); // 50ms per character
          }
        }, 2000); // 2 second pause between words
      }
    };

    streamInterval = setInterval(streamNextChar, 50); // 50ms per character

    return () => {
      clearInterval(streamInterval);
    };
  }, [loading]);

  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/me", {
        credentials: "include",
      });

      if (!response.ok) {
        router.push("/login");
        return;
      }

      const data = await response.json();
      setUserEmail(data.email);
    } catch (err) {
      router.push("/login");
    }
  };

  const loadConversations = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/conversations", {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
        }
        return;
      }

      const data = await response.json();
      setConversations(data);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/conversations/${conversationId}/messages`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) return;

      const data = await response.json();

      // Process messages to extract skillResult from extra_metadata
      const processedMessages = data.map((msg: Message) => {
        // Check for skill result in extra_metadata (new format)
        if (msg.extra_metadata?.type === "skill_result") {
          return {
            ...msg,
            skillResult: {
              skill_name: msg.extra_metadata.skill_name,
              render_type: msg.extra_metadata.render_type,
              data: msg.extra_metadata.data,
              cached: msg.extra_metadata.cached,
            },
          };
        }
        // Fallback: check for old skill_results array format
        if (msg.extra_metadata?.skill_results && msg.extra_metadata.skill_results.length > 0) {
          const firstSkillResult = msg.extra_metadata.skill_results[0];
          return {
            ...msg,
            skillResult: {
              skill_name: firstSkillResult.skill_name,
              render_type: firstSkillResult.render_type,
              data: firstSkillResult.data,
              cached: firstSkillResult.cached,
            },
          };
        }
        return msg;
      });

      setMessages(processedMessages);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const fetchTokenUsage = async (conversationId: string) => {
    try {
      setTokenUsageLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/v1/conversations/${conversationId}/token-usage`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch token usage");
        return;
      }

      const data = await response.json();
      setTokenUsage(data);
    } catch (err) {
      console.error("Failed to fetch token usage:", err);
    } finally {
      setTokenUsageLoading(false);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title: "new conversation" }),
      });

      if (!response.ok) return;

      const data = await response.json();
      setCurrentConversationId(data.id);
      setMessages([]);
      await loadConversations();
    } catch (err) {
      console.error("Failed to create conversation:", err);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Create conversation if none exists
    if (!currentConversationId) {
      await createNewConversation();
      return;
    }

    const userMessage = input;
    setInput("");
    setLoading(true);
    setError("");

    // Add user message optimistically
    const tempUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/conversations/${currentConversationId}/messages/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ message: userMessage }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      let assistantMessage = "";
      const tempAssistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempAssistantMsg]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              console.log("[FRONTEND-STREAM] Received:", parsed);

              // Handle different message types from skillgraph
              if (parsed.type === "chunk" && parsed.content) {
                console.log("[FRONTEND-STREAM] Processing chunk:", parsed.content.substring(0, 50));

                // Text chunk from LLM
                assistantMessage += parsed.content;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === tempAssistantMsg.id
                      ? { ...msg, content: assistantMessage }
                      : msg
                  )
                );
              } else if (parsed.type === "skill_result") {
                console.log("[FRONTEND-STREAM] Processing skill_result:", parsed.skill_name, parsed.data);
                // Skill result - store separately for component rendering
                if (parsed.skill_name === "web_search" && parsed.data) {
                  // Store web search results for component rendering
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === tempAssistantMsg.id
                        ? {
                            ...msg,
                            content: assistantMessage,
                            skillResult: {
                              skill_name: "web_search",
                              data: parsed.data,
                              cached: parsed.cached || false,
                            },
                          }
                        : msg
                    )
                  );
                } else if (parsed.skill_name === "skillgraph_docs" && parsed.data?.message) {
                  // Documentation skill - show the answer from data.message
                  console.log("[FRONTEND-STREAM] Skillgraph docs message:", parsed.data.message.substring(0, 100));
                  assistantMessage += `\n\n${parsed.data.message}`;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === tempAssistantMsg.id
                        ? { ...msg, content: assistantMessage }
                        : msg
                    )
                  );
                } else if (parsed.skill_name === "ticket_booking" && parsed.data) {
                  // Ticket booking skill - store for SkillModeRenderer
                  console.log("[FRONTEND-STREAM] Ticket booking data:", parsed.data);
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === tempAssistantMsg.id
                        ? {
                            ...msg,
                            content: assistantMessage,
                            skillResult: {
                              skill_name: "ticket_booking",
                              render_type: parsed.render_type || "booking_workflow",
                              data: parsed.data,
                              cached: parsed.cached || false,
                            },
                          }
                        : msg
                    )
                  );
                } else {
                  console.log("[FRONTEND-STREAM] Unknown skill, dumping JSON");

                  // Other skills - format as readable text
                  assistantMessage += `\n\n${JSON.stringify(parsed.data, null, 2)}`;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === tempAssistantMsg.id
                        ? { ...msg, content: assistantMessage }
                        : msg
                    )
                  );
                }
              } else if (parsed.done) {
                console.log("[FRONTEND-STREAM] Received done signal");
                // Legacy done message
                break;
              } else {
                console.log("[FRONTEND-STREAM] Unknown message type:", parsed);
              }
            } catch (e) {
              console.error("[FRONTEND-STREAM] Failed to parse:", data, e);
            }
          }
        }
      }

      // Reload conversations to update timestamp
      await loadConversations();

      // Refresh token usage
      if (currentConversationId) {
        await fetchTokenUsage(currentConversationId);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex h-screen pt-16" style={{ backgroundColor: "#fff9ef" }}>
      {/* Sidebar */}
      <div
        className="w-64 border-r-2"
        style={{ borderColor: "#2d2d2d" }}
      >
        <div className="h-full flex flex-col p-4">
          <Button
            onClick={createNewConversation}
            className="w-full mb-4 font-medium"
            style={{
              backgroundColor: "#2d2d2d",
              color: "#fff9ef",
            }}
          >
            + new chat
          </Button>

          <div className="flex-1 overflow-y-auto space-y-2 mb-4">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setCurrentConversationId(conv.id)}
                className={`w-full text-left p-3 rounded border-2 transition-colors ${
                  currentConversationId === conv.id
                    ? "font-bold"
                    : ""
                }`}
                style={{
                  borderColor: currentConversationId === conv.id ? "#2d2d2d" : "#d0d0d0",
                  backgroundColor: currentConversationId === conv.id ? "rgba(45, 45, 45, 0.05)" : "transparent",
                  color: "#2d2d2d",
                }}
              >
                <div className="text-sm truncate">{conv.title}</div>
                <div className="text-xs mt-1" style={{ color: "#6a6a6a" }}>
                  {new Date(conv.updated_at).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>

          {/* User info and logout */}
          <div className="border-t-2 pt-3 pb-3 px-3" style={{ borderColor: "#2d2d2d" }}>
            <p className="text-xs font-medium truncate mb-2 text-center" style={{ color: "#6a6a6a" }}>
              {userEmail}
            </p>
            <button
              onClick={handleLogout}
              className="w-full text-xs py-2 px-3 rounded border-2 font-medium transition-colors"
              style={{
                borderColor: "#2d2d2d",
                backgroundColor: "#fff9ef",
                color: "#2d2d2d",
              }}
            >
              logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="max-w-3xl mx-auto mt-12 space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2" style={{ color: "#2d2d2d" }}>
                  how can i help you today?
                </h2>
                <p className="text-sm" style={{ color: "#6a6a6a" }}>
                  try one of these or ask me anything
                </p>
              </div>

              {/* Conversation Starters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setInput("do a web search on latest ai developments")}
                  className="p-4 text-left border-2 rounded-lg transition-all hover:shadow-md"
                  style={{
                    borderColor: "#d0d0d0",
                    backgroundColor: "#fff9ef",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2d2d2d";
                    e.currentTarget.style.backgroundColor = "rgba(45, 45, 45, 0.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d0d0d0";
                    e.currentTarget.style.backgroundColor = "#fff9ef";
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(45, 45, 45, 0.08)" }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="#2d2d2d" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: "#2d2d2d" }}>
                        web search
                      </h3>
                      <p className="text-sm" style={{ color: "#6a6a6a" }}>
                        search the web for latest information
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setInput("how do i create a skill in skillgraph?")}
                  className="p-4 text-left border-2 rounded-lg transition-all hover:shadow-md"
                  style={{
                    borderColor: "#d0d0d0",
                    backgroundColor: "#fff9ef",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2d2d2d";
                    e.currentTarget.style.backgroundColor = "rgba(45, 45, 45, 0.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d0d0d0";
                    e.currentTarget.style.backgroundColor = "#fff9ef";
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(45, 45, 45, 0.08)" }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="#2d2d2d" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: "#2d2d2d" }}>
                        create skills
                      </h3>
                      <p className="text-sm" style={{ color: "#6a6a6a" }}>
                        learn how to build custom skills
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setInput("how do i setup skillgraph locally?")}
                  className="p-4 text-left border-2 rounded-lg transition-all hover:shadow-md"
                  style={{
                    borderColor: "#d0d0d0",
                    backgroundColor: "#fff9ef",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2d2d2d";
                    e.currentTarget.style.backgroundColor = "rgba(45, 45, 45, 0.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d0d0d0";
                    e.currentTarget.style.backgroundColor = "#fff9ef";
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(45, 45, 45, 0.08)" }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="#2d2d2d" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: "#2d2d2d" }}>
                        setup guide
                      </h3>
                      <p className="text-sm" style={{ color: "#6a6a6a" }}>
                        install and configure skillgraph
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setInput("how does skillgraph work?")}
                  className="p-4 text-left border-2 rounded-lg transition-all hover:shadow-md"
                  style={{
                    borderColor: "#d0d0d0",
                    backgroundColor: "#fff9ef",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2d2d2d";
                    e.currentTarget.style.backgroundColor = "rgba(45, 45, 45, 0.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d0d0d0";
                    e.currentTarget.style.backgroundColor = "#fff9ef";
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(45, 45, 45, 0.08)" }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="#2d2d2d" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: "#2d2d2d" }}>
                        how it works
                      </h3>
                      <p className="text-sm" style={{ color: "#6a6a6a" }}>
                        understand skillgraph's architecture
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setInput("how do i setup guardrails?")}
                  className="p-4 text-left border-2 rounded-lg transition-all hover:shadow-md"
                  style={{
                    borderColor: "#d0d0d0",
                    backgroundColor: "#fff9ef",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2d2d2d";
                    e.currentTarget.style.backgroundColor = "rgba(45, 45, 45, 0.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d0d0d0";
                    e.currentTarget.style.backgroundColor = "#fff9ef";
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(45, 45, 45, 0.08)" }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="#2d2d2d" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: "#2d2d2d" }}>
                        guardrails
                      </h3>
                      <p className="text-sm" style={{ color: "#6a6a6a" }}>
                        add safety and validation rules
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setInput("how do i integrate with the frontend?")}
                  className="p-4 text-left border-2 rounded-lg transition-all hover:shadow-md"
                  style={{
                    borderColor: "#d0d0d0",
                    backgroundColor: "#fff9ef",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2d2d2d";
                    e.currentTarget.style.backgroundColor = "rgba(45, 45, 45, 0.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#d0d0d0";
                    e.currentTarget.style.backgroundColor = "#fff9ef";
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(45, 45, 45, 0.08)" }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="#2d2d2d" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1" style={{ color: "#2d2d2d" }}>
                        frontend integration
                      </h3>
                      <p className="text-sm" style={{ color: "#6a6a6a" }}>
                        connect your frontend app
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg border-2 ${
                  msg.role === "user" ? "ml-auto" : "mr-auto"
                }`}
                style={{
                  borderColor: "#2d2d2d",
                  backgroundColor: msg.role === "user" ? "#2d2d2d" : "#fff9ef",
                  color: msg.role === "user" ? "#fff9ef" : "#2d2d2d",
                }}
              >
                <div className="text-xs mb-2 opacity-70">
                  {msg.role === "user" ? "you" : "skillgraph"}
                </div>
                {msg.role === "assistant" ? (
                  <>
                    {/* Render skill results as components */}
                    {msg.skillResult?.skill_name === "web_search" && msg.skillResult.data && (
                      <div className="mb-4">
                        <WebSearchResults
                          data={msg.skillResult.data}
                          cached={msg.skillResult.cached}
                        />
                      </div>
                    )}

                    {msg.skillResult?.skill_name === "ticket_booking" && msg.skillResult.data && (
                      <div className="mb-4">
                        <SkillModeRenderer
                          skillName="ticket_booking"
                          renderType={msg.skillResult.render_type || "booking_workflow"}
                          data={msg.skillResult.data}
                          onUserAction={async (input: string) => {
                            // Send user action back to skill by simulating a message send
                            console.log("[TICKET_BOOKING] User action:", input);

                            if (!currentConversationId || loading) return;

                            setInput(""); // Clear input field
                            setLoading(true);

                            // Add user message optimistically
                            const tempUserMsg: Message = {
                              id: Date.now().toString(),
                              role: "user",
                              content: input,
                              created_at: new Date().toISOString(),
                            };
                            setMessages((prev) => [...prev, tempUserMsg]);

                            try {
                              const response = await fetch(
                                `http://localhost:8000/api/v1/conversations/${currentConversationId}/messages/stream`,
                                {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  credentials: "include",
                                  body: JSON.stringify({ message: input }),
                                }
                              );

                              if (!response.ok) throw new Error("Failed to send message");

                              const reader = response.body?.getReader();
                              if (!reader) return;

                              let assistantMessage = "";
                              const tempAssistantMsg: Message = {
                                id: (Date.now() + 1).toString(),
                                role: "assistant",
                                content: "",
                                created_at: new Date().toISOString(),
                              };
                              setMessages((prev) => [...prev, tempAssistantMsg]);

                              // Stream handling (same as sendMessage)
                              while (true) {
                                const { done, value } = await reader.read();
                                if (done) break;

                                const chunk = new TextDecoder().decode(value);
                                const lines = chunk.split("\n");

                                for (const line of lines) {
                                  if (line.startsWith("data: ")) {
                                    const data = line.slice(6);
                                    if (data === "[DONE]") continue;

                                    try {
                                      const parsed = JSON.parse(data);

                                      if (parsed.type === "chunk" && parsed.content) {
                                        assistantMessage += parsed.content;
                                        setMessages((prev) =>
                                          prev.map((msg) =>
                                            msg.id === tempAssistantMsg.id
                                              ? { ...msg, content: assistantMessage }
                                              : msg
                                          )
                                        );
                                      } else if (parsed.type === "skill_result") {
                                        console.log("[TICKET_BOOKING] Skill result:", parsed.data);
                                        setMessages((prev) =>
                                          prev.map((msg) =>
                                            msg.id === tempAssistantMsg.id
                                              ? {
                                                  ...msg,
                                                  content: assistantMessage,
                                                  skillResult: {
                                                    skill_name: "ticket_booking",
                                                    render_type: parsed.render_type || "booking_workflow",
                                                    data: parsed.data,
                                                    cached: false,
                                                  },
                                                }
                                              : msg
                                          )
                                        );
                                      } else if (parsed.done) {
                                        break;
                                      }
                                    } catch (e) {
                                      console.error("[TICKET_BOOKING] Parse error:", e);
                                    }
                                  }
                                }
                              }

                              setLoading(false);
                            } catch (err) {
                              console.error("[TICKET_BOOKING] Error:", err);
                              setError("Failed to send action");
                              setLoading(false);
                            }
                          }}
                        />
                      </div>
                    )}

                    {/* Render text content as markdown */}
                    {msg.content && (
                      <div
                        className="prose prose-sm max-w-none"
                        style={{
                          color: "#2d2d2d",
                        }}
                      >
                        <style jsx>{`
                          div :global(h1),
                          div :global(h2),
                          div :global(h3),
                          div :global(h4),
                          div :global(h5),
                          div :global(h6) {
                            color: #2d2d2d;
                            font-weight: 700;
                            margin-top: 1em;
                            margin-bottom: 0.5em;
                          }
                          div :global(p) {
                            color: #2d2d2d;
                            margin: 0.75em 0;
                          }
                          div :global(strong) {
                            color: #2d2d2d;
                            font-weight: 700;
                          }
                          div :global(code) {
                            background-color: rgba(45, 45, 45, 0.08);
                            color: #2d2d2d;
                            padding: 0.2em 0.4em;
                            border-radius: 3px;
                            font-size: 0.9em;
                          }
                          div :global(pre) {
                            background-color: rgba(45, 45, 45, 0.08);
                            border: 2px solid #d0d0d0;
                            border-radius: 6px;
                            padding: 1em;
                            overflow-x: auto;
                            margin: 1em 0;
                          }
                          div :global(pre code) {
                            background-color: transparent;
                            padding: 0;
                            color: #2d2d2d;
                          }
                          div :global(ul),
                          div :global(ol) {
                            color: #2d2d2d;
                            margin: 0.75em 0;
                            padding-left: 1.5em;
                          }
                          div :global(li) {
                            color: #2d2d2d;
                            margin: 0.25em 0;
                          }
                          div :global(a) {
                            color: #2d2d2d;
                            text-decoration: underline;
                          }
                          div :global(blockquote) {
                            border-left: 3px solid #2d2d2d;
                            padding-left: 1em;
                            color: #6a6a6a;
                            margin: 1em 0;
                          }
                          div :global(table) {
                            border-collapse: collapse;
                            width: 100%;
                            margin: 1em 0;
                          }
                          div :global(th),
                          div :global(td) {
                            border: 1px solid #d0d0d0;
                            padding: 0.5em;
                            color: #2d2d2d;
                          }
                          div :global(th) {
                            background-color: rgba(45, 45, 45, 0.05);
                            font-weight: 700;
                          }
                        `}</style>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
              </div>
            </div>
          ))}

          {/* Funky loading indicator */}
          {loading && isStreaming && (
            <div className="flex justify-start">
              <div
                className="max-w-[80%] p-4 rounded-lg border-2"
                style={{
                  borderColor: "#2d2d2d",
                  backgroundColor: "#fff9ef",
                }}
              >
                <div className="text-xs mb-2 opacity-70">skillgraph</div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: "#2d2d2d" }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#2d2d2d" }}
                  >
                    {streamedText}
                    <span className="animate-pulse">|</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />

          {error && (
            <div className="p-4 border-2 rounded-lg" style={{ borderColor: "#ff4444", backgroundColor: "#fff0f0" }}>
              <p style={{ color: "#cc0000" }}>{error}</p>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="border-t-2 pt-3 pb-3 px-3" style={{ borderColor: "#2d2d2d" }}>
          <div className="flex gap-2 items-stretch">
            {currentConversationId && (
              <TokenStatsDialog usage={tokenUsage} loading={tokenUsageLoading} />
            )}
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="type a message..."
              disabled={loading}
              className="flex-1 border-2 text-xs rounded"
              style={{
                borderColor: "#2d2d2d",
                padding: "0.5rem 0.75rem",
              }}
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="font-medium text-xs rounded border-2 transition-colors"
              style={{
                backgroundColor: "#2d2d2d",
                color: "#fff9ef",
                padding: "0.5rem 0.75rem",
                borderColor: "#2d2d2d",
              }}
            >
              {loading ? "..." : "send"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
