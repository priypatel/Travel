import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api`,
});

// Request interceptor — attach JWT token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async (data) => {
  const response = await API.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await API.post('/auth/login', data);
  return response.data;
};
