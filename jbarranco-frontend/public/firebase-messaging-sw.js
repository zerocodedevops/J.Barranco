// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
firebase.initializeApp({
    apiKey: "AIzaSyAp88aGPxAHiI_MZxnUgHwwIRKHtWVqUWA",
    authDomain: "j-barranco.firebaseapp.com",
    projectId: "j-barranco",
    storageBucket: "j-barranco.firebasestorage.app",
    messagingSenderId: "650743177887",
    appId: "1:650743177887:web:b3f1b61f93aba1b02b0c40",
    measurementId: "G-64SJ18K80Y"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: payload.data?.tag || 'default',
        data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification click received.');

    event.notification.close();

    // Navigate to the URL if provided in the notification data
    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.openWindow(urlToOpen)
    );
});
