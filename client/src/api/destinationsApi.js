import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api`,
  withCredentials: true,
});

export const fetchDestinations = async (month) => {
  const params = month ? { month } : {};
  const response = await API.get('/destinations', { params });
  return response.data; // { status, results, data }
};

export const fetchDestinationById = async (id) => {
  const response = await API.get(`/destinations/${id}`);
  return response.data; // { status, data }
};

export const fetchDestinationPlaces = async (id) => {
  const response = await API.get(`/destinations/${id}/places`);
  return response.data;
};

export const fetchDestinationRestaurants = async (id) => {
  const response = await API.get(`/destinations/${id}/restaurants`);
  return response.data;
};

export const fetchDestinationStays = async (id) => {
  const response = await API.get(`/destinations/${id}/stays`);
  return response.data;
};
