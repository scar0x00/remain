# Remain - Agent Guidelines

`pnpm` is the package manager for this project when it comes to ts/js code.

## Commands

### Development
- `pnpm dev` - Start React Router development server
- `pnpm dev:api` - Start API server (Cloudflare Workers)
- `pnpm dev:all` - Start both servers concurrently

### Build & Type Checking
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm typecheck` - Run TypeScript type checking

### API (in api/deck-store/)
- `pnpm dev` - Start Wrangler dev server
- `pnpm deploy` - Deploy to Cloudflare Workers

**No test framework configured** - This project currently has no test setup.

## Code Style

### Imports
- Use `~` alias for app directory imports: `import X from "~/lib/utils"`
- Named imports preferred: `import { useState } from 'react'`
- Third-party libraries: full package names, no destructure from main exports
- File structure: imports first, grouped by third-party, internal, types

### Formatting
- No explicit linting/formatting config - follow existing patterns
- 4 spaces for indentation (TypeScript default)
- No trailing whitespace
- Line breaks for readability on long JSX/Tailwind classes

### TypeScript
- Strict mode enabled (`strict: true` in tsconfig.json)
- Use interfaces for object shapes
- Type imports: `import type { Route } from "./+types/file"`
- Enum usage sparing (see `action` in deckGenerationAgent.ts)
- Zod for runtime validation and type schemas

### Naming Conventions
- Components: PascalCase (`CardPreview`, `DeckCarousel`)
- Files: PascalCase for components (`CardPreview.tsx`), camelCase for utilities (`utils.ts`)
- Variables/Functions: camelCase (`getAgentCompletion`, `deckDraft`)
- Atoms: `*Atom` suffix (`chatHistoryAtom`, `deckDraftAtom`)
- Routes: `generate.$chatId.tsx` (React Router file-based routing)
- Constants: UPPER_SNAKE_CASE (`SYSTEM_PROMPT`)

### React Patterns
- Functional components with hooks
- Use `useMemo` for expensive computations (MarkdownRenderer instances)
- Use `useCallback` for event handlers
- Escape key handling: useEffect with addEventListener
- Client components: `'use client'` directive at top if needed

### React Router
- Use `loader` for data fetching: `export async function loader({ params }: Route.LoaderArgs)`
- Use `action` for mutations: `export async function action({ request, params }: Route.ActionArgs)`
- Route types: `Route.ComponentProps`, `Route.LoaderArgs`, `Route.ActionArgs`
- Use `useFetcher` for non-navigation form submissions
- Use `redirect` for navigation in loaders/actions

### State Management
- Jotai atoms for global state
- `useAtom` for read/write, `useAtomValue` for read-only
- Atoms in `app/lib/state/` directory

### Styling
- Tailwind CSS v4 with `@tailwindcss/vite`
- Utility-first approach
- Component variants with `class-variance-authority` (cn utility)
- CSS variables in `app/app.css` for theme customization
- Scrollbar styling: custom `scrollbar-thin` class and variants

### Error Handling
- Throwing strings in actions: `throw "Unexpected error"`
- Try-catch for async operations
- Error boundaries in root layout
- Error responses in loaders

### Markdown & Content
- Use `MarkdownRenderer` class for markdown rendering
- Always sanitize with DOMPurify before HTML rendering
- Use `dangerouslySetInnerHTML` for rendered content
- Support KaTeX for math, highlight.js for code

### File Organization
- `app/routes/` - Route files (file-based routing)
- `app/lib/my-components/` - Reusable UI components
- `app/lib/agents/` - LangChain agents and models
- `app/lib/state/` - Jotai state atoms
- `app/lib/utils/` - Utility functions
- `app/styles/` - Additional CSS files
- `api/` - Cloudflare Workers API (separate packages)

### Commit Messages
- Format: `feat(scope): message` or `fix(scope): message`
- Example: `feat(api): add persistent deck storage with R2`
- Example: `style(ui): add hover cursor styles and adjust background opacity`

## API Development (Cloudflare Workers)
- Located in `api/deck-store/`
- Uses Hono framework
- Wrangler for deployment
- Types: `@cloudflare/workers-types`

## Dependencies
- React Router v7 for routing and SSR
- Jotai for state management
- Tailwind CSS v4 for styling
- LangChain for AI agents
- Zod for validation
