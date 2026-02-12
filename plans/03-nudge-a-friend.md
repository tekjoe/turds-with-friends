# 03 — Nudge a Friend

## Overview

Let users send a push notification "nudge" to a friend, encouraging them to log a movement. Uses the existing FCM infrastructure.

## Effort

Low — one new API endpoint, one UI button, leverages existing notification and FCM systems.

## Implementation Steps

### 1. API route: `src/app/api/friends/nudge/route.ts`

**POST** — Send a nudge to a friend:

```typescript
// Body: { friend_id: string }
```

Logic:
1. Authenticate the user
2. Verify the `friend_id` has an accepted friendship with the current user (query `friendships` table)
3. Rate limit: check `notifications` table for a nudge from this user to this friend in the last 60 minutes. If found, return 429.
4. Get the sender's display name from `profiles`
5. Insert a notification record:
   ```typescript
   {
     user_id: friend_id,
     actor_id: user.id,
     type: "nudge",
     message: `${senderName} is nudging you to hit the throne!`,
   }
   ```
6. Look up the friend's FCM token from `fcm_tokens` table
7. If token exists, send a push notification via Firebase Admin SDK (follow the pattern used in the existing notification send endpoint)
8. Return `{ success: true }`

### 2. Add nudge button to friend cards

**In `src/components/friends/FriendsClient.tsx`:**

- Add a "Nudge" button next to the existing "View Stats" button on each friend card
- Style: secondary/outline button with a notification bell icon
- On click: `POST /api/friends/nudge` with the friend's ID
- Show loading state while sending
- After success, swap button text to "Nudged!" for 2 seconds, then revert
- If rate-limited (429), show "Already nudged recently" toast/message

### 3. Add nudge button to map friend pins

**In `src/components/map/MapInner.tsx`:**

- In friend pin popups, add a "Nudge" button below the friend's name
- Same behavior as the friends page button

### 4. Handle nudge notifications in activity feed

**In `src/app/(authenticated)/activity/page.tsx` and `ActivityClient.tsx`:**

- The existing notification system should already display nudges since they go into the `notifications` table
- Verify nudge notifications render with an appropriate icon (bell or hand-wave)
- Add a nudge-specific icon in the activity feed: use `notifications_active` material icon

## Files Changed

| File | Change |
|------|--------|
| `src/app/api/friends/nudge/route.ts` | New API route |
| `src/components/friends/FriendsClient.tsx` | Add nudge button to friend cards |
| `src/components/map/MapInner.tsx` | Add nudge button to friend pin popups |
| `src/components/activity/ActivityClient.tsx` | Handle "nudge" notification type rendering (if needed) |

## Rate Limiting

- One nudge per sender→receiver pair per 60 minutes
- Enforced server-side by checking existing notifications
- Client shows feedback when rate-limited

## Testing

- Nudge a friend and verify they receive a push notification
- Verify the nudge appears in the friend's activity feed
- Attempt to nudge the same friend again within 60 minutes — should be rate-limited
- Verify nudge button appears on both friends page and map friend pins
- Verify non-friends cannot be nudged (friendship validation)
