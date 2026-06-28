export const ADMIN_ROLES = ['admin', 'manager', 'staff'];

export const DEMO_ADMIN = {
  email: 'admin@subdealspro.com',
  password: 'Admin@123',
  user: {
    _id: 'demo-admin',
    name: 'Admin',
    email: 'admin@subdealspro.com',
    role: 'admin',
  },
};

export const DEMO_TOKEN = 'demo-admin-token';

export function isAdminRole(role) {
  return ADMIN_ROLES.includes(role);
}

export function isDemoSession() {
  return localStorage.getItem('token') === DEMO_TOKEN && localStorage.getItem('demoUser') === '1';
}

export function setDemoSession() {
  localStorage.setItem('token', DEMO_TOKEN);
  localStorage.setItem('demoUser', '1');
}

export function clearDemoSession() {
  localStorage.removeItem('demoUser');
}

export function getPostLoginPath(role) {
  return isAdminRole(role) ? '/admin' : '/dashboard';
}

export function normalizeCredentials(credentials = {}) {
  return {
    email: credentials.email?.trim().toLowerCase() || '',
    password: credentials.password?.trim() || '',
  };
}

export function isDemoCredentials(credentials) {
  const { email, password } = normalizeCredentials(credentials);
  return (
    email === DEMO_ADMIN.email &&
    (password === DEMO_ADMIN.password || password.toLowerCase() === DEMO_ADMIN.password.toLowerCase())
  );
}

export function isOfflineApiMode() {
  const apiUrl = import.meta.env.VITE_API_URL || '/api';
  const noRemoteApi = !apiUrl.startsWith('http');
  const onFirebaseHost =
    typeof window !== 'undefined' &&
    (window.location.hostname.includes('web.app') ||
      window.location.hostname.includes('firebaseapp.com'));

  return noRemoteApi || onFirebaseHost;
}

export function isInvalidAuthPayload(data) {
  return !data || typeof data !== 'object' || !data.token || !data.user;
}