# Zenth — Changes, Fixes & Project Context

> **Purpose**: Single-source changelog + onboarding doc for any developer or AI model working on this project.  
> **Last updated**: 2026-07-07

---

## Quick Orientation

**What is Zenth?** A web-first productivity app for ADHD users. Three-step workflow: Brain Dump → Do Now → Track. Built with Next.js (App Router), Clerk auth, Supabase (PostgreSQL + RLS), Zustand state, vanilla CSS.

**Monorepo layout** (pnpm workspaces):
```
zenth/
├── apps/web/           ← Next.js app (primary deliverable)
├── apps/mobile/        ← Expo app (legacy, not actively developed)
├── apps/supabase/      ← schema.sql for database setup
├── packages/utils/     ← Shared types, constants, date helpers, Supabase client
├── packages/ui/        ← React Native UI components (NOT used by web)
```

**Key files to understand first:**
| File | Why it matters |
|------|---------------|
| `apps/web/app/layout.tsx` | Root layout with `ClerkProvider` |
| `apps/web/middleware.ts` | Clerk route protection |
| `apps/web/app/globals.css` | Full design system (tokens, animations, all component styles) |
| `packages/utils/types.ts` | `Dump`, `Task`, `AppSettings` interfaces |
| `packages/utils/supabase.ts` | Supabase client factory (accepts Clerk JWT token) |
| `apps/supabase/schema.sql` | Database schema + RLS policies |
| `zenth.md` | Full PRD + TRD (product/technical requirements) |

**Design system essentials:**
- Background: `#0f0f12`, Surface: `#1a1a1f`, Accent: `#7c5cff`
- Fonts: Space Grotesk (headings), Inter (body)
- Dark-first, glow accents, pill-shaped buttons, 14px border-radius cards

---

## Changelog

### Pre-build State (2026-07-07)

**Landing page completed** — 6 components (Navbar, Hero, Features, HowItWorks, CTA, Footer) with:
- IntersectionObserver scroll animations
- Responsive design (768px breakpoint)
- Full CSS design system in `globals.css`

**Infrastructure set up:**
- Clerk `@clerk/nextjs@^7.5.12` installed, `ClerkProvider` configured, middleware active
- Supabase schema ready in `apps/supabase/schema.sql` (dumps, tasks, settings tables with RLS)
- Shared utility package `@zenth/utils` with types, constants, date/time helpers

**What was NOT built yet:**
- Dashboard (all 4 pages: Brain Dump, Do Now, Tracker, Settings)
- Sign-in / Sign-up routes
- Zustand stores
- Web-specific Supabase client (only shared one exists)
- `zustand` not installed

---

## Known Issues & Fixes Applied

### Issue 1: `vercel.json` targets Expo instead of Next.js
- **File**: `vercel.json`
- **Problem**: `"framework": "expo"` and build command `pnpm --filter mobile run build:web`
- **Fix needed**: Change to `"framework": "nextjs"`, build command to `pnpm --filter web build`
- **Status**: 🟢 Resolved

### Issue 2: Missing `packageManager` field
- **File**: Root `package.json`
- **Problem**: Vercel may fall back to npm and fail on `workspace:*` protocol
- **Fix needed**: Add `"packageManager": "pnpm@11.3.0"`
- **Status**: 🟢 Resolved

### Issue 3: Landing page CTAs reference mobile downloads
- **Files**: `Navbar.tsx`, `Hero.tsx`, `CTA.tsx`
- **Problem**: "Download App", "Download for Android", "Download for iOS" — irrelevant for web-first
- **Fix needed**: Change to "Get Started" linking to `/sign-up` or `/dashboard`
- **Status**: 🟢 Resolved

