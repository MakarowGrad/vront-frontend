/**
 * Centralized API client with automatic refresh on 401, and cookie credentials.
 * SECURITY-FIX-LS-001+AUTH-002: Removed manual cookie setting for access_token.
 * Access token is now managed via httpOnly Secure cookie set by the backend.
 * [2026-05-18]
 */

// Fallback for production domain when NEXT_PUBLIC_API_URL is stale in build cache
const PROD_API_URL = 'https://makarowgrad-vront-backend-53ee.twc1.net/api';

function resolveApiBase(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  // Ignore stale/invalid env URLs (amvera is deprecated, api subdomain may not resolve)
  if (envUrl && !envUrl.includes('amvera.io') && !envUrl.includes('api.vsvoeytarelke.ru')) {
    return envUrl;
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'vsvoeytarelke.ru' || window.location.hostname === 'www.vsvoeytarelke.ru') {
      return PROD_API_URL;
    }
    return `${window.location.protocol}//${window.location.hostname}:3001/api`;
  }
  return 'http://localhost:3001/api';
}

const API_BASE = resolveApiBase();

export { API_BASE };

let accessToken: string | null = null;
let refreshPromise: Promise<void> | null = null;

export const getApiBase = (): string => API_BASE;

// SECURITY-FIX-LS-001+AUTH-002: Do NOT store access token in JS-accessible storage.
// The backend sets an httpOnly Secure cookie instead. We keep a memory copy only
// for immediate Bearer-header use until the cookie round-trip happens.
export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const getAccessToken = (): string | null => {
  if (accessToken) {
    return accessToken;
  }
  return null;
};

export const clearAccessToken = (): void => {
  accessToken = null;
};

// Normalize HeadersInit to plain Record<string, string>
function normalizeHeaders(h: HeadersInit | undefined): Record<string, string> {
  if (!h) return {};
  if (h instanceof Headers) {
    const result: Record<string, string> = {};
    h.forEach((v, k) => { result[k] = v; });
    return result;
  }
  if (Array.isArray(h)) {
    return Object.fromEntries(h);
  }
  return { ...h };
}

async function doRefresh(): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/admin/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Refresh failed');
    }

    const data = await res.json();
    setAccessToken(data.token.accessToken);
  } catch {
    accessToken = null;
    throw new Error('Session expired');
  }
}

export async function refreshToken(): Promise<void> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = doRefresh().finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
}

export async function apiFetch(
  input: string,
  init?: RequestInit,
): Promise<Response> {
  const url = input.startsWith('http') ? input : `${API_BASE}${input}`;

  const makeRequest = (token: string | null): Promise<Response> => {
    const headers = normalizeHeaders(init?.headers);

    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Auto-set Content-Type for JSON bodies
    if (
      init?.body &&
      typeof init.body === 'string' &&
      !headers['Content-Type']
    ) {
      try {
        JSON.parse(init.body);
        headers['Content-Type'] = 'application/json';
      } catch {
        // not JSON, ignore
      }
    }

    return fetch(url, {
      ...init,
      credentials: 'include',
      headers,
    });
  };

  const token = getAccessToken();

  let res = await makeRequest(token);

  if (res.status === 401) {
    try {
      await refreshToken();
      const refreshedToken = getAccessToken();
      res = await makeRequest(refreshedToken);
    } catch {
      // refresh failed, keep 401 response
    }
  }

  // Admin 401 handling: redirect to login
  if (res.status === 401 && typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    clearAccessToken();
    window.location.href = '/admin/login';
  }

  return res;
}

