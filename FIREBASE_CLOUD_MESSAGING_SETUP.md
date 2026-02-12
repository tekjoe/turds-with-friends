# Firebase Cloud Messaging (FCM) Setup Guide

This guide will walk you through setting up Firebase Cloud Messaging for push notifications in your Bowel Buddies PWA.

## Prerequisites

✅ PWA is configured (completed)
✅ Service worker is set up (completed)
✅ App can be installed on devices (completed)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: **Bowel Buddies** (or your preferred name)
4. (Optional) Enable Google Analytics
5. Click "Create project" and wait for setup to complete

## Step 2: Register Your Web App

1. In Firebase Console, click the **Web icon** (`</>`) to add a web app
2. App nickname: **Bowel Buddies Web**
3. ✅ Check "Also set up Firebase Hosting" (optional but recommended)
4. Click "Register app"
5. **Copy the Firebase configuration** - you'll need this later

The config looks like this:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 3: Enable Cloud Messaging

1. In Firebase Console sidebar, go to **Build** → **Cloud Messaging**
2. Click on **Cloud Messaging API (Legacy)** if prompted
3. Enable the API
4. Go to **Project Settings** (gear icon) → **Cloud Messaging** tab
5. Under **Web Push certificates**, click **Generate key pair**
6. **Copy the VAPID key** (also called "Web Push certificate")

## Step 4: Install Firebase SDK

Run in your project directory:

```bash
npm install firebase
```

## Step 5: Create Firebase Configuration File

Create `/src/lib/firebase/config.ts`:

```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Cloud Messaging
let messaging: ReturnType<typeof getMessaging> | null = null;

if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}

export { app, messaging, getToken, onMessage };
```

## Step 6: Add Environment Variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_VAPID_KEY=your_vapid_key_here
```

## Step 7: Create Firebase Messaging Service Worker

Create `/public/firebase-messaging-sw.js`:

```javascript
// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  storageBucket: 'your-project.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456'
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

## Step 8: Request Notification Permission

Create `/src/lib/firebase/notifications.ts`:

```typescript
'use client';

import { messaging, getToken, onMessage } from './config';

export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted' && messaging) {
      console.log('Notification permission granted.');

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
      });

      if (token) {
        console.log('FCM Token:', token);
        // Send this token to your backend to save it
        await saveTokenToBackend(token);
        return token;
      }
    } else {
      console.log('Notification permission denied.');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
}

async function saveTokenToBackend(token: string) {
  // Send token to your backend
  const response = await fetch('/api/notifications/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error('Failed to save FCM token');
  }
}

export function onMessageListener() {
  return new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);
        resolve(payload);
      });
    }
  });
}
```

## Step 9: Create Backend API Route for Token Storage

Create `/src/app/api/notifications/register/route.ts`:

```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Save FCM token to database
    const { error } = await supabase
      .from('fcm_tokens')
      .upsert({
        user_id: user.id,
        token: token,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving FCM token:', error);
    return NextResponse.json(
      { error: 'Failed to save token' },
      { status: 500 }
    );
  }
}
```

## Step 10: Create Database Table for FCM Tokens

Run this SQL migration in Supabase:

```sql
-- Create fcm_tokens table
CREATE TABLE IF NOT EXISTS fcm_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE fcm_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own tokens"
  ON fcm_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tokens"
  ON fcm_tokens FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own tokens"
  ON fcm_tokens FOR SELECT
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_fcm_tokens_user_id ON fcm_tokens(user_id);
```

## Step 11: Add Notification Request to Your App

Add to a settings page or dashboard component:

```typescript
'use client';

import { useState } from 'react';
import { requestNotificationPermission } from '@/lib/firebase/notifications';
import { Button } from '@/components/ui/Button';

export function NotificationSettings() {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const handleEnableNotifications = async () => {
    setLoading(true);
    const token = await requestNotificationPermission();
    setEnabled(!!token);
    setLoading(false);
  };

  return (
    <div>
      <h3>Push Notifications</h3>
      <p>Get notified when friends complete challenges or beat your streak!</p>
      <Button
        onClick={handleEnableNotifications}
        disabled={loading || enabled}
      >
        {enabled ? 'Notifications Enabled ✓' : 'Enable Notifications'}
      </Button>
    </div>
  );
}
```

