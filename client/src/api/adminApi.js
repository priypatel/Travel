import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/admin`,
  withCredentials: true,
});

// Destinations
export const apiListDestinations   = ()           => API.get('/destinations');
export const apiCreateDestination  = (data)       => API.post('/destinations', data);
export const apiUpdateDestination  = (id, data)   => API.put(`/destinations/${id}`, data);
export const apiDeleteDestination  = (id)         => API.delete(`/destinations/${id}`);

// Places
export const apiListPlaces   = (destId)                    => API.get(`/destinations/${destId}/places`);
export const apiCreatePlace  = (destId, data)              => API.post(`/destinations/${destId}/places`, data);
export const apiUpdatePlace  = (destId, placeId, data)     => API.put(`/destinations/${destId}/places/${placeId}`, data);
export const apiDeletePlace  = (destId, placeId)           => API.delete(`/destinations/${destId}/places/${placeId}`);

// Restaurants
export const apiListRestaurants   = (destId)                  => API.get(`/destinations/${destId}/restaurants`);
export const apiCreateRestaurant  = (destId, data)            => API.post(`/destinations/${destId}/restaurants`, data);
export const apiUpdateRestaurant  = (destId, restId, data)    => API.put(`/destinations/${destId}/restaurants/${restId}`, data);
export const apiDeleteRestaurant  = (destId, restId)          => API.delete(`/destinations/${destId}/restaurants/${restId}`);

// Stays
export const apiListStays   = (destId)                  => API.get(`/destinations/${destId}/stays`);
export const apiCreateStay  = (destId, data)            => API.post(`/destinations/${destId}/stays`, data);
export const apiUpdateStay  = (destId, stayId, data)    => API.put(`/destinations/${destId}/stays/${stayId}`, data);
export const apiDeleteStay  = (destId, stayId)          => API.delete(`/destinations/${destId}/stays/${stayId}`);