### Issue 4: Supabase client has Expo env var fallbacks
- **File**: `packages/utils/supabase.ts`
- **Problem**: References `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- **Fix needed**: Web app should use its own `lib/supabase.ts` with `NEXT_PUBLIC_*` only
- **Status**: 🟢 Resolved

### Issue 5: `packages/ui` is React Native only
- **Files**: `packages/ui/*.tsx`
- **Problem**: Button, Card, Icon, Input, ProgressRing all use RN imports — crash on web
- **Fix needed**: Web app must NOT import from `@zenth/ui`. Build web-native components.
- **Status**: ⚠️ Info (no crash unless imported)

### Issue 6: `pnpm-workspace.yaml` has unset `allowBuilds` flags
- **File**: `pnpm-workspace.yaml`
- **Problem**: All `allowBuilds` entries say "set this to true or false" — not resolved
- **Fix needed**: Set to `true` for packages that need postinstall (sharp, unrs-resolver)
- **Status**: 🟡 Low priority

---

## Architecture Decisions

### Auth: Clerk → Supabase JWT bridge
Clerk handles auth. Supabase does NOT manage auth natively. Flow:
1. Clerk issues JWT → app calls `getToken({ template: 'supabase' })`
2. JWT passed as `Authorization: Bearer` header to Supabase client
3. Custom `auth.uid()` SQL function extracts Clerk's `sub` claim from JWT
4. RLS policies use `auth.uid() = user_id` to scope data per user

### State: Zustand with optimistic sync
- Local state updates immediately (optimistic)
- Supabase INSERT/UPDATE fires in background
- On page load, Supabase SELECT refreshes state (source of truth)
- Three stores: `dumpStore`, `taskStore`, `settingsStore`

### Data models (Supabase ↔ Frontend mapping)
| Supabase column | Frontend field | Notes |
|-----------------|---------------|-------|
| `dumps.content` | `Dump.text` | Different naming |
| `tasks.content` | `Task.title` | Different naming |
| `tasks.status` | `'pending'` / `'completed'` | Supabase uses pending/completed, frontend types say active/done |
| `tasks.dump_id` | `Task.sourceDumpId` | FK reference |
| `settings.focus_duration_minutes` | `AppSettings.focusDuration` | Integer in minutes |

> **⚠️ IMPORTANT**: Status naming mismatch — Supabase schema uses `pending`/`completed` but the TypeScript type uses `active`/`done`. Stores must handle this mapping.

### Styling: Vanilla CSS, no Tailwind
All styles in `globals.css` + dashboard-specific CSS. Design tokens as CSS custom properties (`:root` vars).

---

## Environment Setup

### Required `.env.local` (in `apps/web/`)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### Clerk JWT Template Setup
1. Clerk Dashboard → JWT Templates → Create "supabase"
2. Claims: `{ "sub": "{{user.id}}", "role": "authenticated" }`
3. Signing: HS256
4. Signing key: Supabase JWT Secret (Dashboard → Settings → API)

### Development
```bash
pnpm install                    # Install all deps
pnpm --filter web dev           # Start dev server (port 3000)
pnpm --filter web build         # Production build
pnpm --filter web typecheck     # Type checking
```

---

## Dependencies (apps/web)

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.2.10 | App Router framework |
| `react` / `react-dom` | 19.2.4 | UI library |
| `@clerk/nextjs` | ^7.5.12 | Authentication |
| `@zenth/utils` | workspace:* | Shared types, helpers |
| `lucide-react` | ^0.475.0 | Icons |
| `zustand` | ^5.0.14 | State management |
| `@supabase/supabase-js` | ^2.110.0 | Database client |

---

## File Structure After Implementation

```
apps/web/
├── app/
│   ├── layout.tsx              ← Root layout (ClerkProvider, fonts)
│   ├── page.tsx                ← Landing page
│   ├── globals.css             ← Design system + all styles
│   ├── sign-in/[[...sign-in]]/page.tsx
│   ├── sign-up/[[...sign-up]]/page.tsx
│   └── dashboard/
│       ├── layout.tsx          ← Protected shell (sidebar, Supabase provider)
│       ├── dashboard.css       ← Dashboard-specific styles
│       ├── page.tsx            ← Brain Dump (home)
│       ├── do-now/page.tsx     ← Focus mode
│       ├── tracker/page.tsx    ← Task tracker
│       └── settings/page.tsx   ← User settings
├── components/
│   ├── Navbar.tsx, Hero.tsx, Features.tsx, HowItWorks.tsx, CTA.tsx, Footer.tsx  ← Landing
│   ├── Sidebar.tsx             ← Dashboard nav
│   ├── SupabaseProvider.tsx    ← Clerk→Supabase token context
│   ├── DumpInput.tsx           ← Brain dump textarea
│   ├── DumpCard.tsx            ← Dump entry display
│   ├── TaskCard.tsx            ← Task row with checkbox
│   ├── FocusTimer.tsx          ← SVG countdown timer
│   ├── ProgressRing.tsx        ← SVG completion ring
│   └── EmptyState.tsx          ← Empty state placeholder
├── store/
│   ├── dumpStore.ts            ← Zustand dump CRUD
│   ├── taskStore.ts            ← Zustand task lifecycle
│   └── settingsStore.ts       ← Zustand settings
├── lib/
│   └── supabase.ts             ← Web-only Supabase client factory
└── middleware.ts               ← Clerk auth middleware
```
