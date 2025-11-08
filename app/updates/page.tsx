export default function updatesPage() {
  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: "#fff9ef" }}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#2d2d2d" }}
          >
            updates
          </h1>
          <p className="text-lg mb-12" style={{ color: "#6a6a6a" }}>
            a timeline of what's been built and improved in skillgraph.
          </p>

          {/* Timeline */}
          <div className="space-y-12">
            <Update
              version="v0"
              date="November 5, 2025"
              title="initial release"
              description="skillgraph is out. it's experimental, it's not production-ready, but it works. here's what it has:"
            >
              <Section title="core agent">
                <ul className="list-disc ml-6 space-y-1">
                  <li>chat and streaming support</li>
                  <li>multi-llm support (anthropic, openai, azure, bedrock, deepseek, together, huggingface)</li>
                  <li>async-first architecture</li>
                  <li>handles 1000+ concurrent requests</li>
                </ul>
              </Section>

              <Section title="skills system">
                <ul className="list-disc ml-6 space-y-1">
                  <li>custom skill creation and registration</li>
                  <li>intent-based skill routing</li>
                  <li>skill execution with multi-tool orchestration</li>
                  <li><strong>interactive skills (skill mode):</strong> native multi-turn workflows. skills can take control of the conversation for as many turns as needed. perfect for ticket booking, form filling, confirmation flows.</li>
                  <li>feedback collection for skill improvement</li>
                </ul>
              </Section>

              <Section title="subject-object memory architecture">
                <ul className="list-disc ml-6 space-y-1">
                  <li>subject tracking (what the user wants) - accumulates over conversation</li>
                  <li>object tracking (what's being discussed) - switches when topic changes</li>
                  <li>fast utility LLM analysis (llama-3-8b, ~200ms)</li>
                  <li>fallback chain: utility llm → gamma llm → previous state</li>
                  <li>replaces complex rag systems with simple state tracking</li>
                </ul>
              </Section>

              <Section title="caching (cost + speed)">
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>anthropic prompt caching:</strong> only caches static system prompt (shared across all conversations). achieves 89% cost reduction on system prompt tokens (~$7 saved per 500 messages)</li>
                  <li><strong>redis conversation cache:</strong> 50ms → &lt;5ms retrieval for conversation history</li>
                  <li><strong>postgresql:</strong> source of truth for all data</li>
                  <li>smart invalidation (cache busts when new messages posted)</li>
                </ul>
              </Section>

              <Section title="conversation intelligence">
                <ul className="list-disc ml-6 space-y-1">
                  <li><strong>strategy selection:</strong> auto-detects conversation type (lightweight vs detailed)</li>
                  <li><strong>conversation summarization:</strong> incremental summaries every 10 messages (configurable). enables indefinite conversation length without hitting context limits.</li>
                  <li><strong>vector search recall:</strong> pgvector semantic search for past messages. scoped to current conversation for security.</li>
                  <li>message indexing with embeddings (sentencetransformer, 384 dims)</li>
                </ul>
              </Section>

              <Section title="llm routing & fallback">
                <ul className="list-disc ml-6 space-y-1">
                  <li>complexity-based routing (simple → gamma, medium → beta, complex → alpha)</li>
                  <li><strong>fallback chain:</strong> beta (haiku 4.5) → alpha (sonnet 4.5) → alpha retry → error</li>
                  <li>reliable operation even during partial outages</li>
                  <li>graceful degradation everywhere</li>
                </ul>
              </Section>

              <Section title="learning system">
                <ul className="list-disc ml-6 space-y-1">
                  <li>feedback collection (explicit and implicit)</li>
                  <li>reflexion for self-improvement</li>
                  <li>skill learning storage</li>
                  <li>note: improvement loop is basic, needs work</li>
                </ul>
              </Section>

              <Section title="guardrails Guardrails & security security">
                <ul className="list-disc ml-6 space-y-1">
                  <li>rate limiting (per-minute and per-day)</li>
                  <li>sql injection detection</li>
                  <li>conversation-scoped vector search (no cross-conversation leaks)</li>
                </ul>
              </Section>

              <Section title="frontend">
                <ul className="list-disc ml-6 space-y-1">
                  <li>react chat UI with streaming</li>
                  <li>web search result cards</li>
                  <li>interactive skill mode renderer (buttons, forms)</li>
                  <li>minimalist design (8 dependencies)</li>
                </ul>
              </Section>

              <Section title="database">
                <ul className="list-disc ml-6 space-y-1">
                  <li>postgresql with async sqlalchemy</li>
                  <li>pgvector for semantic search</li>
                  <li>unified message table (merged messages + embeddings)</li>
                  <li>conversation state, summaries, skills, learning data</li>
                </ul>
              </Section>

              <Section title="what's missing">
                <ul className="list-disc ml-6 space-y-1">
                  <li>observability (prometheus + grafana integration pending)</li>
                  <li>production testing (haven't tested at scale)</li>
                  <li>more unit tests</li>
                  <li>deployment guides (k8s configs)</li>
                  <li>better documentation for advanced features</li>
                </ul>
              </Section>

              <p className="mt-6 text-lg" style={{ color: "#4a4a4a" }}>
                this is experimental. it works, but it's not perfect. use it, break it, tell me what's wrong.
              </p>
            </Update>
          </div>
        </div>
      </div>
    </div>
  );
}

function Update({
  version,
  date,
  title,
  description,
  children,
}: {
  version: string;
  date: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {/* Timeline dot */}
      <div className="absolute left-0 top-0 w-3 h-3 rounded-full" style={{ backgroundColor: "#2d2d2d" }}></div>

      {/* Content */}
      <div className="ml-8">
        <div className="flex items-baseline gap-4 mb-2">
          <span className="text-2xl font-bold" style={{ color: "#2d2d2d" }}>
            {version}
          </span>
          <span className="text-sm" style={{ color: "#6a6a6a" }}>
            {date}
          </span>
        </div>

        <h2 className="text-xl font-bold mb-3" style={{ color: "#2d2d2d" }}>
          {title}
        </h2>

        <p className="text-lg mb-6" style={{ color: "#4a4a4a" }}>
          {description}
        </p>

        <div className="space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-3" style={{ color: "#2d2d2d" }}>
        {title}
      </h3>
      <div className="text-base" style={{ color: "#4a4a4a" }}>
        {children}
      </div>
    </div>
  );
}
