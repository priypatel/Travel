import asyncHandler from '../middleware/asyncHandler.js';
import AppError from '../utils/AppError.js';
import { getRecommendation, getDestinationDetails } from '../services/gemini.service.js';

// POST /api/ai/recommend
export const recommend = asyncHandler(async (req, res) => {
  const { location, budget, days, travelStyle, interests } = req.body;

  let result;
  try {
    result = await getRecommendation({ location, budget, days, travelStyle, interests });
  } catch (err) {
    throw new AppError(err.message || 'AI recommendation failed. Please try again.', 502);
  }

  res.status(200).json({ status: 'success', data: result });
});

// POST /api/ai/destination-details
export const destinationDetails = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) throw new AppError('Destination name is required', 400);

  let result;
  try {
    result = await getDestinationDetails(name);
  } catch (err) {
    throw new AppError(err.message || 'Failed to generate destination details.', 502);
  }

  res.status(200).json({ status: 'success', data: result });
});
