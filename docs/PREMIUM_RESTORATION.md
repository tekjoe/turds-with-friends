# Premium Feature Restoration Guide

> **Document Version:** 1.0  
> **Last Updated:** February 11, 2026  
> **Applies To:** turds-with-friends application  

## Table of Contents

1. [Overview](#overview)
2. [Background: Why Premium Was Opened](#background-why-premium-was-opened)
3. [Pre-Restoration Checklist](#pre-restoration-checklist)
4. [Files Requiring Restoration](#files-requiring-restoration)
   - [lib/premium.ts](#1-libpremiumts)
   - [Analytics Page](#2-analytics-page)
   - [Challenges Page](#3-challenges-page)
   - [Map Page](#4-map-page)
   - [Upgrade Page](#5-upgrade-page)
   - [API Routes](#6-api-routes)
   - [UI Components](#7-ui-components)
5. [Step-by-Step Restoration Process](#step-by-step-restoration-process)
6. [Testing After Restoration](#testing-after-restoration)
7. [Rollback Strategy](#rollback-strategy)
8. [Troubleshooting](#troubleshooting)
9. [Related Documentation](#related-documentation)

---

## Overview

This document provides comprehensive instructions for re-enabling premium feature gating in the turds-with-friends application. During a promotional period, premium features were opened to all users by modifying the `isPremium()` function and removing/commenting out premium checks throughout the codebase.

This guide covers every file that was modified, providing before/after code comparisons and step-by-step restoration instructions.

---

## Background: Why Premium Was Opened

As part of user story US-001 through US-005, premium access was temporarily granted to all users to:

- Increase user engagement during a promotional period
- Allow evaluation of premium features by the entire user base
- Gather feedback on feature usage patterns

**Features that were opened:**
- Advanced Analytics (monthly trends, time-of-day analysis, Bristol trends)
- Friend Challenges (create, join, and compete in challenges)
- Poop Map (location tracking with privacy controls)
- Data Export (CSV and PDF download of movement logs)
- Location tracking in logs

---

## Pre-Restoration Checklist

Before re-enabling premium checks, ensure:

- [ ] Stripe integration is active and configured
- [ ] `subscriptions` table exists in Supabase with proper schema
- [ ] Webhook handlers for Stripe events are operational
- [ ] `/upgrade` page is functional and accepts payments
- [ ] Test users exist with both premium and non-premium states
- [ ] Team is prepared for potential support inquiries
- [ ] A maintenance window is scheduled (if necessary)

---

## Files Requiring Restoration

### 1. lib/premium.ts

**Location:** `src/lib/premium.ts`

**Current State (Open Access):**
```typescript
/**
 * Check if a user has premium access
 * @param userId - The user's ID (unused, but kept for API compatibility)
 * @returns Promise<boolean> - Always returns true (universal premium access)
 */
export async function isPremium(_userId: string): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  void _userId; // Parameter kept for API compatibility
  // See the comment at the top of this file for the original implementation
  return true;
}
```

**Restored State (Premium Check):**
```typescript
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Check if a user has premium access
 * @param userId - The user's ID
 * @returns Promise<boolean> - True if user has active subscription
 */
export async function isPremium(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .gt("current_period_end", new Date().toISOString())
    .limit(1)
    .maybeSingle();

  return !!data;
}
```

**Action Required:** Replace the current implementation with the restored version above, ensuring the Supabase admin client import is present.

---

### 2. Analytics Page

**Location:** `src/app/(authenticated)/analytics/page.tsx`

**Current State (Open Access):**
```typescript
// Premium check kept for future reference - redirects removed as part of US-001
await isPremium(user.id);
```

**Restored State (Premium Check):**
```typescript
const premium = await isPremium(user.id);
if (!premium) redirect("/upgrade");
```

**Note:** The import for `isPremium` is already present at the top of the file.

---

### 3. Challenges Page

**Location:** `src/app/(authenticated)/challenges/page.tsx`

**Current State (Open Access):**
```typescript
// Premium check kept for future reference - redirects removed as part of US-001
await isPremium(user.id);
```

**Restored State (Premium Check):**
```typescript
const premium = await isPremium(user.id);
if (!premium) redirect("/upgrade");
```

---

### 4. Map Page

**Location:** `src/app/(authenticated)/map/page.tsx`

**Current State (Open Access):**
```typescript
// Premium check kept for future reference - redirects removed as part of US-001
await isPremium(user.id);
```

**Restored State (Premium Check):**
```typescript
const premium = await isPremium(user.id);
if (!premium) redirect("/upgrade");
```

---

### 5. Upgrade Page

**Location:** `src/app/(authenticated)/upgrade/page.tsx`

**Current State (Open Access):**
```typescript
// Premium check kept for future reference - redirect removed as part of US-001
await isPremium(user.id);
```

**Restored State (Premium Check):**
```typescript
const premium = await isPremium(user.id);
if (premium) redirect("/dashboard"); // Redirect paid users away from upgrade page
```

**Note:** For the upgrade page, premium users should be redirected to the dashboard since they don't need to see upgrade options.

---

### 6. API Routes

#### 6.1 Challenges API (`src/app/api/challenges/route.ts`)

**Current State (Open Access):**
```typescript
// Premium check disabled - all users have access
// const premium = await isPremium(user.id);
```

**Restored State (Premium Check) - Add to both GET and POST handlers:**
```typescript
import { isPremium } from "@/lib/premium"; // Add this import

// In GET and POST handlers:
const premium = await isPremium(user.id);
if (!premium) {
  return NextResponse.json(
    { error: "Premium subscription required" },
    { status: 403 }
  );
}
```

#### 6.2 Export API (`src/app/api/export/route.ts`)

**Current State (Open Access):**
```typescript
// Premium check disabled - all users have access
// const premium = await isPremium(user.id);
```

**Restored State (Premium Check):**
```typescript
import { isPremium } from "@/lib/premium"; // Add this import

const premium = await isPremium(user.id);
if (!premium) {
  return NextResponse.json(
    { error: "Premium subscription required" },
    { status: 403 }
  );
}
```

#### 6.3 Locations API (`src/app/api/locations/route.ts`)

**Current State (Open Access):**
```typescript
// Premium check disabled - all users have access
// const premium = await isPremium(user.id);
```

**Restored State (Premium Check) - Add to both GET and POST handlers:**
```typescript
import { isPremium } from "@/lib/premium"; // Add this import

const premium = await isPremium(user.id);
if (!premium) {
  return NextResponse.json(
    { error: "Premium subscription required" },
    { status: 403 }
  );
}
```

---

### 7. UI Components

#### 7.1 Navbar (`src/components/ui/Navbar.tsx`)

**Current State:** The Navbar currently shows all navigation links to authenticated users regardless of premium status. The `isPremium` prop is optional and unused.

**Restored State:** The Navbar should conditionally show premium navigation items based on the `isPremium` prop.

**Changes Required:**

1. **Update the interface:**
```typescript
interface NavbarProps {
  isAuthenticated?: boolean;
  userName?: string;
  avatarUrl?: string;
  isPremium?: boolean; // Make this required when premium is enforced
}
```

2. **Destructure isPremium in component:**
```typescript
export function Navbar({ isAuthenticated = false, userName, avatarUrl, isPremium = false }: NavbarProps) {
```

3. **Conditional navigation links:**
```typescript
{isAuthenticated && (
  <>
    <Link href="/dashboard" className="hover:text-primary transition-colors">
      Dashboard
    </Link>
    <Link href="/friends" className="hover:text-primary transition-colors">
      Friends
    </Link>
    <Link href="/activity" className="hover:text-primary transition-colors">
      Activity
    </Link>
    {isPremium && (
      <>
        <Link href="/analytics" className="hover:text-primary transition-colors">
          Analytics
        </Link>
        <Link href="/challenges" className="hover:text-primary transition-colors">
          Challenges
        </Link>
        <Link href="/map" className="hover:text-primary transition-colors">
          Poop Map
        </Link>
      </>
    )}
  </>
)}
```

4. **Add "Go Pro" button for non-premium users:**
```typescript
{!isPremium && (
  <Link href="/upgrade">
    <Button variant="primary" size="sm">
      Go Pro
    </Button>
  </Link>
)}
```

#### 7.2 ExportButton (`src/components/dashboard/ExportButton.tsx`)

**Current State:** The ExportButton currently allows all users to export data.

**Restored State:** Add premium prop and conditional rendering.

**Changes Required:**

1. **Add isPremium prop:**
```typescript
interface ExportButtonProps {
  isPremium: boolean;
}

export function ExportButton({ isPremium }: ExportButtonProps) {
```

2. **Conditional rendering:**
```typescript
if (!isPremium) {
  return (
    <Link href="/upgrade">
      <Button variant="outline" size="sm">
        <Icon name="lock" className="text-base mr-1" />
        Export (Pro)
      </Button>
    </Link>
  );
}

// Existing dropdown implementation for premium users...
```

#### 7.3 LogForm (`src/components/log/LogForm.tsx`)

**Current State:** The LogForm currently shows premium-styled location tracking to all users.

**Restored State:** Add conditional location tracking based on premium status.

**Changes Required:**

1. **Remove eslint-disable comment and use the prop:**
```typescript
export function LogForm({ isPremium }: LogFormProps) {
```

2. **Conditional location section:**
```typescript
{isPremium ? (
  <section className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
    {/* Premium location tracking UI */}
  </section>
) : (
  <section className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
    {/* Free user upsell UI */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          <Icon name="location_on" className="text-xl text-slate-400" />
        </div>
        <div>
          <p className="font-bold flex items-center gap-2">
            Track Location <PremiumBadge />
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Pin this throne on your Poop Map
          </p>
        </div>
      </div>
      <Link href="/upgrade">
        <Button variant="primary" size="sm">
          Upgrade
        </Button>
      </Link>
    </div>
  </section>
)}
```

3. **Update location capture logic:**
```typescript
// Change from:
if (trackLocation && logData) {

// To:
if (isPremium && trackLocation && logData) {
```

---

## Step-by-Step Restoration Process

Follow these steps in order to ensure a clean restoration:

### Phase 1: Core Logic (5 minutes)

1. **Restore lib/premium.ts**
   - Open `src/lib/premium.ts`
   - Replace the current implementation with the restored version
   - Ensure `createAdminClient` is imported
   - Save and verify no TypeScript errors

2. **Run type check**
   ```bash
   npm run typecheck
   ```

### Phase 2: Route Protection (10 minutes)

3. **Restore page-level protection**
   - Open each page file:
     - `src/app/(authenticated)/analytics/page.tsx`
     - `src/app/(authenticated)/challenges/page.tsx`
     - `src/app/(authenticated)/map/page.tsx`
     - `src/app/(authenticated)/upgrade/page.tsx`
   - Replace the comment-only premium check with active check + redirect
   - Save each file

4. **Run build**
   ```bash
   npm run build
   ```

### Phase 3: API Protection (10 minutes)

5. **Restore API route checks**
   - Open each API route:
     - `src/app/api/challenges/route.ts`
     - `src/app/api/export/route.ts`
     - `src/app/api/locations/route.ts`
   - Add `isPremium` import if missing
   - Uncomment or add premium checks
   - Return 403 status for non-premium users
   - Save each file

6. **Run tests**
   ```bash
   npm test
   ```

### Phase 4: UI Components (15 minutes)

7. **Restore Navbar premium logic**
   - Update interface to require `isPremium`
   - Add conditional rendering for premium nav items
   - Add "Go Pro" button for non-premium users

8. **Restore ExportButton premium logic**
   - Add `isPremium` prop
   - Add conditional rendering

9. **Restore LogForm premium logic**
   - Remove eslint-disable comment
   - Add conditional location section
   - Update location capture logic

### Phase 5: Parent Components (10 minutes)

10. **Update all Navbar usages**
    - Find all files that render `<Navbar />`
    - Pass `isPremium` prop based on user status
    - Example:
    ```typescript
    const premium = await isPremium(user.id);
    return <Navbar isAuthenticated={true} isPremium={premium} ... />;
    ```

11. **Update all ExportButton usages**
    - Pass `isPremium` prop

12. **Update all LogForm usages**
    - Pass `isPremium` prop

### Phase 6: Final Verification (10 minutes)

13. **Run full test suite**
    ```bash
    npm test
    ```

14. **Run production build**
    ```bash
    npm run build
    ```

15. **Manual smoke test**
    - Log in as non-premium user
    - Verify redirects on premium pages
    - Verify 403 errors on API calls
    - Log in as premium user
    - Verify full access

---

## Testing After Restoration

### Automated Tests

Run the full test suite:

```bash
npm test
```

**Expected results:**
- All existing tests should pass
- Premium-related tests should verify gating behavior
- No regressions in non-premium functionality

### Manual Testing Checklist

#### Non-Premium User Test
- [ ] Access `/analytics` → Should redirect to `/upgrade`
- [ ] Access `/challenges` → Should redirect to `/upgrade`
- [ ] Access `/map` → Should redirect to `/upgrade`
- [ ] Access `/api/export?format=csv` → Should return 403
- [ ] Access `/api/locations` → Should return 403
- [ ] Access `/api/challenges` → Should return 403
- [ ] View Navbar → Should see "Go Pro" button, no premium nav items
- [ ] View Dashboard → Should see locked Export button
- [ ] View Log Form → Should see upgrade prompt for location tracking

#### Premium User Test
- [ ] Access `/analytics` → Should load analytics page
- [ ] Access `/challenges` → Should load challenges page
- [ ] Access `/map` → Should load map page
- [ ] Access `/api/export?format=csv` → Should return CSV file
- [ ] Access `/api/locations` → Should return locations data
- [ ] Access `/api/challenges` → Should return challenges data
- [ ] View Navbar → Should see premium nav items, no "Go Pro" button
- [ ] View Dashboard → Should see functional Export dropdown
- [ ] View Log Form → Should see enabled location tracking toggle

#### Edge Cases
- [ ] Expired subscription → Should lose premium access immediately
- [ ] Cancelled subscription → Should retain access until period end
- [ ] New signup → Should not have premium access
- [ ] Subscription renewal → Should maintain uninterrupted access

---

## Rollback Strategy

If issues arise after restoration, use one of these rollback methods:

### Method 1: Git Revert (Recommended)

If the restoration was committed as a single commit:

```bash
# Find the restoration commit
 git log --oneline -10

# Revert the commit
git revert <commit-hash>

# Push to remote
git push origin main
```

### Method 2: Hotfix Branch

If you need to keep the restoration but fix issues:

```bash
# Create hotfix branch
git checkout -b hotfix/premium-issues

# Make fixes
# ... edit files ...

# Commit and push
git add .
git commit -m "hotfix: resolve premium restoration issues"
git push origin hotfix/premium-issues

# Create PR for review
```

### Method 3: Feature Flag (Safest)

For gradual rollout, use an environment variable:

```typescript
// lib/premium.ts
export async function isPremium(userId: string): Promise<boolean> {
  // Emergency bypass - set to true to disable all premium checks
  if (process.env.BYPASS_PREMIUM === 'true') {
    return true;
  }
  
  // Normal premium check
  const admin = createAdminClient();
  // ... rest of implementation
}
```

To instantly rollback, set `BYPASS_PREMIUM=true` in your environment.

---

## Troubleshooting

### Issue: Users incorrectly showing as non-premium

**Cause:** Subscription data may be stale or webhook not processed.

**Solution:**
1. Check Supabase `subscriptions` table for user record
2. Verify Stripe webhook is delivering events
3. Check webhook endpoint logs for errors
4. Manually sync subscription if needed:
   ```sql
   -- Query to check subscription status
   SELECT * FROM subscriptions 
   WHERE user_id = '<user-id>' 
   AND status = 'active'
   AND current_period_end > NOW();
   ```

### Issue: TypeScript errors after restoration

**Cause:** Missing imports or type mismatches.

**Solution:**
1. Run `npm run typecheck` to identify errors
2. Common fixes:
   - Add `isPremium` import: `import { isPremium } from "@/lib/premium";`
   - Ensure props interface includes `isPremium: boolean`
   - Check for unused variables (remove eslint-disable comments where appropriate)

### Issue: API routes returning 500 instead of 403

**Cause:** Missing error handling or incorrect response format.

**Solution:**
Ensure your API routes return proper NextResponse:
```typescript
if (!premium) {
  return NextResponse.json(
    { error: "Premium subscription required" },
    { status: 403 }
  );
}
```

### Issue: Navbar not updating after subscription change

**Cause:** Navbar props not being passed correctly from server components.

**Solution:**
Ensure parent components fetch premium status and pass it:
```typescript
// In layout or page that renders Navbar
const premium = await isPremium(user.id);
return (
  <Navbar 
    isAuthenticated={true} 
    isPremium={premium}
    userName={user.user_metadata.display_name}
  />
);
```

---

## Related Documentation

- [Stripe Integration Setup](./STRIPE_SETUP.md)
- [Supabase Schema Documentation](./DATABASE_SCHEMA.md)
- [Environment Variables Guide](./ENVIRONMENT.md)
- [Testing Guide](./TESTING.md)

---

## Questions or Issues?

If you encounter problems not covered in this guide:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review recent commits with: `git log --oneline --grep="premium"`
3. Consult the original implementation comments in modified files
4. Contact the team lead or refer to project documentation

---

*Document maintained by the turds-with-friends development team.*
