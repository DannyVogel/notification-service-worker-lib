# Notification Service Worker Library

A lightweight JavaScript library for implementing web push notifications in browser applications. This library simplifies the process of setting up service workers for push notifications.

## Features

- Easy registration of service workers for push notifications
- Handling of push notification permissions
- Subscription management for web push

## Installation

```bash
npm install notification-service-worker-lib
```

After installation, run the setup command to initialize the service worker:

```bash
npx notification-service-worker init
```

This will copy the service worker file to your project's `public` directory.

## Usage

Import and initialize the push notification system in your application:

```javascript
import { initPushNotifications } from "notification-service-worker-lib";

initPushNotifications({
  vapidPublicKey: "YOUR_VAPID_PUBLIC_KEY",
  subscribeUrl: "https://your-api.com/push/subscribe",
  onPermissionDenied: () => {
    console.log("Notification permission was denied");
  },
  onSuccess: (subscription) => {
    console.log("Successfully subscribed to push notifications", subscription);
  },
});
```

## API Reference

### `initPushNotifications(config)`

Initializes the push notification system by registering a service worker and requesting permission.

#### Parameters

- `config` (Object): Configuration object with the following properties:
  - `vapidPublicKey` (String, required): Your VAPID public key for web push
  - `subscribeUrl` (String, required): URL where push subscriptions will be sent
  - `onPermissionDenied` (Function, optional): Callback function triggered when notification permission is denied
  - `onSuccess` (Function, optional): Callback function triggered when subscription is successful, receives the subscription object as a parameter

## How It Works

1. Registers a service worker at `/worker.js`
2. Requests notification permission from the user
3. If granted, creates a push subscription
4. Sends the subscription to your specified endpoint
5. When push notifications are received, displays them to the user
6. Handles notification clicks by opening the specified URL

## Requirements

- Modern browser with Service Worker and Push API support
- VAPID keys for Web Push (can be generated using web-push libraries)
- Backend service to store subscriptions and send push messages
