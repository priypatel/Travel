import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api`,
  withCredentials: true,
});

export const apiFetchWishlist       = ()     => API.get('/wishlist');
export const apiAddToWishlist       = (id)   => API.post('/wishlist/add', { destinationId: id });
export const apiRemoveFromWishlist  = (id)   => API.delete(`/wishlist/${id}`);
