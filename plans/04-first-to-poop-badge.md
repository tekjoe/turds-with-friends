# 04 — "First to Poop" Badge

## Overview

Award a badge to users who are the first person to ever log a bowel movement at a specific location. Extends the existing badge system.

## Effort

Low — one new badge row, extend existing badge-checking logic, no new tables.

## Implementation Steps

### 1. Database migration: Insert badge definition

Create `supabase/migrations/YYYYMMDD000000_first_to_poop_badge.sql`:

```sql
insert into public.badges (id, name, description, criteria_type, criteria_value, icon)
values (
  gen_random_uuid(),
  'Pioneer',
  'Be the first person to log a movement at a new location',
  'first_at_location',
  1,
  'explore'
);
```

This adds a new `criteria_type` value: `first_at_location`.

### 2. Update `src/lib/gamification.ts`

In the `checkBadgeEligibility` function (or wherever badge criteria are evaluated), add a new case:

```typescript
case "first_at_location": {
  // Check if this user has any location_log where they were the first user
  // to ever log at that specific place_name (or lat/lng rounded to ~100m)
  const { count } = await supabase
    .from("location_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    // Subquery: locations where no earlier log exists from another user
    // This needs to be done as a stored function or in application logic
  break;
}
```

**Practical approach**: Since Supabase doesn't easily support correlated subqueries in the JS client, implement as application logic:

1. Get all `location_logs` for the user
2. For each location, check if any `location_log` exists at the same `place_name` with an earlier `created_at` from a different user
3. If the user was first at any location, they qualify

**Optimization**: To avoid checking all locations every time, check only the most recently logged location (the one that triggered badge evaluation).

### 3. Trigger badge check after location logging

In the location logging flow (after `POST /api/locations` succeeds or in the log form submission):

1. After inserting a `location_log`, query for any other `location_log` with the same `place_name` that was created before this one
2. If none exist, the user is the first at this location — call the badge award function
3. The badge should only be awarded once (existing `user_badges` unique constraint prevents duplicates)

### 4. Update `src/app/actions/badges.ts`

Add the `first_at_location` check to the server action that evaluates badges after logging. The check:

```typescript
// After a location log is created:
const { count } = await admin
  .from("location_logs")
  .select("id", { count: "exact", head: true })
  .eq("place_name", newLocationPlaceName)
  .neq("user_id", userId)
  .lt("created_at", newLocationCreatedAt);

if (count === 0) {
  // User is the pioneer! Award the badge.
  await awardBadge(userId, pioneerBadgeId);
}
```

### 5. Display in profile/badges UI

The existing badges display should automatically pick up the new badge since it follows the same `badges`/`user_badges` pattern.

## Files Changed

| File | Change |
|------|--------|
| `supabase/migrations/YYYYMMDD_first_to_poop_badge.sql` | New migration: insert badge definition |
| `src/lib/gamification.ts` | Add `first_at_location` criteria type handling |
| `src/app/actions/badges.ts` | Trigger pioneer check after location log creation |

## Edge Cases

- **Null `place_name`**: If a location has no `place_name`, fall back to comparing `latitude`/`longitude` rounded to 3 decimal places (~100m precision)
- **Same user, same place**: If the user logs at the same place multiple times, the badge should only be evaluated on the first log at that place
- **Race condition**: Two users logging at the same new place simultaneously — the one with the earlier `created_at` wins

## Testing

- Log at a brand new location → verify "Pioneer" badge is awarded
- Log at a location where someone else already logged → verify badge is NOT awarded
- Log at the same new location twice → verify badge is only awarded once
- Verify badge appears in the user's badge collection
