import asyncHandler from '../middleware/asyncHandler.js';
import AppError from '../utils/AppError.js';
import Wishlist from '../models/Wishlist.model.js';
import Destination from '../models/Destination.model.js';

// POST /api/wishlist/add
export const addToWishlist = asyncHandler(async (req, res) => {
  const { destinationId } = req.body;
  if (!destinationId) throw new AppError('destinationId is required', 400);

  const dest = await Destination.findById(destinationId);
  if (!dest) throw new AppError('Destination not found', 404);

  const existing = await Wishlist.findOne({ userId: req.user._id, destinationId });
  if (existing) throw new AppError('Already in wishlist', 409);

  const item = await Wishlist.create({ userId: req.user._id, destinationId });
  res.status(201).json({ status: 'success', data: item });
});

// GET /api/wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const items = await Wishlist.find({ userId: req.user._id })
    .populate('destinationId')
    .sort({ createdAt: -1 });

  const destinations = items
    .filter((i) => i.destinationId) // skip if destination was deleted
    .map((i) => ({ wishlistId: i._id, ...i.destinationId.toObject() }));

  res.status(200).json({ status: 'success', data: destinations });
});

// DELETE /api/wishlist/:id  (id = destinationId)
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const item = await Wishlist.findOneAndDelete({
    userId: req.user._id,
    destinationId: req.params.id,
  });
  if (!item) throw new AppError('Wishlist item not found', 404);
  res.status(200).json({ status: 'success', message: 'Removed from wishlist' });
});

// GET /api/wishlist/ids  — just the destinationIds for the logged-in user (for heart state)
export const getWishlistIds = asyncHandler(async (req, res) => {
  const items = await Wishlist.find({ userId: req.user._id }).select('destinationId');
  res.status(200).json({ status: 'success', data: items.map((i) => String(i.destinationId)) });
});
