import axios from 'axios';

// withCredentials: true — browser automatically sends HttpOnly cookie on every request
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api`,
  withCredentials: true,
});

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
