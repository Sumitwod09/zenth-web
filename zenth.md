# Zenth — Product & Technical Reference Document

> **Execution-first productivity for ADHD minds.**
> Capture thoughts, focus on one task, track progress. No folders, no tags, no friction.

---

## Table of Contents

1. [Product Requirements (PRD)](#1-product-requirements-prd)
2. [Design Guidelines](#2-design-guidelines)
3. [Technical Requirements (TRD)](#3-technical-requirements-trd)
4. [Architecture](#4-architecture)
5. [Database Schema (Supabase)](#5-database-schema-supabase)
6. [Authentication (Clerk)](#6-authentication-clerk)
7. [Environment Variables & Security](#7-environment-variables--security)
8. [Deployment](#8-deployment)
9. [Known Issues & Fixes](#9-known-issues--fixes)
10. [Development Commands](#10-development-commands)

---

## 1. Product Requirements (PRD)

### 1.1 Vision

Zenth is a **web-first** productivity app designed specifically for people with ADHD. It eliminates the cognitive overhead of traditional task managers by enforcing a brutally simple workflow:

1. **Brain Dump** — Capture every thought instantly, zero friction.
2. **Do Now** — The app picks ONE task for you. No decision fatigue.
3. **Track** — See your progress. Today, upcoming, and completed.
4. **Settings** — Configure focus duration and preferences.

### 1.2 Target Audience

- People with ADHD who struggle with traditional productivity tools
- Users who feel overwhelmed by complex project management software
- Anyone who wants a "capture → execute → done" workflow

### 1.3 Core Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **Brain Dump** | Free-text capture area. Type a thought, hit enter. It's saved. | P0 |
| **Convert to Task** | Tap a dump entry to convert it into an actionable task. | P0 |
| **Do Now Mode** | Shows ONE active task at a time with a focus timer (10–25 min). | P0 |
| **Task Tracker** | Filter tasks by Today / Upcoming / Completed. | P0 |
| **Focus Timer** | Configurable Pomodoro-style timer (10–25 minutes, 5-min steps). | P0 |
| **Authentication** | Sign in/up via Clerk. Data is tied to the authenticated user. | P0 |
| **Cloud Sync** | All data stored in Supabase. Accessible from any browser. | P0 |
| **Reminders** | Set due dates with daily/weekly repeat (future enhancement). | P1 |
| **Onboarding** | First-run experience explaining the 3-step workflow. | P1 |

### 1.4 User Flow

```
Landing Page (marketing)
    ↓ clicks "Get Started"
Sign In / Sign Up (Clerk)
    ↓ authenticated
Dashboard (4 tabs)
    ├── Home (Brain Dump) → type thoughts → convert to tasks
    ├── Do Now → focus on ONE task → timer → mark done
    ├── Tracker → today / upcoming / completed
    └── Settings → focus duration, account
```

### 1.5 Non-Goals (Intentionally Excluded)

- ❌ Folders, tags, categories, or labels
- ❌ Team collaboration or shared workspaces
- ❌ Gantt charts, calendars, or Kanban boards
- ❌ Offline-first with local SQLite (removed — web-only now)
- ❌ Native mobile app distribution (web PWA covers mobile)

---

## 2. Design Guidelines

### 2.1 Design Philosophy

- **Dark-first.** The entire UI is built on a near-black background (`#0f0f12`).
- **Minimal chrome.** No unnecessary borders, shadows, or decorations.
- **Glow accents.** Purple glow effects (`#7c5cff`) to indicate interactivity.
- **Execution over organization.** Every screen drives toward completing a task.

### 2.2 Color Palette

```
┌─────────────────┬───────────────────────────────────┐
│ Token           │ Value                             │
├─────────────────┼───────────────────────────────────┤
│ background      │ #0f0f12                           │
│ surface         │ #1a1a1f                           │
│ accent          │ #7c5cff                           │
│ accent-glow     │ rgba(124, 92, 255, 0.12)          │
│ accent-muted    │ rgba(124, 92, 255, 0.65)          │
│ text-primary    │ #f2f2f5                           │
│ text-secondary  │ #9a9aa5                           │
│ success         │ #4ade80                           │
│ success-glow    │ rgba(74, 222, 128, 0.15)          │
│ border          │ #2a2a30                           │
│ danger          │ #ef4444                           │
└─────────────────┴───────────────────────────────────┘
```

### 2.3 Typography

| Usage    | Font Family     | Weight   |
|----------|-----------------|----------|
| Headings | Space Grotesk   | 500, 600 |
| Body     | Inter           | 400, 500 |

**Font Sizes:** caption (12px), body (14px), bodyLg (16px), heading (20px), headingLg (24px), headingXl (28px), display (36px).

**Import (CSS):**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap');
```

### 2.4 Spacing Scale

```
xs: 4px | sm: 8px | md: 12px | lg: 16px | xl: 20px | 2xl: 24px | 3xl: 32px | 4xl: 40px | 5xl: 48px
```

### 2.5 Border Radii

```
sm: 6px | md: 10px | lg: 14px | xl: 20px | full: 9999px
```

### 2.6 Animations

| Name      | Duration | Usage                          |
|-----------|----------|--------------------------------|
| fast      | 150ms    | Button presses, toggles        |
| normal    | 300ms    | Card transitions, page fades   |
| slow      | 400ms    | Modal open/close, onboarding   |

**CSS Keyframes used on landing page:**
- `fadeInUp` — Elements slide up from 30px below while fading in.
- `glowPulse` — Subtle purple glow pulsation on CTA cards.
- `float` — Gentle vertical floating animation (12px).
- `shimmer` — Background gradient shimmer for loading states.

### 2.7 Component Patterns

- **Cards:** `background: var(--surface)`, `border: 1px solid var(--border)`, `border-radius: 14px`.
- **Buttons (Primary):** `background: var(--accent)`, pill-shaped (`border-radius: 9999px`), hover lifts 2px with purple box-shadow.
- **Buttons (Secondary):** `background: var(--surface)`, 1px border, hover changes border to accent-muted.
- **Inputs:** Dark background (`var(--bg)`), 1px border, focus border turns accent.
- **Icons:** Lucide icons at 1.8 stroke width. 48×48 icon containers with `accent-glow` background and 12px border-radius.

---

## 3. Technical Requirements (TRD)

### 3.1 Stack Overview

| Layer          | Technology           | Purpose                            |
|----------------|----------------------|------------------------------------|
| **Framework**  | Next.js (App Router) | SSR, routing, API routes           |
| **Language**   | TypeScript           | Type safety across the codebase    |
| **Styling**    | Vanilla CSS          | Full control, no utility framework |
| **Auth**       | Clerk (`@clerk/nextjs`) | Authentication, session mgmt    |
| **Database**   | Supabase (PostgreSQL)| Cloud storage with RLS             |
| **State**      | Zustand              | Client-side state management       |
| **Deployment** | Vercel               | Hosting, CI/CD, edge functions     |
| **Repo**       | GitHub               | Source control                     |

### 3.2 Project Structure (Web-Only Target)

```
zenth/
├── apps/
│   └── web/                          # Next.js App Router
│       ├── app/
│       │   ├── layout.tsx            # Root layout with ClerkProvider
│       │   ├── page.tsx              # Landing page (marketing)
│       │   ├── globals.css           # Global styles & design tokens
│       │   ├── dashboard/            # Protected app routes
│       │   │   ├── layout.tsx        # Dashboard shell (sidebar/tabs)
│       │   │   ├── page.tsx          # Brain Dump (home)
│       │   │   ├── do-now/page.tsx   # Focus mode
│       │   │   ├── tracker/page.tsx  # Task tracker
│       │   │   └── settings/page.tsx # User settings
│       │   └── sign-in/[[...sign-in]]/page.tsx
│       │   └── sign-up/[[...sign-up]]/page.tsx
│       ├── components/               # UI components
│       ├── lib/
│       │   └── supabase.ts           # Supabase client factory
│       ├── store/                    # Zustand stores
│       │   ├── dumpStore.ts
│       │   ├── taskStore.ts
│       │   └── settingsStore.ts
│       ├── middleware.ts             # Clerk auth middleware
│       └── package.json
├── apps/supabase/
│   └── schema.sql                    # Database schema + RLS policies
├── packages/utils/                   # Shared types, constants, helpers
│   ├── index.ts                      # Barrel export
│   ├── types.ts                      # Dump, Task, AppSettings interfaces
│   ├── constants.ts                  # Design tokens, timer config
│   ├── date.ts                       # Date/time formatting helpers
│   └── storage.ts                    # Storage key constants
├── .env.template                     # Template for environment variables
├── .gitignore                        # Includes .env, .env.local, .env.*.local
├── vercel.json                       # Deployment configuration
└── package.json                      # Root workspace config
```

### 3.3 Data Models

```typescript
// Brain Dump Entry
interface Dump {
  id: string;              // Unique ID (timestamp + random)
  text: string;            // Raw thought text
  createdAt: number;       // Unix timestamp (ms)
  convertedToTaskIds: string[];  // IDs of tasks created from this dump
}

// Task
interface Task {
  id: string;
  title: string;
  sourceDumpId: string | null;  // Link back to originating dump
  status: 'active' | 'done';
  dueAt: number | null;         // Unix timestamp (ms)
  reminderRepeat: 'none' | 'daily' | 'weekly';
  createdAt: number;
  completedAt: number | null;
}

// User Settings
interface AppSettings {
  focusDuration: number;              // 10–25 minutes
  onboardingComplete: boolean;
  notificationPermissionAsked: boolean;
}
```

### 3.4 State Management (Zustand)

Three stores, each syncing to Supabase:

1. **`dumpStore`** — CRUD for brain dump entries. `loadDumps()` fetches from Supabase, `addDump()` does optimistic local update then background cloud insert.
2. **`taskStore`** — Full task lifecycle: create, toggle status, update reminders, delete. Includes computed selectors: `getFilteredTasks()`, `getActiveTasks()`, `getCurrentDoNowTask()`, `getTodayProgress()`.
3. **`settingsStore`** — Focus duration, onboarding state. Persisted to Supabase `settings` table.

### 3.5 Supabase Client Integration

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createClerkSupabaseClient = (clerkToken: string | null) => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: clerkToken ? { Authorization: `Bearer ${clerkToken}` } : undefined,
    },
    auth: { persistSession: false },
  });
};
```

**Key Point:** Supabase does NOT manage its own auth. Instead, the Clerk JWT is passed as a Bearer token. The custom `auth.uid()` SQL function extracts the Clerk `sub` claim from the JWT so that RLS policies work correctly.

---

## 4. Architecture

### 4.1 Authentication Flow

```
User visits /dashboard
    ↓
Clerk middleware checks session
    ↓ no session
Redirect to /sign-in (Clerk hosted UI)
    ↓ signs in
Clerk issues JWT with user's `sub` (user ID)
    ↓
App calls `useAuth().getToken({ template: 'supabase' })`
    ↓
JWT passed to Supabase client as Authorization header
    ↓
Supabase RLS uses `auth.uid()` → extracts `sub` from JWT
    ↓
User can only read/write their own rows
```

### 4.2 Data Flow (Optimistic Sync)

```
User types a brain dump → hits Enter
    ↓
1. Zustand store updates immediately (optimistic)
2. Supabase INSERT fires in background
3. If INSERT fails → log error (data is still in local state)
4. On next page load → Supabase SELECT refreshes state
```

### 4.3 Clerk ↔ Supabase JWT Integration

In the Clerk Dashboard, create a **JWT Template** named `supabase`:
- **Issuer:** Your Clerk frontend API URL
- **Claims:** `{ "sub": "{{user.id}}", "role": "authenticated" }`
- **Signing algorithm:** HS256
- **Signing key:** Your Supabase JWT Secret (found in Supabase Dashboard → Settings → API → JWT Secret)

In Supabase Dashboard → Settings → API → JWT Secret: copy this value and paste it into the Clerk JWT template's signing key field.

---

## 5. Database Schema (Supabase)

Run the following SQL in the Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Dumps table
CREATE TABLE IF NOT EXISTS public.dumps (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    completed_at TIMESTAMPTZ,
    dump_id TEXT REFERENCES public.dumps(id) ON DELETE CASCADE
);

-- Settings table
CREATE TABLE IF NOT EXISTS public.settings (
    user_id TEXT PRIMARY KEY,
    focus_duration_minutes INTEGER NOT NULL DEFAULT 25,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.dumps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies (all tables follow the same pattern)
-- Users can only SELECT, INSERT, UPDATE, DELETE their own rows

-- Dumps
CREATE POLICY "Users can view their own dumps" ON public.dumps
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own dumps" ON public.dumps
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own dumps" ON public.dumps
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own dumps" ON public.dumps
    FOR DELETE USING (auth.uid() = user_id);

-- Tasks
CREATE POLICY "Users can view their own tasks" ON public.tasks
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tasks" ON public.tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON public.tasks
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON public.tasks
    FOR DELETE USING (auth.uid() = user_id);

-- Settings
CREATE POLICY "Users can view their own settings" ON public.settings
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON public.settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Custom auth.uid() to extract Clerk's 'sub' claim
CREATE OR REPLACE FUNCTION auth.uid() RETURNS TEXT AS $$
  SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::text;
$$ LANGUAGE SQL STABLE;
```

---

## 6. Authentication (Clerk)

### 6.1 Setup Checklist

1. Create a Clerk application at [dashboard.clerk.com](https://dashboard.clerk.com)
2. Enable desired sign-in methods (email/password, Google, GitHub, etc.)
3. Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
4. Create a Supabase JWT template in Clerk Dashboard (see §4.3)
5. Install: `pnpm add @clerk/nextjs`

### 6.2 Next.js Integration

**Root Layout (`app/layout.tsx`):**
```tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>{children}</ClerkProvider>
      </body>
    </html>
  );
}
```

**Middleware (`middleware.ts`):**
```typescript
import { clerkMiddleware } from "@clerk/nextjs/server";
export default clerkMiddleware();
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

**Auth Components:**
```tsx
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs';

<Show when="signed-out">
  <SignInButton />
  <SignUpButton />
</Show>
<Show when="signed-in">
  <UserButton />
</Show>
```

### 6.3 Critical Rules

- `ClerkProvider` goes inside `<body>`, NOT wrapping `<html>`
- Never expose `CLERK_SECRET_KEY` in client code (use only in server components/API routes)
- In Next.js 15+, `auth()` is async — always `await auth()`
- Use `@clerk/nextjs`, NOT `@clerk/clerk-react`

---

## 7. Environment Variables & Security

### 7.1 Required Variables

| Variable | Used By | Where to Get |
|----------|---------|--------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Client | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Server only | Clerk Dashboard → API Keys |
| `NEXT_PUBLIC_SUPABASE_URL` | Client | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client | Supabase Dashboard → Settings → API |

### 7.2 File Setup

Create a `.env.local` file in `apps/web/`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 7.3 Security Rules

> **⚠️ CRITICAL: NEVER push `.env`, `.env.local`, or any `.env.*.local` file to GitHub.**

The `.gitignore` already includes:
```
.env
.env.local
.env.*.local
```

For Vercel deployment, add these same variables in the Vercel Dashboard → Project → Settings → Environment Variables.

A `.env.template` file exists at the project root as a reference. It contains only the key names (no values).

---

## 8. Deployment

### 8.1 Vercel Deployment Steps

1. Go to [vercel.com](https://vercel.com) → New Project → Import `Sumitwod09/zenth`
2. **Framework Preset:** Next.js
3. **Root Directory:** `apps/web`
4. **Build Command:** `next build` (auto-detected)
5. **Output Directory:** `.next` (auto-detected)
6. **Environment Variables:** Add all 4 keys from §7.1
7. Click **Deploy**

### 8.2 Vercel Settings

The `vercel.json` at the root configures the monorepo build. If deploying the web app specifically, set the Root Directory to `apps/web` in the Vercel dashboard.

### 8.3 Monorepo Gotcha: `workspace:*`

Vercel's default npm installer does NOT understand `workspace:*` protocol (used by pnpm). Two fixes:

1. **Set Root Directory to `apps/web`** in Vercel settings, OR
2. Ensure Vercel uses pnpm (it auto-detects from `pnpm-lock.yaml`)

If you see `EUNSUPPORTEDPROTOCOL` errors, it means Vercel fell back to npm. Fix by ensuring `pnpm-lock.yaml` is committed and present.

---

## 9. Known Issues & Fixes

### 9.1 `EUNSUPPORTEDPROTOCOL: workspace:*`

**Cause:** Vercel defaulting to npm instead of pnpm.
**Fix:** Ensure `pnpm-lock.yaml` is committed. Set `packageManager` field in root `package.json` if needed:
```json
{ "packageManager": "pnpm@11.3.0" }
```

### 9.2 `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND`

**Cause:** pnpm can't find workspace packages when Root Directory is set wrong.
**Fix:** For web-only deployment, set Root Directory to `apps/web` in Vercel. Remove `workspace:*` dependencies from the web package.json if they reference mobile-only packages.

### 9.3 `ERR_PNPM_IGNORED_BUILDS`

**Cause:** pnpm v10+ requires explicit approval for postinstall scripts.
**Fix:** Run `pnpm approve-builds` locally, or use `pnpm install --ignore-scripts` for CI.

### 9.4 Blank Screen on Expo Web

**Cause:** `expo-sqlite` and `expo-secure-store` crash silently on web browsers because they require native iOS/Android hardware APIs.
**Fix:** Add `Platform.OS === 'web'` checks to bypass these modules:
```typescript
// In db.ts
if (Platform.OS === 'web') return null;

// In tokenCache.ts
if (Platform.OS === 'web') return null;
```

### 9.5 Missing Clerk Key Shows Blank Screen

**Cause:** `ClerkProvider` crashes if `publishableKey` is `undefined`.
**Fix:** Remove the `!` non-null assertion. Add a runtime check:
```typescript
const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  return <div>Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</div>;
}
```

### 9.6 Font Resolution Errors (`@expo-google-fonts`)

**Cause:** Monorepo node_modules hoisting causes Metro to not find `.ttf` files.
**Fix:** Create a `metro.config.js` that explicitly sets `nodeModulesPaths` to include both project and workspace root `node_modules/`. Also ensure `ttf` is in `assetExts`.

### 9.7 Timeline Animation Overlap (Landing Page)

**Cause:** Individual `.animate-in` classes on timeline steps caused staggered layout shifts.
**Fix:** Animate the entire `.steps` container as one unit. Use opaque backgrounds on step numbers and a mask pseudo-element on the last step to hide the timeline line overflow.

---

## 10. Development Commands

### Local Development

```bash
# Install all dependencies
pnpm install

# Run Next.js web app (from root)
pnpm --filter web dev

# Run Next.js web app (from apps/web/)
cd apps/web && pnpm dev

# Type-check
pnpm --filter web typecheck
```

### Production Build

```bash
# Build for production
pnpm --filter web build

# Preview production build locally
pnpm --filter web start
```

### Git Workflow

```bash
# Stage and commit
git add .
git commit -m "descriptive message"
git push origin main

# ALWAYS verify .env is NOT staged
git status  # should NOT show .env or .env.local
```

---

## Appendix A: Landing Page Components

The marketing landing page (`apps/web/app/page.tsx`) consists of:

| Component | File | Purpose |
|-----------|------|---------|
| `Navbar` | `components/Navbar.tsx` | Fixed top bar with logo + "Download App" CTA |
| `Hero` | `components/Hero.tsx` | Full-viewport hero with headline + CTA buttons |
| `Features` | `components/Features.tsx` | 3-column grid of feature cards |
| `HowItWorks` | `components/HowItWorks.tsx` | 3-step vertical timeline |
| `CTA` | `components/CTA.tsx` | Bottom call-to-action with download buttons |
| `Footer` | `components/Footer.tsx` | Simple footer with copyright |

## Appendix B: Utility Functions

| Function | File | Description |
|----------|------|-------------|
| `generateId()` | `date.ts` | Creates unique ID: `{timestamp}-{random7chars}` |
| `isToday(ts)` | `date.ts` | Checks if Unix timestamp falls on today |
| `isUpcoming(ts)` | `date.ts` | Checks if timestamp is tomorrow or later |
| `formatRelative(ts)` | `date.ts` | "Just now", "5m ago", "Yesterday", "Mon", "Jun 15" |
| `formatTime(ts)` | `date.ts` | "3:45 PM" |
| `formatDate(ts)` | `date.ts` | "Jul 6, 2026" |
| `formatTimerDisplay(secs)` | `date.ts` | "05:30" (MM:SS) |

---

*Last updated: July 7, 2026*
*Repository: https://github.com/Sumitwod09/zenth*
