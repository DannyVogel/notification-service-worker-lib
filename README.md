# webpushkit

A lightweight JavaScript library for setting up web push notifications in frontend web clients. This library simplifies the process of registering service workers and managing push notification subscriptions.

## Features

- Easy registration of service workers for push notifications
- Handling of push notification permissions
- Subscription management for web push
- Composable-style API for easy integration

## Installation

```bash
npm install webpushkit
```

After installation, run the setup command to initialize the service worker:

```bash
npx webpushkit init
```

This will copy the service worker file to your project's `public` directory by default.

## Usage

Import and initialize the push notification system in your application:

```javascript
import { usePushNotifications } from "webpushkit";

// Create the notification composable
const useNotifications = usePushNotifications({
  serviceWorkerPath: "/worker.js", // optional, defaults to "/worker.js"
  logger: false, // enable/disable logging
  onPermissionDenied: () => {
    console.log("Notification permission was denied");
  },
  onSuccess: (subscription) => {
    console.log("Successfully subscribed to push notifications", subscription);
  },
});

// Subscribe to push notifications
const subscribeResult = await useNotifications.subscribeToPushNotifications();
if (subscribeResult.success) {
  console.log("Subscription successful!", subscribeResult.subscription);
} else {
  console.error("Subscription failed:", subscribeResult.error);
}

// Trigger a push notification (for testing or local notifications)
const notifyResult = await useNotifications.triggerPushNotification({
  title: "Hello World!",
  body: "This is a test notification",
  icon: "/icon.png", // optional
  data: { url: "https://example.com" }, // optional
});

if (notifyResult.success) {
  console.log("Notification sent successfully!");
} else {
  console.error("Failed to send notification:", notifyResult.error);
}
```

## API Reference

### `usePushNotifications(config)`

Creates a push notification composable with subscription and notification methods.

#### Parameters

- `config` (Object): Configuration object with the following properties:
  - `serviceWorkerPath` (String, optional): Path to the service worker file, defaults to "/worker.js"
  - `logger` (Boolean, required): Enable or disable console logging
  - `onPermissionDenied` (Function, optional): Callback function triggered when notification permission is denied
  - `onSuccess` (Function, optional): Callback function triggered when subscription is successful, receives the subscription object as a parameter

#### Returns

An object with the following methods:

### `subscribeToPushNotifications()`

Registers the service worker, requests permission, and subscribes to push notifications.

**Returns**: `Promise<{ success: boolean; error?: string; subscription?: PushSubscription }>`

### `triggerPushNotification(payload)`

Triggers a push notification (useful for testing or client-side notifications).

#### Parameters

- `payload` (Object): Notification payload with the following properties:
  - `title` (String, required): The notification title
  - `body` (String, required): The notification body text
  - `icon` (String, optional): URL to an icon for the notification
  - `data` (Object, optional): Additional data to include with the notification

**Returns**: `Promise<{ success: boolean; error?: string }>`

## How It Works

1. Registers a service worker at the specified path (default: `/worker.js`)
2. Requests notification permission from the user
3. If granted, creates a push subscription using VAPID keys
4. Sends the subscription to the backend service for storage
5. Provides methods to trigger notifications programmatically
6. When push notifications are received, displays them to the user
7. Handles notification clicks by opening the specified URL

## Requirements

- Modern browser with Service Worker and Push API support
- Backend service to store subscriptions and send push messages (provided by webpushkit)
- HTTPS connection (required for service workers and push notifications)
