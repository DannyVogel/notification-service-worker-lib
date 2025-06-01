function logError(message, metadata) {
  console.error(
    `webpushkit log: [${new Date().toLocaleString()}] ${message}`,
    metadata
  );
}

self.addEventListener("push", function (event) {
  const data = event.data?.json() || {};

  const handlePush = async () => {
    try {
      const options = {
        body: data.body || "You have a new notification",
        icon: data.icon ?? undefined,
        badge: data.badge ?? undefined,
        tag: data.tag ?? undefined,
        requireInteraction: data.requireInteraction ?? false,
        silent: data.silent ?? false,
        renotify: data.renotify ?? false,
        image: data.image ?? undefined,
        timestamp: data.timestamp ?? undefined,
        actions: data.actions ?? undefined,
        vibrate: data.vibrate ?? undefined,
        lang: data.lang ?? undefined,
        dir: data.dir ?? undefined,
        data,
      };

      await self.registration.showNotification(
        data.title || "Notification",
        options
      );
    } catch (error) {
      logError("Service worker: Error displaying notification", {
        error: error.message,
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
      logError("Service worker: Error handling notification click", {
        error: error.message,
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
