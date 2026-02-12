'use client';

import { messaging, getToken, onMessage } from './config';

export async function requestNotificationPermission(): Promise<string | null> {
  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission === 'granted' && messaging) {
      console.log('Notification permission granted.');

      // Get FCM token
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

      if (!vapidKey) {
        console.error('VAPID key not configured');
        return null;
      }

      const token = await getToken(messaging, { vapidKey });

      if (token) {
        console.log('FCM Token:', token);
        // Send this token to your backend to save it
        await saveTokenToBackend(token);
        return token;
      } else {
        console.log('No registration token available.');
        return null;
      }
    } else if (permission === 'denied') {
      console.log('Notification permission denied.');
      return null;
    } else {
      console.log('Notification permission dismissed.');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
}

async function saveTokenToBackend(token: string) {
  try {
    const response = await fetch('/api/notifications/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Failed to save FCM token');
    }

    console.log('FCM token saved successfully');
  } catch (error) {
    console.error('Error saving token:', error);
    throw error;
  }
}

export function onMessageListener() {
  return new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);

        // Show notification even when app is in foreground
        if (payload.notification) {
          new Notification(payload.notification.title || 'Bowel Buddies', {
            body: payload.notification.body,
            icon: '/icon-192x192.png',
            badge: '/icon-72x72.png',
          });
        }

        resolve(payload);
      });
    }
  });
}
