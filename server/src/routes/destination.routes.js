import { Router } from 'express';
import {
  getDestinations,
  getDestinationById,
  getDestinationPlaces,
  getDestinationRestaurants,
  getDestinationStays,
  searchDestinationByName,
} from '../controllers/destination.controller.js';
import validate from '../middleware/validate.js';
import { destinationQuerySchema } from '../validators/destination.validator.js';

const router = Router();

router.get('/', validate(destinationQuerySchema, 'query'), getDestinations);
router.get('/search', searchDestinationByName); // must be before /:id
router.get('/:id', getDestinationById);
router.get('/:id/places', getDestinationPlaces);
router.get('/:id/restaurants', getDestinationRestaurants);
router.get('/:id/stays', getDestinationStays);

export default router;
