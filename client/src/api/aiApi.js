import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api`,
  withCredentials: true,
});

export const fetchAIRecommendation = async (payload) => {
  const response = await API.post('/ai/recommend', payload);
  return response.data; // { status, data: { destinations, source } }
};

export const fetchAIDestinationBySlug = async (slug, params = {}) => {
  const response = await API.get(`/ai/destination/${slug}`, { params });
  return response.data; // { status, data: { destination, plans, source } }
};
