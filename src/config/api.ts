const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

export default apiConfig;
