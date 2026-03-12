import { Router } from 'express';
import {
  getDestinations,
  getDestinationById,
  getDestinationPlaces,
  getDestinationRestaurants,
  getDestinationStays,
} from '../controllers/destination.controller.js';
import validate from '../middleware/validate.js';
import { destinationQuerySchema } from '../validators/destination.validator.js';

const router = Router();

// router.get('/', validate(destinationQuerySchema, 'query'), getDestinations);
router.get('/', getDestinations);
router.get('/:id', getDestinationById);
router.get('/:id/places', getDestinationPlaces);
router.get('/:id/restaurants', getDestinationRestaurants);
router.get('/:id/stays', getDestinationStays);

export default router;
