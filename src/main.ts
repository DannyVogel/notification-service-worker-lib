export interface PushInitConfig {
  vapidPublicKey: string;
  subscribeUrl: string;
  onPermissionDenied?: () => void;
  onSuccess?: (subscription: PushSubscription) => void;
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function initPushNotifications(
  config: PushInitConfig
): Promise<void> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.warn("Push notifications are not supported in this browser.");
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register("/worker.js");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      config.onPermissionDenied?.();
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(config.vapidPublicKey),
    });

    await fetch(config.subscribeUrl, {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });

    config.onSuccess?.(subscription);
  } catch (err) {
    console.error("Push notification setup failed:", err);
  }
}
