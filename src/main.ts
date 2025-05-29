export interface PushInitConfig {
  vapidPublicKey: string;
  subscribeUrl: string;
  sendNotificationUrl?: string;
  serviceWorkerPath?: string;
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

export function isPushNotificationSupported(): boolean {
  return "serviceWorker" in navigator && "PushManager" in window;
}

export async function initPushNotifications(config: PushInitConfig): Promise<{
  success: boolean;
  error?: string;
  subscription?: PushSubscription;
}> {
  if (!isPushNotificationSupported()) {
    return {
      success: false,
      error: "Push notifications are not supported in this browser",
    };
  }

  try {
    const workerPath = config.serviceWorkerPath || "/worker.js";
    const registration = await navigator.serviceWorker.register(workerPath);

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      config.onPermissionDenied?.();
      return {
        success: false,
        error: "Push notification permission denied",
      };
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(config.vapidPublicKey),
    });

    const response = await fetch(config.subscribeUrl, {
      method: "POST",
      body: JSON.stringify(subscription),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to register subscription: HTTP ${response.status}: ${response.statusText}`,
      };
    }

    config.onSuccess?.(subscription);

    return {
      success: true,
      subscription,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Unknown error during push notification setup",
    };
  }
}

export async function triggerPushNotification(
  config: PushInitConfig,
  notification: {
    title: string;
    body: string;
    icon?: string;
    data?: Record<string, any>;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration)
      return { success: false, error: "Service worker not found" };

    const subscription = await registration.pushManager.getSubscription();
    if (!subscription)
      return { success: false, error: "Push subscription not found" };

    if (!config.sendNotificationUrl)
      return { success: false, error: "Send URL not found" };

    const response = await fetch(config.sendNotificationUrl, {
      method: "POST",
      body: JSON.stringify({
        subscription,
        notification,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
