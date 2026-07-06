# Zenth

Execution-first mobile productivity system for people who struggle with focus and task initiation.

## What is Zenth?

Zenth removes the gap between thinking and doing. Built for ADHD users, it reduces every interaction to the smallest possible decision: capture a thought, turn it into a task, focus on one task at a time.

## Monorepo Structure

```
root/
  apps/
    mobile/     → Expo React Native app
    web/        → Next.js landing page
  packages/
    ui/         → Shared UI components
    utils/      → Shared logic, types, design tokens
```

## Getting Started

### Prerequisites
- Node.js >= 18
- pnpm >= 9

### Install

```bash
pnpm install
```

### Development

```bash
# Start the mobile app
pnpm dev:mobile

# Start the landing page
pnpm dev:web
```

### Build

```bash
# Build the landing page for production
pnpm build:web
```

## Tech Stack

- **Mobile**: React Native + Expo (managed workflow)
- **Web**: Next.js (App Router)
- **State**: Zustand
- **Storage**: SQLite (expo-sqlite) + AsyncStorage
- **Notifications**: expo-notifications (local)
- **Styling**: Dark theme, Space Grotesk + Inter typography

## Version

`0.1.0` — MVP
