const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  login: `${API_BASE_URL}/login`,
  register: `${API_BASE_URL}/register`,
  users: `${API_BASE_URL}/users`,
  mentors: `${API_BASE_URL}/mentors`,
  sessions: `${API_BASE_URL}/sessions`,
  match: `${API_BASE_URL}/match`,
  progress: `${API_BASE_URL}/progress`,
};

export default API_BASE_URL;
