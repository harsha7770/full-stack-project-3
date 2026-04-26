const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const api = {
  login: `${BASE_URL}/login`,
  register: `${BASE_URL}/register`,
  users: `${BASE_URL}/users`,
  mentors: `${BASE_URL}/mentors`,
  mentees: `${BASE_URL}/mentees`,
  match: `${BASE_URL}/match`,
  sessions: `${BASE_URL}/sessions`,
  progress: `${BASE_URL}/progress`,
  forgotPassword: `${BASE_URL}/forgot-password`,
};

