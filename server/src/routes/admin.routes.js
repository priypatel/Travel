import { Router } from 'express';
import protect from '../middleware/protect.js';
import adminOnly from '../middleware/adminOnly.js';
import {
  listDestinations, createDestination, updateDestination, deleteDestination,
  createPlace, listPlaces, updatePlace, deletePlace,
  createRestaurant, listRestaurants, updateRestaurant, deleteRestaurant,
  createStay, listStays, updateStay, deleteStay,
} from '../controllers/admin.controller.js';

const router = Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// Destinations
router.get('/destinations',         listDestinations);
router.post('/destinations',        createDestination);
router.put('/destinations/:id',     updateDestination);
router.delete('/destinations/:id',  deleteDestination);

// Places
router.get('/destinations/:id/places',                listPlaces);
router.post('/destinations/:id/places',               createPlace);
router.put('/destinations/:id/places/:placeId',       updatePlace);
router.delete('/destinations/:id/places/:placeId',    deletePlace);

// Restaurants
router.get('/destinations/:id/restaurants',                          listRestaurants);
router.post('/destinations/:id/restaurants',                         createRestaurant);
router.put('/destinations/:id/restaurants/:restaurantId',            updateRestaurant);
router.delete('/destinations/:id/restaurants/:restaurantId',         deleteRestaurant);

// Stays
router.get('/destinations/:id/stays',               listStays);
router.post('/destinations/:id/stays',              createStay);
router.put('/destinations/:id/stays/:stayId',       updateStay);
router.delete('/destinations/:id/stays/:stayId',    deleteStay);

export default router;
