# skillgraph Frontend (Minimal)

Lightweight chat interface for skillgraph with custom SSE streaming and skill-based rendering.

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Build for Production

```bash
npm run build
npm start
```

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SKILLGRAPH_API_URL=http://localhost:8000
```

## Architecture

- **Custom SSE Streaming**: No Vercel AI SDK, direct control over streaming
- **Skill Renderers**: Modular UI components for different skill types
- **8 Dependencies**: Minimal, production-ready

## Components

- `chat-simple.tsx` - Main chat interface with SSE streaming
- `web-search-results.tsx` - Search result cards
- `skill-mode-renderer.tsx` - Interactive skill UIs
- `theme-provider.tsx` - Dark mode support

## Adding New Skills

Extend `skill-mode-renderer.tsx` with your skill name and UI component.
