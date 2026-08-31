/**
 * analytics.js
 * Utility functions for visitor/session identification and device detection.
 * Used by analyticsService and tracking hooks.
 */

const VISITOR_KEY = 'analytics_visitor_id';
const SESSION_KEY = 'analytics_session_id';

/**
 * Get or create an anonymous visitor ID (persists across sessions via localStorage).
 */
export function getVisitorId() {
  try {
    let visitorId = localStorage.getItem(VISITOR_KEY);
    if (!visitorId) {
      visitorId = `visitor_${crypto.randomUUID()}`;
      localStorage.setItem(VISITOR_KEY, visitorId);
    }
    return visitorId;
  } catch {
    // localStorage unavailable (e.g. private mode, SSR)
    return null;
  }
}

/**
 * Get or create a session ID (resets when browser tab/window is closed via sessionStorage).
 */
export function getSessionId() {
  try {
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId = `session_${crypto.randomUUID()}`;
      sessionStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return null;
  }
}

/**
 * Detect device type, browser, and OS from userAgent.
 * Returns safe, non-sensitive metadata for analytics.
 */
export function getDeviceInfo() {
  try {
    const ua = navigator.userAgent || '';

    // Device
    let device = 'Desktop';
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
      device = 'Tablet';
    } else if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
      device = 'Mobile';
    }

    // Browser
    let browser = 'Unknown';
    if (/edg\//i.test(ua)) browser = 'Edge';
    else if (/chrome/i.test(ua) && !/chromium/i.test(ua)) browser = 'Chrome';
    else if (/firefox/i.test(ua)) browser = 'Firefox';
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
    else if (/opr\//i.test(ua)) browser = 'Opera';

    // OS
    let os = 'Unknown';
    if (/windows/i.test(ua)) os = 'Windows';
    else if (/android/i.test(ua)) os = 'Android';
    else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
    else if (/mac os/i.test(ua)) os = 'macOS';
    else if (/linux/i.test(ua)) os = 'Linux';

    return { device, browser, os };
  } catch {
    return { device: 'Unknown', browser: 'Unknown', os: 'Unknown' };
  }
}
