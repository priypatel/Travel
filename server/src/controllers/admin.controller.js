import Destination from '../models/Destination.model.js';
import Place from '../models/Place.model.js';
import Restaurant from '../models/Restaurant.model.js';
import PropertyStay from '../models/PropertyStay.model.js';
import asyncHandler from '../middleware/asyncHandler.js';
import AppError from '../utils/AppError.js';

// ── Destinations ────────────────────────────────────────────────────────────

export const listDestinations = asyncHandler(async (_req, res) => {
  const destinations = await Destination.find({ aiGenerated: { $ne: true } })
    .select('name country tags heroImage createdAt')
    .sort({ createdAt: -1 });
  res.json({ data: destinations });
});

export const createDestination = asyncHandler(async (req, res) => {
  const { name, country, description, bestTime, heroImage, tags, lat, lng } = req.body;
  if (!name) throw new AppError('Name is required', 400);

  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const destination = await Destination.create({
    name,
    country,
    description,
    bestTime,
    heroImage,
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : []),
    coordinates: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : undefined,
    slug,
    aiGenerated: false,
  });
  res.status(201).json({ data: destination });
});

export const updateDestination = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, country, description, bestTime, heroImage, tags, lat, lng } = req.body;

  const update = {
    ...(name        && { name }),
    ...(country     !== undefined && { country }),
    ...(description !== undefined && { description }),
    ...(bestTime    !== undefined && { bestTime }),
    ...(heroImage   !== undefined && { heroImage }),
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()).filter(Boolean) : undefined),
    ...(lat && lng ? { coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) } } : {}),
  };
  if (update.tags === undefined) delete update.tags;

  const dest = await Destination.findByIdAndUpdate(id, update, { new: true });
  if (!dest) throw new AppError('Destination not found', 404);
  res.json({ data: dest });
});

export const deleteDestination = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const dest = await Destination.findByIdAndDelete(id);
  if (!dest) throw new AppError('Destination not found', 404);
  // Clean up related documents
  await Promise.all([
    Place.deleteMany({ destinationId: id }),
    Restaurant.deleteMany({ destinationId: id }),
    PropertyStay.deleteMany({ destinationId: id }),
  ]);
  res.json({ message: 'Deleted successfully' });
});

// ── Places ───────────────────────────────────────────────────────────────────

export const createPlace = asyncHandler(async (req, res) => {
  const { id: destinationId } = req.params;
  const { name, description, category, image, lat, lng, dayIndex } = req.body;

  const place = await Place.create({
    destinationId,
    name,
    description,
    category,
    image,
    coordinates: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : undefined,
    dayIndex: dayIndex ? parseInt(dayIndex) : undefined,
  });
  res.status(201).json({ data: place });
});

export const listPlaces = asyncHandler(async (req, res) => {
  const places = await Place.find({ destinationId: req.params.id }).sort({ dayIndex: 1, createdAt: 1 });
  res.json({ data: places });
});

export const updatePlace = asyncHandler(async (req, res) => {
  const { name, description, category, image, lat, lng, dayIndex } = req.body;
  const update = {
    ...(name        && { name }),
    ...(description !== undefined && { description }),
    ...(category    && { category }),
    ...(image       !== undefined && { image }),
    ...(dayIndex !== undefined && dayIndex !== '' && { dayIndex: parseInt(dayIndex) }),
    ...(lat && lng ? { coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) } } : {}),
  };
  const place = await Place.findByIdAndUpdate(req.params.placeId, update, { new: true });
  if (!place) throw new AppError('Place not found', 404);
  res.json({ data: place });
});

export const deletePlace = asyncHandler(async (req, res) => {
  await Place.findByIdAndDelete(req.params.placeId);
  res.json({ message: 'Deleted' });
});

// ── Restaurants ──────────────────────────────────────────────────────────────

export const createRestaurant = asyncHandler(async (req, res) => {
  const { id: destinationId } = req.params;
  const { name, cuisine, priceLevel, rating } = req.body;

  const restaurant = await Restaurant.create({
    destinationId,
    name,
    cuisine,
    priceLevel,
    rating: parseFloat(rating),
  });
  res.status(201).json({ data: restaurant });
});

export const listRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({ destinationId: req.params.id }).sort({ createdAt: 1 });
  res.json({ data: restaurants });
});

export const updateRestaurant = asyncHandler(async (req, res) => {
  const { name, cuisine, priceLevel, rating } = req.body;
  const update = {
    ...(name       && { name }),
    ...(cuisine    && { cuisine }),
    ...(priceLevel && { priceLevel }),
    ...(rating     && { rating: parseFloat(rating) }),
  };
  const r = await Restaurant.findByIdAndUpdate(req.params.restaurantId, update, { new: true });
  if (!r) throw new AppError('Restaurant not found', 404);
  res.json({ data: r });
});

export const deleteRestaurant = asyncHandler(async (req, res) => {
  await Restaurant.findByIdAndDelete(req.params.restaurantId);
  res.json({ message: 'Deleted' });
});

// ── Stays ────────────────────────────────────────────────────────────────────

export const createStay = asyncHandler(async (req, res) => {
  const { id: destinationId } = req.params;
  const { name, priceRange, priceLevel, rating, location } = req.body;

  const stay = await PropertyStay.create({
    destinationId,
    name,
    priceRange,
    priceLevel,
    rating: parseFloat(rating),
    location,
  });
  res.status(201).json({ data: stay });
});

export const listStays = asyncHandler(async (req, res) => {
  const stays = await PropertyStay.find({ destinationId: req.params.id }).sort({ createdAt: 1 });
  res.json({ data: stays });
});

export const updateStay = asyncHandler(async (req, res) => {
  const { name, priceRange, priceLevel, rating, location } = req.body;
  const update = {
    ...(name       && { name }),
    ...(priceRange !== undefined && { priceRange }),
    ...(priceLevel && { priceLevel }),
    ...(rating     && { rating: parseFloat(rating) }),
    ...(location   && { location }),
  };
  const s = await PropertyStay.findByIdAndUpdate(req.params.stayId, update, { new: true });
  if (!s) throw new AppError('Stay not found', 404);
  res.json({ data: s });
});

export const deleteStay = asyncHandler(async (req, res) => {
  await PropertyStay.findByIdAndDelete(req.params.stayId);
  res.json({ message: 'Deleted' });
});
