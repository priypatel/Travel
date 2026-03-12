import Destination from '../models/Destination.model.js';
import Place from '../models/Place.model.js';
import Restaurant from '../models/Restaurant.model.js';
import PropertyStay from '../models/PropertyStay.model.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../middleware/asyncHandler.js';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Returns true if `searchMonth` falls within the range described by `bestTime`.
 * Handles:
 *   - Exact: "April"            → matches April
 *   - Range: "March to May"     → matches March, April, May
 *   - Wrap:  "November to January" → matches Nov, Dec, Jan
 */
function monthInRange(bestTime, searchMonth) {
  const searchIdx = MONTHS.findIndex(
    (m) => m.toLowerCase() === searchMonth.toLowerCase()
  );
  if (searchIdx === -1) return false;

  // Direct match (e.g. bestTime is exactly "April" or contains it standalone)
  const directMatch = new RegExp(`\\b${searchMonth}\\b`, 'i').test(bestTime);
  if (directMatch) return true;

  // Range match: "March to May" or "March - May"
  const rangeMatch = bestTime.match(/(\w+)\s+(?:to|-)\s+(\w+)/i);
  if (!rangeMatch) return false;

  const startIdx = MONTHS.findIndex(
    (m) => m.toLowerCase() === rangeMatch[1].toLowerCase()
  );
  const endIdx = MONTHS.findIndex(
    (m) => m.toLowerCase() === rangeMatch[2].toLowerCase()
  );
  if (startIdx === -1 || endIdx === -1) return false;

  if (startIdx <= endIdx) {
    // Normal range: March (2) to May (4) → April (3) is between
    return searchIdx >= startIdx && searchIdx <= endIdx;
  } else {
    // Wrap-around: November (10) to January (0)
    return searchIdx >= startIdx || searchIdx <= endIdx;
  }
}

// GET /api/destinations?month=June
export const getDestinations = asyncHandler(async (req, res) => {
  const { month } = req.query;

  const all = await Destination.find({}).select('-__v').sort({ createdAt: -1 });

  const destinations = month
    ? all.filter((d) => monthInRange(d.bestTime, month))
    : all;

  res.status(200).json({
    status: 'success',
    results: destinations.length,
    data: destinations,
  });
});

// GET /api/destinations/search?name=Santorini
export const searchDestinationByName = asyncHandler(async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(200).json({ status: 'success', data: null });
  }

  const destination = await Destination.findOne({
    name: { $regex: name.trim(), $options: 'i' },
  }).select('_id name country heroImage');

  res.status(200).json({ status: 'success', data: destination || null });
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