## Step 12: Send Notifications from Backend

Create `/src/app/api/notifications/send/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

// You'll need to install: npm install firebase-admin
import admin from 'firebase-admin';

// Initialize Firebase Admin (do this once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: Request) {
  try {
    const { userId, title, body, data } = await request.json();

    const supabase = createAdminClient();

    // Get user's FCM token
    const { data: tokenData } = await supabase
      .from('fcm_tokens')
      .select('token')
      .eq('user_id', userId)
      .single();

    if (!tokenData) {
      return NextResponse.json(
        { error: 'No FCM token found for user' },
        { status: 404 }
      );
    }

    // Send notification
    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      token: tokenData.token,
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);

    return NextResponse.json({ success: true, messageId: response });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
```

## Step 13: Add Firebase Admin Environment Variables

Add to `.env.local`:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

To get these values:
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. Use the values from that file

## Step 14: Install Firebase Admin SDK

```bash
npm install firebase-admin
```

## Testing Notifications

### Test from Frontend (Simple)
```typescript
// In browser console or component
await requestNotificationPermission();
```

### Test from Backend (API)
```bash
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid-here",
    "title": "Test Notification",
    "body": "This is a test notification from Bowel Buddies!"
  }'
```

### Test from Firebase Console
1. Go to Firebase Console → Cloud Messaging
2. Click "Send your first message"
3. Enter title and body
4. Click "Send test message"
5. Enter your FCM token
6. Click "Test"

## Common Use Cases

### 1. Notify when a friend logs
```typescript
// After a user logs a movement
const friends = await getFriendIds(userId);
for (const friendId of friends) {
  await fetch('/api/notifications/send', {
    method: 'POST',
    body: JSON.stringify({
      userId: friendId,
      title: '💩 Friend Activity',
      body: `${userName} just logged a movement!`,
    }),
  });
}
```

### 2. Daily reminder
```typescript
// Cron job or scheduled function
await fetch('/api/notifications/send', {
  method: 'POST',
  body: JSON.stringify({
    userId: userId,
    title: '🚽 Time to Log',
    body: "Don't forget to track your bowel movement today!",
  }),
});
```

### 3. Streak milestone
```typescript
if (newStreak % 7 === 0) {
  await fetch('/api/notifications/send', {
    method: 'POST',
    body: JSON.stringify({
      userId: userId,
      title: '🔥 Streak Milestone!',
      body: `Amazing! You've reached a ${newStreak}-day streak!`,
    }),
  });
}
```

## Troubleshooting

### Notifications not appearing?
1. Check browser console for errors
2. Verify notification permission is granted
3. Check service worker is registered: `navigator.serviceWorker.getRegistrations()`
4. Test with Firebase Console test message
5. Check FCM token is saved in database

### Service worker issues?
1. Unregister old service workers in DevTools → Application → Service Workers
2. Clear cache and reload
3. Check for JavaScript errors in service worker

### Token not saving?
1. Check network tab for API call to `/api/notifications/register`
2. Verify Supabase RLS policies
3. Check user is authenticated

## Production Considerations

1. **Rate Limiting**: Implement rate limiting for notification sending
2. **User Preferences**: Let users control notification types
3. **Quiet Hours**: Don't send notifications during user's sleep time
4. **Batch Notifications**: Group similar notifications
5. **Token Refresh**: Handle token refresh when tokens expire
6. **Error Handling**: Log failed sends and retry

## Next Steps

After completing this setup:
- [ ] Test on mobile devices (Android/iOS)
- [ ] Add notification preferences UI
- [ ] Implement daily reminder schedule
- [ ] Add friend activity notifications
- [ ] Test notification icons and badges
- [ ] Monitor FCM delivery rates in Firebase Console

## Resources

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging/js/client)
- [Web Push Notifications](https://web.dev/push-notifications-overview/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
