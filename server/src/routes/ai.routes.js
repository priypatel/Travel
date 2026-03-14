import { Router } from 'express';
import { recommend, getDestinationBySlug } from '../controllers/ai.controller.js';
import validate from '../middleware/validate.js';
import { aiRecommendSchema } from '../validators/ai.validator.js';

const router = Router();

router.post('/recommend', validate(aiRecommendSchema), recommend);
router.get('/destination/:slug', getDestinationBySlug);

export default router;
