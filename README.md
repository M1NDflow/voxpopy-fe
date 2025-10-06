# ViaDemocratia Frontend

Vue 3 single-page application that powers the ViaDemocratia conversational assistant for the Conseil municipal de Genève. It delivers streamed answers with contextual sources, video segments, and multilingual UI hints while persisting each user's session locally.

## Highlights
- Streaming chat interface backed by server-sent events, including graceful loading states and resettable sessions.
- Citation chips that open municipal documents or video segments in context.
- Advanced reasoning toggle that flags queries for higher-effort processing on the API side.
- Supabase-backed lookups for enriched video metadata and speaker details.
- Edge runtime proxy (`api/get-response.ts`) that forwards authenticated requests to the backend without exposing credentials in the browser.

## Tech Stack
- Vue 3 + Vite
- Pinia with persisted state
- Vue I18n for localization (default `fr`)
- Supabase client SDK
- Tailored CSS (no utility framework) and Heroicons

## Prerequisites
- Node.js 20.19+ (or 22.12+)
- npm 10+

## Getting Started
Clone the repository, install dependencies, and start the development server:

```bash
npm install
npm run dev
```

The Vite dev server defaults to `http://localhost:5173`. Hot-module replacement is enabled out of the box.

### Environment Variables
Create a `.env` (or `.env.local`) file in the project root with the values provided for your environment:

```ini
VITE_API_BASE_URL=https://your-backend-host
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_API_KEY=public-anon-key
```

- `VITE_API_BASE_URL` is consumed by the Vercel edge function in `api/get-response.ts` to stream chat completions.
- `VITE_SUPABASE_URL` and `VITE_SUPABASE_API_KEY` configure the Supabase client used for segment metadata.

Restart the dev server after changing environment variables.

## Useful npm Scripts
- `npm run dev` – start the Vite development server.
- `npm run build` – produce an optimized production bundle in `dist/`.
- `npm run preview` – preview the production build locally.

## Project Structure
- `src/components/` – UI building blocks (chat messages, question input, video/document modals, footer).
- `src/stores/` – Pinia stores for chat messages and modal state, persisted to `localStorage`.
- `src/utils/stream.ts` – helper that normalizes server-sent event streams.
- `api/` – Vercel edge functions (used for proxying the chat endpoint).
- `public/` – static assets served as-is by Vite.

## Deployment Notes
- The project is configured for Vercel deployments; edge functions live under `api/` and share the same environment variables.
- Ensure the production environment exposes the same `VITE_*` variables so the bundled frontend can reach upstream services.
- When deploying, rebuild with `npm run build` and upload the generated `dist/` folder (handled automatically by Vercel).

---
Questions or improvements? Open an issue or reach out to the ViaDemocratia team.
