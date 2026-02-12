// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: 'AIzaSyA9qx698UpOTFAgslc6455BVTdP5negpY0',
  authDomain: 'bowel-buddies-dd19d.firebaseapp.com',
  projectId: 'bowel-buddies-dd19d',
  storageBucket: 'bowel-buddies-dd19d.firebasestorage.app',
  messagingSenderId: '703500726899',
  appId: '1:703500726899:web:fcf1e6f27f45a73ef8b006',
  measurementId: 'G-T62059RKW6'
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Bowel Buddies';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: payload.data?.tag || 'default',
    data: payload.data,
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  // Open the app or focus existing window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }

      // Open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
