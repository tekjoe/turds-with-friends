# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Bowel Buddies is a Next.js 15 (App Router) application for tracking bowel movements with gamification features. The app is deployed on Cloudflare Workers via OpenNext and uses Supabase for authentication and database management.

## Development Commands

### Local Development
```bash
npm run dev                 # Start Next.js dev server on port 3000
npm run dev:worker         # Start Cloudflare Workers dev server on port 8787
```

### Testing
```bash
npm test                   # Run all tests (components + API)
npm run test:api          # Run API tests only
npm run test:watch        # Run tests in watch mode
```

### Building & Deployment
```bash
npm run build             # Build Next.js app
npm run build:worker      # Build for Cloudflare Workers
npm run preview           # Build and preview Cloudflare Workers locally
npm run deploy            # Deploy to Cloudflare
```

### Code Quality
```bash
npm run lint             # Run ESLint
```

### Supabase Local Development
```bash
supabase start           # Start local Supabase instance
supabase stop            # Stop local Supabase instance
supabase db reset        # Reset database and run migrations
supabase migration new <name>  # Create new migration
```

Supabase local services:
- API: http://127.0.0.1:54321
- Studio: http://127.0.0.1:54323
- Inbucket (email testing): http://127.0.0.1:54324
- Database: postgresql://postgres:postgres@127.0.0.1:54322/postgres

## Architecture

### Route Structure

The app uses Next.js route groups for logical separation:

- **(authenticated)/** - Protected routes requiring authentication
  - `/dashboard` - Main user dashboard with stats and charts
  - `/log` - Log new bowel movements
  - `/analytics` - Detailed analytics and trends
  - `/activity` - Activity feed
  - `/friends` - Friend management
  - `/leaderboard` - Global and friend leaderboards
  - `/challenges` - Challenges system
  - `/map` - Location-based features
  - `/settings` - User settings
  - `/upgrade` - Premium subscription

- **(marketing)/** - Public marketing pages
  - `/features` - Feature showcase
  - `/premium` - Premium features page
  - `/privacy-first` - Privacy policy
  - `/terms` - Terms of service

- **Other routes:**
  - `/login` - Authentication page
  - `/onboarding` - New user onboarding
  - `/auth/callback` - OAuth callback handler
  - `/auth/auth-code-error` - Auth error page

### API Routes

API routes follow REST conventions in `/src/app/api/`:

- `/api/account` - User account management
- `/api/challenges` - Challenge operations
- `/api/export` - Data export (PDF/CSV)
- `/api/friends` - Friend operations (list, request, respond, search)
- `/api/locations` - Location-based data and comments
- `/api/stripe` - Stripe webhook and subscription handling

### Authentication & Middleware

- **Middleware** (`src/middleware.ts`): Runs on all routes except static assets, handles session refresh via Supabase
- **Server Client** (`src/lib/supabase/server.ts`): Creates Supabase clients for server components
  - `createClient()` - Standard server client (respects RLS)
  - `createAdminClient()` - Admin client (bypasses RLS, use carefully)
- **Client Client** (`src/lib/supabase/client.ts`): Browser-side Supabase client

### Server Actions

Server actions are located in `/src/app/actions/` and use the "use server" directive:
- `badges.ts` - Badge management and awarding

### Database Schema

Key tables in Supabase:
- `profiles` - User profiles with display_name, username, avatar_url, XP, streaks
- `movement_logs` - Bowel movement logs with Bristol type, weight, location
- `friendships` - Friend relationships (requester_id, addressee_id, status)
- `challenges` - Challenge definitions
- `user_challenges` - User participation in challenges
- `badges` - Available badges
- `user_badges` - Badges earned by users
- `locations` - Location data for map features
- `location_comments` - Comments on locations

Schema types are auto-generated in `src/types/database.ts`.

### Gamification System

Core gamification logic lives in `src/lib/gamification.ts`:

- **XP System**: 50 XP per log, bonus XP for streaks (3d: +25, 7d: +50, 14d: +100, 30d: +250)
- **Levels**: Calculated as `floor(xp / 500) + 1` with themed titles
- **Streaks**: Tracked in user profile, updated on each log
- **Badges**: Criteria-based achievements (first log, streaks, ideal count, XP milestones)
- **Bristol Scale**: Types 3-4 are "ideal" and earn bonus points

### Premium Features

Premium subscription logic in `src/lib/premium.ts`:
- Checks Stripe subscription status via Supabase
- Monthly and annual pricing defined in `wrangler.json` vars
- Payment processing via `/api/stripe` webhook

### Component Organization

Components are organized by feature in `/src/components/`:
- `activity/` - Activity feed components
- `analytics/` - Analytics page components
- `bristol-scale/` - Bristol scale reference components
- `challenges/` - Challenge-related components
- `charts/` - Recharts chart components (WeightChart, ConsistencyChart)
- `dashboard/` - Dashboard widgets (StatsCard, StreakCard, FriendRanking, etc.)
- `friends/` - Friend management UI
- `landing/` - Marketing page components
- `leaderboard/` - Leaderboard displays
- `log/` - Movement logging form
- `map/` - Map and location components (using Leaflet)
- `onboarding/` - Onboarding flow
- `settings/` - Settings forms
- `ui/` - Shared UI components (Navbar, StatsCard, etc.)
- `upgrade/` - Premium upgrade flow

### Testing

Two Jest configurations:
- `jest.config.js` - Component tests with jsdom environment, excludes API routes
- `jest.config.api.js` - API route tests with node environment

Test files should be placed:
- Component tests: `__tests__/` directories or `*.test.tsx` files
- API tests: Co-located with API routes as `*.test.ts`

### Path Aliases

TypeScript path alias `@/*` maps to `src/*` (configured in `tsconfig.json`).

## Cloudflare Deployment

This app uses OpenNext to deploy to Cloudflare Workers:
- Config: `open-next.config.ts` and `wrangler.json`
- Build output: `.open-next/` directory
- Environment variables: Set in Cloudflare dashboard or `wrangler.json` vars
- Custom domain: bowelbuddies.com (configured in routes)

### Environment Variables

Required environment variables (see `.env.local.example`):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-only)
- Stripe keys and price IDs (production: set in Cloudflare dashboard)

## Common Patterns

### Fetching User Data in Server Components

```typescript
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  redirect("/login");
}
```

### API Route Pattern

```typescript
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Query logic here
  return NextResponse.json({ data });
}
```

### Using Admin Client (Bypass RLS)

Use sparingly and only when necessary (e.g., reading friend profiles):

```typescript
import { createAdminClient } from "@/lib/supabase/server";

const admin = createAdminClient();
const { data } = await admin.from("profiles").select("*").in("id", friendIds);
```

## Key Files

- `src/middleware.ts` - Session management middleware
- `src/lib/supabase/server.ts` - Server-side Supabase clients
- `src/lib/gamification.ts` - XP, levels, badges, and streak logic
- `src/lib/premium.ts` - Premium subscription checks
- `src/types/database.ts` - Auto-generated database types
- `wrangler.json` - Cloudflare Workers configuration
- `open-next.config.ts` - OpenNext adapter configuration
- `supabase/config.toml` - Local Supabase configuration
