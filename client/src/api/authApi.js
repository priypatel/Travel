import axios from 'axios';

// withCredentials: true — browser automatically sends HttpOnly cookies on every request
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api`,
  withCredentials: true,
});

// Response interceptor — silently refresh accessToken on 401, then retry original request
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Only attempt refresh on 401, once, and not for the refresh endpoint itself
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        // Queue requests that arrive while a refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => API(original))
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        await API.post('/auth/refresh'); // server sets new accessToken cookie
        processQueue(null);
        return API(original);           // retry the original request
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const registerUser = async (data) => {
  const response = await API.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await API.post('/auth/login', data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await API.post('/auth/logout');
  return response.data;
};

export const getMeUser = async () => {
  const response = await API.get('/auth/me');
  return response.data;
};
