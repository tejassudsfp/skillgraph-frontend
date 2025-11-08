import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: "#fff9ef" }}>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1
            className="text-5xl md:text-6xl font-bold mb-8 leading-tight"
            style={{ color: "#2d2d2d" }}
          >
            a framework for building agents that work.
          </h1>

          <p
            className="text-xl md:text-2xl mb-6 leading-relaxed"
            style={{ color: "#4a4a4a" }}
          >
            skillgraph is an experimental agentic framework built to solve the problems i kept running into with existing tools. it's{" "}
            <span className="font-semibold">open source</span> (apache 2.0), it's{" "}
            <span className="font-semibold">cheaper</span> to run, and it gives you{" "}
            <span className="font-semibold">actual control</span> over what your agent does.
          </p>

          <p
            className="text-lg mb-8 leading-relaxed"
            style={{ color: "#6a6a6a" }}
          >
            instead of giving agents a mess of low-level tool functions to fumble through, skillgraph uses <span className="font-semibold">skills</span> - more sophisticated units that handle specific tasks with their own logic and workflows. they can orchestrate multiple tools, manage state, and even act as subagents when needed.
          </p>

          <div className="flex gap-4">
            <Link href="/login">
              <Button
                size="lg"
                className="text-lg px-8 py-6 font-medium"
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#fff9ef",
                }}
              >
                try it now
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 font-medium border-2"
                style={{
                  borderColor: "#2d2d2d",
                  color: "#2d2d2d",
                  backgroundColor: "transparent",
                }}
              >
                read the docs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why I Built This */}
      <section
        className="py-20"
        style={{ backgroundColor: "rgba(45, 45, 45, 0.03)" }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold mb-8"
              style={{ color: "#2d2d2d" }}
            >
              why i built this
            </h2>

            <div className="space-y-6 text-lg" style={{ color: "#4a4a4a" }}>
              <p>
                i was frustrated with existing frameworks. every tool i tried had the same problems:
              </p>

              <ul className="space-y-4 ml-6">
                <li className="flex items-start">
                  <span className="mr-3 mt-1">•</span>
                  <span>
                    <strong style={{ color: "#2d2d2d" }}>cost:</strong> running agents with traditional tool-calling is expensive. every tool call wastes tokens on planning, coordination, and back-and-forth.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1">•</span>
                  <span>
                    <strong style={{ color: "#2d2d2d" }}>control:</strong> hard to control what the agent does when you're just giving it functions and hoping it picks the right ones.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1">•</span>
                  <span>
                    <strong style={{ color: "#2d2d2d" }}>complexity:</strong> multi-turn workflows are painful to implement. want to book a ticket with confirmations and payment? good luck.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1">•</span>
                  <span>
                    <strong style={{ color: "#2d2d2d" }}>tool-calling sucks:</strong> agents spend forever deciding which tools to call and in what order, burning tokens the whole time.
                  </span>
                </li>
              </ul>

              <p>
                so i built skillgraph. it's not production-ready yet, but it works, and the core ideas are solid. use it, break it, tell me what's wrong.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes It Different */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold mb-8"
              style={{ color: "#2d2d2d" }}
            >
              what makes it different
            </h2>

            <div className="space-y-8">
              <Feature
                title="skills handle their own logic"
                description="instead of the agent burning tokens to figure out which tools to call and how to chain them, skills just do their job. the agent delegates, the skill executes. less overhead, less waste."
              />

              <Feature
                title="native multi-turn support"
                description="need a workflow that spans multiple messages? skills can enter 'skill mode' and take control of the conversation until the task is done. no awkward workarounds."
              />

              <Feature
                title="subject-object memory architecture"
                description="replaces complex rag systems with simple state tracking. the subject tracks what the user wants (goals, constraints, preferences). the object tracks what's being discussed right now. fast, cheap, and it actually works."
              />

              <Feature
                title="smart caching that saves money"
                description="anthropic prompt caching for static content (89% cost reduction on system prompts) + redis for conversation history (50ms → 5ms retrieval). multi-layer optimization that compounds."
              />

              <Feature
                title="built-in reliability"
                description="llm fallback chains (beta → alpha → retry) mean 99.9% uptime even during partial outages. graceful degradation everywhere."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section
        className="py-20"
        style={{ backgroundColor: "rgba(45, 45, 45, 0.03)" }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: "#2d2d2d" }}
            >
              open source. apache 2.0.
            </h2>

            <p className="text-xl mb-8" style={{ color: "#4a4a4a" }}>
              use it commercially, modify it, do whatever you want. the code is on github, the license is permissive, and contributions are welcome.
            </p>

            <Link href="/about">
              <Button
                size="lg"
                className="text-lg px-8 py-6 font-medium"
                style={{
                  backgroundColor: "#2d2d2d",
                  color: "#fff9ef",
                }}
              >
                read the full docs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t-2" style={{ borderColor: "#2d2d2d" }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-2">
            <p className="text-sm" style={{ color: "#6a6a6a" }}>
              built by Tejas Parthasarathi Sudarshan •{" "}
              <a
                href="mailto:t@fanpit.live"
                className="underline"
                style={{ color: "#2d2d2d" }}
              >
                t@fanpit.live
              </a>
            </p>
            <p className="text-sm" style={{ color: "#6a6a6a" }}>
              licensed under apache 2.0 • copyright 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border-l-4 pl-6" style={{ borderColor: "#2d2d2d" }}>
      <h3 className="text-xl font-bold mb-2" style={{ color: "#2d2d2d" }}>
        {title}
      </h3>
      <p className="text-lg leading-relaxed" style={{ color: "#4a4a4a" }}>
        {description}
      </p>
    </div>
  );
}
