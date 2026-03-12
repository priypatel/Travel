import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api`,
  withCredentials: true,
});

export const fetchAIRecommendation = async (payload) => {
  const response = await API.post('/ai/recommend', payload);
  return response.data; // { status, data: { recommendedDestination, reason } }
};

export const searchDestinationByName = async (name) => {
  const response = await API.get('/destinations/search', { params: { name } });
  return response.data; // { status, data: destination | null }
};

export const fetchAIDestinationDetails = async (name) => {
  const response = await API.post('/ai/destination-details', { name });
  return response.data; // { status, data: { description, coordinates, places, restaurants, stays } }
};
