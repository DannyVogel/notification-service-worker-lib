export interface PushInitConfig {
  serviceWorkerPath?: string;
  onPermissionDenied?: () => void;
  onSuccess?: (subscription: PushSubscription) => void;
  logger: boolean;
}

export function usePushNotifications(options: PushInitConfig) {
  const vapidPublicKey =
    "BGJZlj6wOKENtIi6pd1jLR_WWBSaOHL6N3Mk0hDbd8P3WXPEi7UHH16bkMsddxAMR1TQmovggzU82rpSkzxBsIc";
  const baseURL = "https://push-service-8l4z.onrender.com";
  const subscribeEndpoint = `${baseURL}/api/subscribe`;
  const notifyEndpoint = `${baseURL}/api/notify`;

  function isPushNotificationSupported(): boolean {
    return "serviceWorker" in navigator && "PushManager" in window;
  }

  async function requestPermission(): Promise<boolean> {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      options.onPermissionDenied?.();
      return false;
    }
    return true;
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async function subscribe(): Promise<{
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
      const workerPath = options.serviceWorkerPath || "/worker.js";
      const registration = await navigator.serviceWorker.register(workerPath);

      const permission = await requestPermission();
      if (!permission) {
        return {
          success: false,
          error: "Push notification permission denied",
        };
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      const response = await fetch(subscribeEndpoint, {
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

      options.onSuccess?.(subscription);

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

  async function trigger(payload: {
    title: string;
    body: string;
    icon?: string;
    data?: Record<string, any>;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration)
        return { success: false, error: "Service worker not found" };

      const subscription = await registration.pushManager.getSubscription();
      if (!subscription)
        return { success: false, error: "Push subscription not found" };

      const response = await fetch(notifyEndpoint, {
        method: "POST",
        body: JSON.stringify({
          subscription,
          payload,
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

  return {
    subscribe,
    trigger,
  };
}
