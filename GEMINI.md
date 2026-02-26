# Project Context

## Overview
This project (`webmcp-demo` / `webmcpTest`) is a demonstration application specifically designed to showcase **WebMCP** (Model Context Protocol). It acts as a simulated e-commerce back-office, providing various tools (via `@mcp-b/react-webmcp`) that AI agents can interact with. It manages simulated state for things like orders, analytics charts, and carrier routing.

## Tech Stack
- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** Standard CSS (with `design-tokens.css` and `index.css`)
- **State Management:** Custom React Hooks (`useOrders`, `useChartConfig`)
- **Other Key Libraries:** `@mcp-b/global`, `@mcp-b/react-webmcp`, `zod` (for tool schema validation), `framer-motion` (animations), `highcharts-react-official` (visualization), `lucide-react` (icons), `react-router-dom` (routing)

## Coding Standards
- **Component Style:** Use functional React components.
- **WebMCP Integration:** Define clearly typed input schemas using `zod` for any new `useWebMCP` tools.
- **State Logic:** Extract complex business logic and state management into custom hooks (e.g., `src/hooks`).
- **Telemetry/Logging:** Ensure tool interactions dispatch `webmcp:log` or system alert events where appropriate to give the final user visibility.

## Directory Structure
- `src/components`: UI components and the `WebMCPTools` registry that hooks into the WebMCP context.
- `src/hooks`: Custom React hooks containing all the simulated backend logic and state.
- `src/assets`: Static file assets.

## Important Commands
- **Development:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Preview:** `npm run preview`

## Known Issues / TODOs
- Maintain standard practices for any newly implemented `useWebMCP` tools, ensuring they map safely to state actions.
