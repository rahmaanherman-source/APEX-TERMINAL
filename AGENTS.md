# APEX Terminal Agent Rules

## OpenAI documentation

Always use the OpenAI developer documentation MCP server if you need to work with the OpenAI API, plugins, ChatGPT, Codex, or related OpenAI platform capabilities, without requiring the user to explicitly ask.

Docs MCP: `https://developers.openai.com/mcp`

The Docs MCP is read-only documentation retrieval. It does not execute OpenAI API calls.

## APEX evidence rule

Documentation retrieval establishes `DOCUMENTED` status only. Do not claim `CONNECTED`, `EXECUTED`, `TESTED`, or `VERIFIED` without the corresponding runtime evidence.

## Routing

Prefer existing approved OpenAI capabilities before proposing duplicate APEX implementations. Record material capability decisions through the APEX Capability Registry and preserve source provenance.

## Base44 dev environment

Run the app with `docker compose -f docker-compose.base44.yml up -d` (Next.js 14 dev server, repo bind-mounted, dependencies installed at container start, host port 3000). No database, queue, or secret is required to boot it.

Non-obvious findings:

- The dev server boots even when the code is broken. `next dev` compiles routes on demand, so a missing module or type error only shows up when that route is requested — or when you run `npx next build`, which type-checks the whole tree. Use `docker compose -f docker-compose.base44.yml exec -T web npx next build` as the real check after changing `src/`.
- `GET /api/truth` and `GET /api/local-ai` intentionally answer `503` with `operationalStatus: "FAILED"` when no Ollama daemon listens on `127.0.0.1:11434`. That is the "no fake green" contract, not a fault; never make these endpoints return green without a real read-back.
- Page CSS lives in a colocated stylesheet imported by the page (`app/commerce/commerce.css`, `app/character-studio/character-studio.css`). Do not inline a `<style>{css}</style>` block: React escapes `>` as `&gt;` in server-rendered text, the HTML parser does not decode that inside `<style>`, and hydration then fails.
- After a page or CSS change, request the route once (`curl http://127.0.0.1:3000/`) to force the compile before judging the result.
- The home route (`/`) renders the character studio; `/apex` renders the same page. The app has no in-app navigation, so every route has to be opened by URL.
