"use client";

import { useEffect, useState } from "react";

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: "#fff9ef" }}>
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-12 max-w-7xl mx-auto">
          {/* Table of Contents - Fixed */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="fixed top-24 w-64">
              <h3
                className="text-sm font-bold mb-4 uppercase tracking-wide"
                style={{ color: "#2d2d2d" }}
              >
                contents
              </h3>
              <nav className="space-y-2">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block text-left text-sm py-1 transition-all ${
                      activeSection === item.id ? "font-bold" : ""
                    }`}
                    style={{
                      color: activeSection === item.id ? "#2d2d2d" : "#6a6a6a",
                    }}
                  >
                    {item.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            <h1
              className="text-4xl md:text-5xl font-bold mb-8"
              style={{ color: "#2d2d2d" }}
            >
              About skillgraph
            </h1>

            <Section id="what-is-skillgraph">
              <H2>What is skillgraph?</H2>
              <P>
                skillgraph is my attempt at rethinking how AI agents work. i got tired of the existing frameworks - they're expensive, hard to control, and make simple things complicated. So i built something different.
              </P>
              <P>
                The core idea: instead of giving agents a bunch of low-level tool functions to call, give them <strong>skills</strong>. skills are more sophisticated units that know when they're relevant, can orchestrate multiple tools, handle multi-turn workflows, and have their own business logic. they can even act as subagents when the task requires it, and they improve from feedback.
              </P>
              <P>
                Think of it this way:
              </P>
              <ul className="space-y-2 ml-6 text-lg" style={{ color: "#4a4a4a" }}>
                <li>• <strong style={{ color: "#2d2d2d" }}>traditional frameworks:</strong> agent has a toolbox → picks tools → calls them</li>
                <li>• <strong style={{ color: "#2d2d2d" }}>skillgraph:</strong> agent has skills → delegates to the right skill → skill handles everything</li>
              </ul>
            </Section>

            <Section id="why-skills">
              <H2>why skills instead of tools?</H2>
              <P>
                Traditional tool-calling is broken. here's what actually happens when you give an agent a bunch of tools:
              </P>
              <ol className="space-y-4 ml-6 text-lg" style={{ color: "#4a4a4a" }}>
                <li>
                  <strong style={{ color: "#2d2d2d" }}>1. the agent wastes tokens planning.</strong> it has to figure out which tools to call, in what order, and how to combine the results. every decision burns tokens.
                </li>
                <li>
                  <strong style={{ color: "#2d2d2d" }}>2. No error recovery.</strong> tool fails? the agent just flails around or gives up.
                </li>
                <li>
                  <strong style={{ color: "#2d2d2d" }}>3. Multi-turn workflows are a nightmare.</strong> try implementing a ticket booking flow with confirmations and payment collection. you'll end up with brittle state machines everywhere.
                </li>
                <li>
                  <strong style={{ color: "#2d2d2d" }}>4. Zero control.</strong> you can't easily constrain what the agent does because you're just handing it functions and hoping.
                </li>
              </ol>
              <P>
                Skills fix all of this. a skill is a more sophisticated unit that:
              </P>
              <ul className="space-y-2 ml-6 text-lg" style={{ color: "#4a4a4a" }}>
                <li>• knows when it's relevant (intent detection)</li>
                <li>• orchestrates multiple tools internally</li>
                <li>• handles multi-turn workflows natively (Skill Mode)</li>
                <li>• has its own business logic and error handling</li>
                <li>• can improve from feedback</li>
              </ul>
              <P>
                the agent just delegates to the skill. The skill does the work. Less overhead, less cost, more control.
              </P>
            </Section>

            <Section id="subject-object">
              <H2>subject-object memory architecture</H2>
              <P>
                this is the core of how skillgraph manages conversation state, and it replaces complex RAG systems with something way simpler.
              </P>
              <H3>The problem with traditional approaches</H3>
              <P>
                most frameworks use rag: embed everything, store it in a vector database, retrieve relevant chunks on every query. it works, but it's slow, expensive, and overkill for conversation state.
              </P>
              <H3>The Subject-Object solution</H3>
              <P>
                skillgraph tracks two things:
              </P>
              <ul className="space-y-3 ml-6 text-lg" style={{ color: "#4a4a4a" }}>
                <li>
                  • <strong style={{ color: "#2d2d2d" }}>Subject:</strong> what the user wants. goals, constraints, preferences. This <em>accumulates</em> over the conversation.
                  <br />
                  <span className="text-sm" style={{ color: "#6a6a6a" }}>
                    Example: {"goals: ['find events'], constraints: ['Chennai', 'this weekend']"}
                  </span>
                </li>
                <li>
                  • <strong style={{ color: "#2d2d2d" }}>Object:</strong> what's being discussed right now. type, attributes, cached data. This <em>switches</em> when the topic changes.
                  <br />
                  <span className="text-sm" style={{ color: "#6a6a6a" }}>
                    Example: {"type: 'events', attributes: {location: 'Chennai', timeframe: 'this weekend'}, data: {...}"}
                  </span>
                </li>
              </ul>
              <P>
                every message, a fast Utility LLM (Llama-3-8B, ~200ms) analyzes the user's input and updates the Subject and Object. that's it. no embeddings, no vector search for state tracking.
              </P>
              <H3>Why this mimics natural conversation</H3>
              <P>
                think about how humans talk:
              </P>
              <ul className="space-y-2 ml-6 text-lg" style={{ color: "#4a4a4a" }}>
                <li>• The <strong>Subject</strong> is what you're trying to accomplish. It stays consistent unless you explicitly change goals.</li>
                <li>• The <strong>Object</strong> is what you're talking about right now. It shifts as the conversation moves between topics.</li>
              </ul>
              <P>
                Example conversation:
              </P>
              <Code>{`User: "Find events in Chennai this weekend"
→ Subject: {goals: ["find events"], constraints: ["Chennai", "this weekend"]}
→ Object: {type: "events", location: "Chennai", timeframe: "this weekend"}

User: "What about restaurants?"
→ Subject: {goals: ["find events"], constraints: ["Chennai", "this weekend"]} (unchanged)
→ Object: {type: "restaurants", location: "Chennai"} (switched!)`}</Code>
              <P>
                The Subject persists (you're still planning your weekend in Chennai), but the Object switched from events to restaurants. the old object gets archived in Object History.
              </P>
              <P>
                this is how humans think. skillgraph just makes it explicit.
              </P>
            </Section>

            <Section id="caching">
              <H2>caching strategy</H2>
              <P>
                skillgraph has three caching layers that work together to reduce costs and improve speed:
              </P>
              <H3>1. Anthropic prompt caching (cost optimization)</H3>
              <P>
                Anthropic's API lets you cache parts of your prompt. Most frameworks cache everything, which is wasteful. skillgraph only caches what's actually reused:
              </P>
              <ul className="space-y-2 ml-6 text-lg" style={{ color: "#4a4a4a" }}>
                <li>✅ <strong style={{ color: "#2d2d2d" }}>System prompt (static instructions):</strong> Shared across ALL users, ALL conversations. First request writes to cache (~5000 tokens), every subsequent request reads from cache (~500 tokens, 90% discount).</li>
                <li>❌ <strong style={{ color: "#2d2d2d" }}>Conversation history:</strong> Unique per conversation. No reuse = no benefit from caching.</li>
                <li>❌ <strong style={{ color: "#2d2d2d" }}>Subject/Object state:</strong> Unique per conversation. Same reason.</li>
              </ul>
              <P>
                Result: 89% cost reduction on system prompt tokens. For 500 messages, that's ~$7 saved at $3/M tokens.
              </P>
              <H3>2. Redis conversation cache (speed optimization)</H3>
              <P>
                Conversation history is cached in Redis. First query hits PostgreSQL (~50ms), subsequent queries hit Redis (&lt;5ms). Cache invalidates automatically when new messages are posted.
              </P>
              <H3>3. PostgreSQL (source of truth)</H3>
              <P>
                Everything lives in PostgreSQL: messages, Subject/Object state, vector embeddings for semantic search. Redis is just a fast layer on top.
              </P>
            </Section>

            <Section id="intent">
              <H2>intent understanding</H2>
              <P>
                Skills need to know when they're relevant. skillgraph uses a simple but effective approach:
              </P>
              <P>
                Every skill has a description and example queries. When a user sends a message, the system:
              </P>
              <ol className="space-y-2 ml-6 text-lg" style={{ color: "#4a4a4a" }}>
                <li>1. Uses a fast classifier (Utility LLM) to extract intent and keywords</li>
                <li>2. Compares against skill descriptions using semantic similarity + keyword matching</li>
                <li>3. Scores each skill (confidence 0-1)</li>
                <li>4. Routes to the highest-confidence skill if above threshold</li>
              </ol>
              <P>
                Thresholds:
              </P>
              <ul className="space-y-1 ml-6 text-sm" style={{ color: "#6a6a6a" }}>
                <li>• <strong>High confidence:</strong> 0.60 - Direct match, execute immediately</li>
                <li>• <strong>Low confidence:</strong> 0.25 - Minimum threshold to consider</li>
                <li>• <strong>Below 0.25:</strong> No skill match, agent responds directly</li>
              </ul>
              <P>
                This is configurable in agent.config.yml if you want skills to trigger more/less aggressively.
              </P>
            </Section>

            <Section id="skill-mode">
              <H2>skill mode (multi-turn workflows)</H2>
              <P>
                Some tasks can't be done in one message. Booking a ticket needs multiple steps: search → select → confirm → collect payment info → book. Traditional frameworks make this painful.
              </P>
              <P>
                skillgraph has <strong>Skill Mode</strong>: a skill can take control of the conversation for as many turns as it needs.
              </P>
              <H3>How it works</H3>
              <P>
                When a skill enters Skill Mode:
              </P>
              <ol className="space-y-2 ml-6 text-lg" style={{ color: "#4a4a4a" }}>
                <li>1. The skill gets exclusive control of the conversation</li>
                <li>2. User responses go directly to the skill (not the main agent)</li>
                <li>3. The skill maintains state across turns</li>
                <li>4. The skill can render custom UI (buttons, forms, confirmation dialogs)</li>
                <li>5. When done, the skill exits and returns control to the agent</li>
              </ol>
              <P>
                Example flow (ticket booking):
              </P>
              <Code>{`User: "Book tickets for the comedy show"
→ Skill enters Skill Mode

Skill: Shows event details + "Confirm booking?" button
→ State: {step: "confirm", event_id: "123"}

User: Clicks "Confirm"
→ State: {step: "payment", event_id: "123"}

Skill: "Payment method?"
User: "Credit card"
→ State: {step: "collect_card", event_id: "123", payment_method: "card"}

Skill: Collects card info, processes payment, books tickets
→ Skill exits Skill Mode

Agent: "Booking confirmed! You're all set."`}</Code>
            </Section>

            <Section id="llm-fallback">
              <H2>llm fallback chain</H2>
              <P>
                LLM APIs fail. Rate limits, outages, timeouts - it happens. skillgraph doesn't just error out.
              </P>
              <P>
                Every request goes through a fallback chain:
              </P>
              <ol className="space-y-2 ml-6 text-lg" style={{ color: "#4a4a4a" }}>
                <li>1. <strong style={{ color: "#2d2d2d" }}>Primary (Beta - Haiku 4.5):</strong> Fast and cheap for most queries</li>
                <li>2. <strong style={{ color: "#2d2d2d" }}>Fallback (Alpha - Sonnet 4.5):</strong> If Beta fails, try Alpha</li>
                <li>3. <strong style={{ color: "#2d2d2d" }}>Retry (Alpha again):</strong> Network transients, retry once</li>
                <li>4. <strong style={{ color: "#2d2d2d" }}>Error:</strong> Only if all 3 attempts fail</li>
              </ol>
              <P>
                For Subject/Object analysis (Utility LLM):
              </P>
              <ol className="space-y-2 ml-6 text-lg" style={{ color: "#4a4a4a" }}>
                <li>1. Try Utility LLM (Llama-3-8B)</li>
                <li>2. If fails → Try Gamma LLM (also Llama-3-8B, different instance)</li>
                <li>3. If both fail → Use previous state unchanged (graceful degradation)</li>
              </ol>
              <P>
                Result: Reliable operation even during partial outages.
              </P>
            </Section>

            <Section id="vector-search">
              <H2>vector search for recall</H2>
              <P>
                Sometimes users ask about something from earlier in the conversation: "What were those events you mentioned?" (at message 50).
              </P>
              <P>
                Recent history only shows the last ~20 messages (messages 30-50). The events were at message 10. Without recall, the agent has no idea.
              </P>
              <P>
                skillgraph uses <strong>pgvector</strong> to semantically search past messages:
              </P>
              <ol className="space-y-2 ml-6 text-lg" style={{ color: "#4a4a4a" }}>
                <li>1. every message gets embedded (SentenceTransformer, 384 dims)</li>
                <li>2. Embeddings stored in PostgreSQL with pgvector</li>
                <li>3. On each query, search for top 3 semantically similar messages</li>
                <li>4. Prepend recalled messages to conversation history</li>
              </ol>
              <P>
                Security: Vector search is scoped to the current conversation_id. No cross-conversation leaks.
              </P>
            </Section>

            <Section id="conversation-summarization">
              <H2>conversation summarization</H2>
              <P>
                Long conversations exceed context limits. Including full history is expensive. skillgraph uses <strong>incremental summarization</strong>:
              </P>
              <ul className="space-y-2 ml-6 text-lg" style={{ color: "#4a4a4a" }}>
                <li>• Every 10 messages (configurable), summarize the conversation so far</li>
                <li>• Next summary includes the previous summary + new messages (compounding)</li>
                <li>• Include summary + recent full history in prompts</li>
              </ul>
              <P>
                Example:
              </P>
              <Code>{`Message 1-10: Full history
Message 11-20: Summary(1-10) + Full history(11-20)
Message 21-30: Summary(1-20) + Full history(21-30)
...`}</Code>
              <P>
                Result: Conversations can go on indefinitely without hitting context limits.
              </P>
            </Section>

            <Section id="current-status">
              <H2>current status</H2>
              <P>
                skillgraph is a <strong>work in progress</strong>. It's not production-ready, but it works, and the core ideas are solid.
              </P>
              <H3>What works</H3>
              <ul className="space-y-1 ml-6 text-lg" style={{ color: "#4a4a4a" }}>
                <li>• Basic agent with chat, streaming, multi-LLM support</li>
                <li>• Skills system with routing and execution</li>
                <li>• Interactive skills (Skill Mode) for multi-turn workflows</li>
                <li>• Dual-layer caching (89% cost savings + speed optimization)</li>
                <li>• Subject-Object tracking with Utility LLM</li>
                <li>• llm fallback chain for reliability</li>
                <li>• Vector search for message recall</li>
                <li>• conversation summarization</li>
                <li>• Learning system (collecting data, improvement loop is basic)</li>
              </ul>
              <H3>What's experimental</H3>
              <ul className="space-y-1 ml-6 text-lg" style={{ color: "#4a4a4a" }}>
                <li>• Message planning (works but needs more testing)</li>
                <li>• Multi-message streaming (parallel skill execution)</li>
                <li>• Performance at scale (haven't tested with thousands of concurrent users)</li>
              </ul>
              <H3>What's missing</H3>
              <ul className="space-y-1 ml-6 text-lg" style={{ color: "#4a4a4a" }}>
                <li>• Observability (Prometheus + Grafana integration pending)</li>
                <li>• Production testing</li>
                <li>• More unit tests and integration tests</li>
                <li>• Deployment guides (k8s configs, etc.)</li>
              </ul>
            </Section>

            <Section id="license">
              <H2>license & contributing</H2>
              <P>
                skillgraph is <strong>open source</strong> under the <strong>Apache 2.0 license</strong>. You can:
              </P>
              <ul className="space-y-1 ml-6 text-lg" style={{ color: "#4a4a4a" }}>
                <li>• Use it commercially</li>
                <li>• Modify it</li>
                <li>• Distribute it</li>
                <li>• Patent it</li>
              </ul>
              <P>
                The code is on GitHub, contributions are welcome. No strict guidelines yet - just be nice and write decent code.
              </P>
              <P>
                If you:
              </P>
              <ul className="space-y-1 ml-6 text-lg" style={{ color: "#4a4a4a" }}>
                <li>• Find bugs → Open an issue</li>
                <li>• Have ideas → Open a discussion</li>
                <li>• Want to contribute → PRs welcome</li>
                <li>• Built something cool → Show me</li>
              </ul>
            </Section>

            <div className="mt-16 pt-8 border-t-2" style={{ borderColor: "#2d2d2d" }}>
              <P>
                <strong>Remember:</strong> This is experimental. it works, but it's not perfect. Use it, break it, tell me what's wrong, and let's make it better together.
              </P>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

const tocItems = [
  { id: "what-is-skillgraph", title: "what is skillgraph?" },
  { id: "why-skills", title: "why skills?" },
  { id: "subject-object", title: "subject-object memory" },
  { id: "caching", title: "caching strategy" },
  { id: "intent", title: "intent understanding" },
  { id: "skill-mode", title: "skill mode" },
  { id: "llm-fallback", title: "llm fallback chain" },
  { id: "vector-search", title: "vector search" },
  { id: "conversation-summarization", title: "conversation summarization" },
  { id: "current-status", title: "current status" },
  { id: "license", title: "license & contributing" },
];

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-24">
      {children}
    </section>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-3xl font-bold mb-6 mt-8"
      style={{ color: "#2d2d2d" }}
    >
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-2xl font-bold mb-4 mt-6"
      style={{ color: "#2d2d2d" }}
    >
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-lg mb-4 leading-relaxed"
      style={{ color: "#4a4a4a" }}
    >
      {children}
    </p>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre
      className="text-sm p-4 rounded-lg overflow-x-auto mb-4 border-2"
      style={{
        backgroundColor: "rgba(45, 45, 45, 0.05)",
        borderColor: "#2d2d2d",
        color: "#2d2d2d",
      }}
    >
      {children}
    </pre>
  );
}
