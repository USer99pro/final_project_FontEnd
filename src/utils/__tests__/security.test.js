import { describe, it, expect } from 'vitest';
import { safeJsonLdStringify, sanitizeUrl, maskSensitiveData } from '../security';

describe('Security Utilities', () => {
  describe('safeJsonLdStringify', () => {
    it('serializes standard objects correctly', () => {
      const input = { title: 'AI Research', year: 2026 };
      const output = safeJsonLdStringify(input);
      expect(JSON.parse(output)).toEqual(input);
    });

    it('escapes dangerous HTML script tags to prevent XSS breakout', () => {
      const malicious = {
        title: '</script><script>alert("XSS")</script>',
        description: '<img src=x onerror=alert(1)>',
      };
      const serialized = safeJsonLdStringify(malicious);

      expect(serialized).not.toContain('</script>');
      expect(serialized).not.toContain('<script>');
      expect(serialized).toContain('\\u003c/script\\u003e');
      expect(serialized).toContain('\\u003cscript\\u003e');

      // Ensure that when parsed back as JSON it preserves original content
      expect(JSON.parse(serialized)).toEqual(malicious);
    });

    it('handles null and undefined gracefully', () => {
      expect(safeJsonLdStringify(null)).toBe('{}');
      expect(safeJsonLdStringify(undefined)).toBe('{}');
    });
  });

  describe('sanitizeUrl', () => {
    it('allows valid https URLs', () => {
      expect(sanitizeUrl('https://example.com/paper.pdf')).toBe('https://example.com/paper.pdf');
    });

    it('allows valid http URLs', () => {
      expect(sanitizeUrl('http://example.com/file')).toBe('http://example.com/file');
    });

    it('allows safe relative paths', () => {
      expect(sanitizeUrl('/api/public/projects/123/file')).toBe('/api/public/projects/123/file');
      expect(sanitizeUrl('#main-content')).toBe('#main-content');
    });

    it('blocks javascript: URLs', () => {
      expect(sanitizeUrl('javascript:alert(1)', '#')).toBe('#');
      expect(sanitizeUrl('JAVASCRIPT:alert(1)', '/safe')).toBe('/safe');
      expect(sanitizeUrl('  javascript:void(0)  ')).toBe('#');
    });

    it('blocks data: URLs', () => {
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('#');
    });

    it('blocks protocol-relative // URLs to external domains', () => {
      expect(sanitizeUrl('//evil.com/phishing')).toBe('#');
    });

    it('allows mailto: and tel: links', () => {
      expect(sanitizeUrl('mailto:user@example.com')).toBe('mailto:user@example.com');
      expect(sanitizeUrl('tel:+6612345678')).toBe('tel:+6612345678');
    });

    it('handles invalid or non-string inputs safely', () => {
      expect(sanitizeUrl(null)).toBe('#');
      expect(sanitizeUrl(undefined)).toBe('#');
      expect(sanitizeUrl('')).toBe('#');
    });
  });

  describe('maskSensitiveData', () => {
    it('redacts sensitive auth fields', () => {
      const payload = {
        email: 'test@example.com',
        password: 'superSecretPassword',
        token: 'jwt-access-token',
        refreshToken: 'refresh-token-xyz',
        headers: {
          authorization: 'Bearer jwt-token',
          accept: 'application/json',
        },
      };

      const masked = maskSensitiveData(payload);
      expect(masked.password).toBe('[REDACTED]');
      expect(masked.token).toBe('[REDACTED]');
      expect(masked.refreshToken).toBe('[REDACTED]');
      expect(masked.headers.authorization).toBe('[REDACTED]');
      expect(masked.email).toBe('test@example.com');
      expect(masked.headers.accept).toBe('application/json');
    });
  });
});
