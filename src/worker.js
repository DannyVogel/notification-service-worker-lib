import logger from "./logger";

self.addEventListener("push", function (event) {
  const data = event.data?.json() || {};

  const handlePush = async () => {
    try {
      const options = {
        body: data.body,
        icon: "/pwa-192x192.png",
        badge: "/pwa-192x192.png",
        tag: "nap-notification",
        requireInteraction: true,
        silent: false,
        renotify: false,
        data: {
          url: data.url || "/",
        },
      };

      await self.registration.showNotification(
        data.title || "Notification",
        options
      );
    } catch (error) {
      logger.error("Service worker: Error displaying notification", {
        error: error.message,
        timestamp: Date.now(),
      });
    }
  };

  event.waitUntil(handlePush());
});

self.addEventListener("notificationclick", function (event) {
  const handleClick = async () => {
    try {
      event.notification.close();

      const url = event.notification.data?.url || "/";
      event.waitUntil(clients.openWindow(url));
    } catch (error) {
      logger.error("Service worker: Error handling notification click", {
        error: error.message,
        timestamp: Date.now(),
      });
    }
  };

  event.waitUntil(handleClick());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});
