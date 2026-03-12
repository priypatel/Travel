import Destination from '../models/Destination.model.js';
import Place from '../models/Place.model.js';
import Restaurant from '../models/Restaurant.model.js';
import PropertyStay from '../models/PropertyStay.model.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../middleware/asyncHandler.js';

// GET /api/destinations?month=June
export const getDestinations = asyncHandler(async (req, res) => {
  const { month } = req.query;

  const filter = month
    ? { bestTime: { $regex: month, $options: 'i' } }
    : {};

  const destinations = await Destination.find(filter).select('-__v').sort({ createdAt: -1 });

  res.status(200).json({
    status: 'success',
    results: destinations.length,
    data: destinations,
  });
});

// GET /api/destinations/:id
export const getDestinationById = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id).select('-__v');

  if (!destination) throw new AppError('Destination not found', 404);

  res.status(200).json({
    status: 'success',
    data: destination,
  });
});

// GET /api/destinations/:id/places
export const getDestinationPlaces = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) throw new AppError('Destination not found', 404);

  const places = await Place.find({ destinationId: req.params.id }).select('-__v');

  res.status(200).json({
    status: 'success',
    results: places.length,
    data: places,
  });
});

// GET /api/destinations/:id/restaurants
export const getDestinationRestaurants = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) throw new AppError('Destination not found', 404);

  const restaurants = await Restaurant.find({ destinationId: req.params.id })
    .select('-__v')
    .sort({ rating: -1 });

  res.status(200).json({
    status: 'success',
    results: restaurants.length,
    data: restaurants,
  });
});

// GET /api/destinations/:id/stays
export const getDestinationStays = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) throw new AppError('Destination not found', 404);

  const stays = await PropertyStay.find({ destinationId: req.params.id })
    .select('-__v')
    .sort({ rating: -1 });

  res.status(200).json({
    status: 'success',
    results: stays.length,
    data: stays,
  });
});
