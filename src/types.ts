export interface PushInitConfig {
  serviceWorkerPath?: string;
  onPermissionDenied?: () => void;
  onSuccess?: (subscription: PushSubscription) => void;
}

export interface PushNotificationPayload extends NotificationPayload {
  title: string;
}

export interface PushNotificationsAPI {
  subscribe: () => Promise<{
    success: boolean;
    error?: string;
    subscription?: PushSubscription;
  }>;
  trigger: (
    payload: PushNotificationPayload,
    deviceIds: string[]
  ) => Promise<{ success: boolean; error?: string }>;
}

export type NotificationDirection = "auto" | "ltr" | "rtl";

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface NotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  image?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  renotify?: boolean;
  actions?: NotificationAction[];
  timestamp?: number;
  vibrate?: number | number[];
  lang?: string;
  dir?: NotificationDirection;
  data?: any;
}

export interface NotificationPayload extends NotificationOptions {
  title: string;
}
