/**
 * Generates or retrieves a persistent device ID using cookies
 * @param cookieName - Optional custom cookie name (defaults to "webpushkit_deviceId")
 * @returns A UUID string representing the device ID
 */
export function getOrCreateDeviceId(
  cookieName: string = "webpushkit_deviceId"
): string {
  try {
    const match = document.cookie.match(
      new RegExp("(^| )" + cookieName + "=([^;]+)")
    );
    if (match && match[2]) return match[2];

    const uuid = generateUUID();

    document.cookie = `${cookieName}=${uuid}; path=/; max-age=31536000; SameSite=Lax`;

    return uuid;
  } catch (error) {
    console.warn(
      "Failed to get/set deviceId cookie, using session-only UUID:",
      error
    );
    return generateUUID();
  }
}

/**
 * Generates a UUID v4 string
 * Uses crypto.randomUUID() if available, otherwise falls back to a polyfill
 */
function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (c: string) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
}
