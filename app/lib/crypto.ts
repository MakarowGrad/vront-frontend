/**
 * Client-side encryption utilities for localStorage / IndexedDB PII
 * SECURITY-FIX-LS-002+IDB-001: Encrypt sensitive data before storing [2026-05-18]
 *
 * NOTE: On non-HTTPS origins (e.g. http://192.168.x.x) `crypto.subtle` is
 * unavailable. We fall back to a simple base64 obfuscation so the app still
 * works on local-network mobile testing. Real AES-GCM is used whenever possible.
 */

const STORAGE_KEY = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_STORAGE_KEY)
  || 'vtar-default-key-change-me-in-prod';

const FALLBACK_PREFIX = 'fb64:';

function hasSubtle(): boolean {
  return typeof crypto !== 'undefined' && !!crypto.subtle;
}

/** Simple base64 obfuscation used as a dev fallback when Web Crypto is unavailable */
function fallbackEncrypt(plaintext: string): string {
  try {
    const encoded = new TextEncoder().encode(plaintext);
    const mixed = encoded.map((b, i) => b ^ (STORAGE_KEY.charCodeAt(i % STORAGE_KEY.length) & 0xff));
    const bin = String.fromCharCode(...mixed);
    return FALLBACK_PREFIX + btoa(bin);
  } catch {
    return plaintext;
  }
}

function fallbackDecrypt(ciphertext: string): string | null {
  if (!ciphertext.startsWith(FALLBACK_PREFIX)) return ciphertext || null;
  try {
    const bin = atob(ciphertext.slice(FALLBACK_PREFIX.length));
    const mixed = Uint8Array.from(bin.split('').map((c) => c.charCodeAt(0)));
    const encoded = mixed.map((b, i) => b ^ (STORAGE_KEY.charCodeAt(i % STORAGE_KEY.length) & 0xff));
    return new TextDecoder().decode(encoded);
  } catch {
    return ciphertext || null;
  }
}

async function getAesKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(STORAGE_KEY.padEnd(32, '0').slice(0, 32));
  return crypto.subtle.importKey('raw', keyData, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

export async function encryptData(plaintext: string): Promise<string> {
  if (!plaintext) return '';

  if (!hasSubtle()) {
    return fallbackEncrypt(plaintext);
  }

  try {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await getAesKey();
    const encoded = new TextEncoder().encode(plaintext);
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
    return JSON.stringify({
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(ciphertext)),
    });
  } catch {
    // If AES fails for any reason, fall back to base64 so the app keeps working
    return fallbackEncrypt(plaintext);
  }
}

export async function decryptData(ciphertext: string): Promise<string | null> {
  if (!ciphertext) return null;

  // Legacy / fallback plain text
  if (!ciphertext.startsWith('{') && !ciphertext.startsWith(FALLBACK_PREFIX)) {
    return ciphertext;
  }

  // Fallback base64
  if (ciphertext.startsWith(FALLBACK_PREFIX)) {
    return fallbackDecrypt(ciphertext);
  }

  // AES-GCM
  if (!hasSubtle()) {
    // Subtle crypto not available and this is an AES payload — return raw as best effort
    return ciphertext;
  }

  try {
    const { iv, data } = JSON.parse(ciphertext);
    if (!iv || !data) return ciphertext;
    const key = await getAesKey();
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      key,
      new Uint8Array(data),
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    // Backward compat for unencrypted legacy data
    return ciphertext || null;
  }
}
