import { Router } from 'express';
import { recommend, destinationDetails } from '../controllers/ai.controller.js';
import validate from '../middleware/validate.js';
import { aiRecommendSchema } from '../validators/ai.validator.js';

const router = Router();

router.post('/recommend', validate(aiRecommendSchema), recommend);
router.post('/destination-details', destinationDetails);

export default router;
