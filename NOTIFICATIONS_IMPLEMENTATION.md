# Push Notifications Implementation

This document describes the complete push notification system implementation for Bowel Buddies.

## ✅ Completed Features

### 1. Firebase Cloud Messaging Setup
- ✅ Firebase Admin SDK installed and configured
- ✅ FCM tokens stored in Supabase database
- ✅ Service worker for background notifications
- ✅ Notification permission UI in settings page

### 2. Notification API Infrastructure
- ✅ `/api/notifications/register` - Register FCM tokens
- ✅ `/api/notifications/send` - Send notifications to users
- ✅ `/api/notifications/daily-reminders` - Cron job for daily reminders

### 3. Use Case 1: Friend Activity Notifications
**Implemented:** ✅

When a user logs a movement, all their friends receive a push notification.

**How it works:**
1. User submits a log via `/log` page
2. `LogForm` component sends data to `/api/movements`
3. Movement is saved to database
4. `notifyFriendsOfMovement()` function:
   - Queries all accepted friendships
   - Sends notification to each friend
   - Notification: "💩 Friend Activity - [Name] just logged a movement!"

**Files involved:**
- `/src/components/log/LogForm.tsx` - Updated to use API route
- `/src/app/api/movements/route.ts` - Creates log and triggers notifications
- `/src/lib/notifications/helpers.ts` - Contains `notifyFriendsOfMovement()`

### 4. Use Case 2: Daily Reminders
**Implemented:** ✅

Users receive a daily reminder if they haven't logged yet today.

**How it works:**
1. Cron job calls `/api/notifications/daily-reminders` at 9 AM daily
2. Endpoint queries users with FCM tokens
3. Checks which users haven't logged today
4. Sends reminder notification to those users
5. Notification: "🚽 Daily Reminder - [Random motivational message]"

**Files involved:**
- `/src/app/api/notifications/daily-reminders/route.ts` - Cron endpoint
- `/src/lib/notifications/helpers.ts` - Contains `sendDailyReminder()`
- `/vercel.json` - Cron job configuration (9 AM daily)

## 📋 Setup Checklist

### Environment Variables
All environment variables are configured in `.env.local`:
- ✅ `NEXT_PUBLIC_FIREBASE_API_KEY`
- ✅ `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- ✅ `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_APP_ID`
- ✅ `NEXT_PUBLIC_FIREBASE_VAPID_KEY`
- ✅ `FIREBASE_PROJECT_ID`
- ✅ `FIREBASE_CLIENT_EMAIL`
- ✅ `FIREBASE_PRIVATE_KEY`
- ⚠️ `CRON_SECRET` - Set a random secret for cron job security

### Database
- ⚠️ Run migration: `/supabase/migrations/20260211000000_fcm_tokens.sql`

Run in Supabase SQL Editor:
```sql
-- See migration file for full SQL
```

### Deployment (Vercel)
When deploying to Vercel, you'll need to:
1. Add all environment variables in Vercel dashboard
2. The cron job in `vercel.json` will automatically be configured
3. Add `CRON_SECRET` to Vercel environment variables (production only)

## 🧪 Testing

### Test Friend Notifications
1. Create two test accounts
2. Add each other as friends
3. Log a movement with one account
4. Check if the other account receives a notification

### Test Daily Reminders
**Local testing:**
```bash
curl -X POST http://localhost:3000/api/notifications/daily-reminders \
  -H "Content-Type: application/json"
```

**Production testing:**
```bash
curl -X POST https://your-domain.com/api/notifications/daily-reminders \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Test Notification Permission Flow
1. Go to `/settings`
2. Click "Enable Notifications"
3. Grant permission in browser
4. Verify FCM token is saved in database:
   ```sql
   SELECT * FROM fcm_tokens WHERE user_id = 'your-user-id';
   ```

## 📱 How Notifications Work

### For Users
1. User enables notifications in settings
2. FCM token is saved to database
3. User receives notifications when:
   - A friend logs a movement
   - Daily reminder at 9 AM (if they haven't logged yet)
   - Future: Streak milestones, challenges, etc.

### Technical Flow
```
User Action
    ↓
API Route (/api/movements, /api/notifications/daily-reminders)
    ↓
Notification Helper (notifyFriendsOfMovement, sendDailyReminder)
    ↓
/api/notifications/send
    ↓
Firebase Admin SDK
    ↓
FCM → Service Worker → Browser Notification
```

## 🎯 Additional Notification Types

The following notification helpers are ready to use:

### Streak Milestones
```typescript
import { notifyStreakMilestone } from '@/lib/notifications/helpers';

// Call when user reaches a milestone
await notifyStreakMilestone(userId, streakDays);
```

Automatically sends notifications on weekly milestones (7, 14, 21 days, etc.)

## 🔐 Security Considerations

1. **FCM Token Protection**
   - Tokens are stored with Row Level Security (RLS)
   - Users can only access their own tokens

2. **Cron Job Authentication**
   - Daily reminders endpoint checks `CRON_SECRET`
   - Prevents unauthorized calls

3. **User Consent**
   - Notifications only sent to users who enabled them
   - Users can disable in browser settings

## 🚀 Future Enhancements

Potential additions:
- [ ] Notification preferences UI (choose which types to receive)
- [ ] Quiet hours (don't send notifications during sleep)
- [ ] Weekly summary notifications
- [ ] Challenge notifications
- [ ] Leaderboard position changes
- [ ] Friend request notifications

## 📊 Monitoring

Check Firebase Console for:
- Notification delivery rates
- Token refresh rates
- Error rates

Check Supabase for:
- Number of registered tokens
- User engagement with notifications

## 🐛 Troubleshooting

**Notifications not appearing?**
1. Check browser notification permission
2. Check FCM token is saved in database
3. Check service worker is registered
4. Check Firebase Console for errors
5. Check browser console for client-side errors

**Daily reminders not sending?**
1. Verify Vercel cron job is configured
2. Check Vercel deployment logs
3. Test endpoint manually with curl
4. Check `CRON_SECRET` is set in production

**Invalid token errors?**
- Tokens are automatically removed from database when invalid
- User will need to re-enable notifications in settings

## 📚 Resources

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
