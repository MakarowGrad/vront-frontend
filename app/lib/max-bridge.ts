/**
 * MAX Bridge integration for WebApp
 * Wraps window.WebApp from max-web-app.js
 */

declare global {
  interface Window {
    WebApp?: MaxWebApp;
  }
}

interface MaxWebApp {
  ready: () => void;
  expand: () => void;
  initData: string;
  initDataUnsafe: {
    query_id: string;
    ip?: string;
    auth_date: number;
    hash: string;
    user: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
    chat?: {
      id: number;
      type: 'DIALOG' | 'CHAT' | 'CHANNEL';
    };
    start_param?: string;
  };
  platform: string;
  version: string;
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
    isVisible: boolean;
  };
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  requestContact: () => Promise<{
    phone: string;
    authDate: string;
    hash: string;
  }>;
  openLink: (url: string) => void;
  openMaxLink: (url: string) => void;
  HapticFeedback: {
    impactOccurred: (style: string) => Promise<{ status: string }>;
    notificationOccurred: (type: string) => Promise<{ status: string }>;
  };
}

export const isMaxWebApp = (): boolean => {
  return typeof window !== 'undefined' && !!window.WebApp;
};

export const getWebApp = (): MaxWebApp | null => {
  if (typeof window === 'undefined') return null;
  return window.WebApp || null;
};

export const initMaxWebApp = (): void => {
  const webApp = getWebApp();
  if (webApp) {
    webApp.ready?.();
    webApp.expand?.();
  }
};

export const getMaxUser = () => {
  const webApp = getWebApp();
  return webApp?.initDataUnsafe?.user || null;
};

export const getMaxInitData = (): string | null => {
  const webApp = getWebApp();
  return webApp?.initData || null;
};

export const setupBackButton = (onClick: () => void): (() => void) => {
  const webApp = getWebApp();
  if (!webApp) return () => {};
  webApp.BackButton.show();
  webApp.BackButton.onClick(onClick);
  return () => {
    webApp.BackButton.offClick(onClick);
    webApp.BackButton.hide();
  };
};

export const requestContact = (): Promise<string | null> => {
  const webApp = getWebApp();
  if (!webApp?.requestContact) return Promise.resolve(null);
  return webApp
    .requestContact()
    .then(({ phone }) => phone)
    .catch(() => null);
};

export const hapticLight = (): void => {
  const webApp = getWebApp();
  if (webApp?.HapticFeedback) {
    webApp.HapticFeedback.impactOccurred('light').catch(() => {});
  }
};

export const hapticSuccess = (): void => {
  const webApp = getWebApp();
  if (webApp?.HapticFeedback) {
    webApp.HapticFeedback.notificationOccurred('success').catch(() => {});
  }
};
