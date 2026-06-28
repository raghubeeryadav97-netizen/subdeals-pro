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