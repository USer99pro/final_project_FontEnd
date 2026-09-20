/**
 * security.js
 * Frontend security utilities: XSS prevention in script injection,
 * URL protocol sanitization, and sensitive data masking for safe logging.
 */

/**
 * Safely serializes data to JSON for embedding inside inline <script> tags
 * (such as application/ld+json for SEO). Escapes HTML-sensitive characters
 * to prevent breakout attacks like </script><script>alert(1)</script>.
 *
 * @param {*} data - The object to serialize
 * @returns {string} - Escaped JSON string safe for script tag insertion
 */
export function safeJsonLdStringify(data) {
  if (data === undefined || data === null) {
    return '{}';
  }
  const json = JSON.stringify(data);
  return json
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/**
 * Validates and sanitizes a URL before placing it into an href or src attribute.
 * Only allows http:, https:, mailto:, tel:, or relative paths (starting with / or #).
 * Blocks dangerous schemes such as javascript:, vbscript:, data:, etc.
 *
 * @param {string} url - The URL to validate
 * @param {string} [fallback='#'] - Fallback URL if invalid
 * @returns {string} - Safe URL
 */
export function sanitizeUrl(url, fallback = '#') {
  if (!url || typeof url !== 'string') {
    return fallback;
  }

  const trimmed = url.trim();

  // Reject protocol-relative URLs like //evil.com or /\\evil.com
  if (trimmed.startsWith('//') || trimmed.startsWith('/\\') || trimmed.startsWith('\\')) {
    return fallback;
  }

  // Allow relative URLs starting with /
  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  // Allow relative anchor links
  if (trimmed.startsWith('#')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed, 'https://placeholder.invalid');
    // If it's a relative URL resolved against placeholder, only allow safe pathname
    if (parsed.origin === 'https://placeholder.invalid') {
      if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
        return trimmed;
      }
      return fallback;
    }

    const protocol = parsed.protocol.toLowerCase();
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(protocol)) {
      return trimmed;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

const SENSITIVE_KEYS = new Set([
  'password',
  'confirmpassword',
  'token',
  'accesstoken',
  'refreshtoken',
  'authorization',
  'secret',
  'credential',
]);

/**
 * Recursively masks sensitive fields in an object or array for safe logging.
 *
 * @param {*} data - The object to mask
 * @returns {*} - A clone with sensitive values masked
 */
export function maskSensitiveData(data) {
  if (data === null || data === undefined) return data;
  if (typeof data !== 'object') return data;

  if (Array.isArray(data)) {
    return data.map(maskSensitiveData);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = maskSensitiveData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}
