# Re-enabling Premium Features

This document outlines how to restore premium feature gating in the turds-with-friends application.

## Overview

Premium features were temporarily opened to all users by modifying several components. This guide explains how to reverse those changes if you need to re-enable premium restrictions in the future.

## Files Modified

### 1. lib/premium.ts
**Current State:** Returns `true` for all users
**To Restore:** Uncomment the ORIGINAL IMPLEMENTATION block at the top of the file and remove the simplified return statement.

```typescript
// CURRENT (all users have premium):
export async function isPremium(_userId: string): Promise<boolean> {
  return true;
}

// RESTORE (check subscription):
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

### 2. App Pages (Route Protection)
Files to restore premium checks:
- `src/app/(authenticated)/analytics/page.tsx`
- `src/app/(authenticated)/challenges/page.tsx`
- `src/app/(authenticated)/map/page.tsx`
- `src/app/(authenticated)/upgrade/page.tsx`

**Change:** Uncomment or re-add these lines:
```typescript
const premium = await isPremium(user.id);
if (!premium) redirect("/upgrade");
```

### 3. API Routes
Files to restore premium checks:
- `src/app/api/challenges/route.ts`
- `src/app/api/challenges/[id]/respond/route.ts`
- `src/app/api/export/route.ts`
- `src/app/api/locations/route.ts`
- `src/app/api/locations/[id]/comments/route.ts`

**Change:** Uncomment or re-add premium checks before processing requests.

### 4. UI Components

#### Navbar (`src/components/ui/Navbar.tsx`)
**Restore:**
- Premium badge display logic
- "Go Pro" upgrade button for non-premium users
- Conditional hiding of Analytics, Challenges, Poop Map links for non-premium

#### ExportButton (`src/components/dashboard/ExportButton.tsx`)
**Restore:**
- `isPremium` prop requirement
- Premium badge display for non-premium users
- Conditional dropdown based on premium status

#### LogForm (`src/components/log/LogForm.tsx`)
**Restore:**
- `isPremium` prop requirement
- Conditional location tracking based on premium status
- Premium badge/promo in location section

## Testing After Restoration

1. Run tests to ensure premium gating works:
   ```bash
   npm test
   ```

2. Manual verification:
   - Create a test user without a subscription
   - Verify redirects to `/upgrade` on premium pages
   - Verify API returns 403 for premium endpoints
   - Verify UI shows upgrade prompts

3. Create a test user with an active subscription
   - Verify full access to all features

## Rollback Strategy

If issues arise after restoration:

1. **Quick rollback:** Revert to the commit before premium was re-enabled:
   ```bash
   git log --oneline | grep -i premium
   git revert <commit-hash>
   ```

2. **Database considerations:** Ensure subscription data exists in the `subscriptions` table before enabling checks.

## Notes

- The `isPremium` function maintains backward-compatible signature
- Tests were added for all premium-related functionality
- Original implementations are preserved in comments where possible
- Stripe integration should be active before re-enabling premium checks
