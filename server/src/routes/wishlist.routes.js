import { Router } from 'express';
import protect from '../middleware/protect.js';
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  getWishlistIds,
} from '../controllers/wishlist.controller.js';

const router = Router();

router.use(protect); // all wishlist routes require auth

router.get('/',        getWishlist);
router.get('/ids',     getWishlistIds);
router.post('/add',    addToWishlist);
router.delete('/:id',  removeFromWishlist);

export default router;
