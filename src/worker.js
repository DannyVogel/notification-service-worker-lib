self.addEventListener("push", function (event) {
  const data = event.data?.json() || {};

  const options = {
    body: data.body,
    icon: "/icon.png",
    data: data.url || "/",
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Notification", options)
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  if (event.notification.data) {
    event.waitUntil(clients.openWindow(event.notification.data));
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
