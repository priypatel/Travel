import mongoose from 'mongoose';

// Embedded schemas for AI-generated travel plans
const travelPlanPlaceRestaurantSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  cuisine:    { type: String, trim: true },
  priceLevel: { type: String, enum: ['budget', 'mid-range', 'luxury'] },
  rating:     { type: Number, min: 1, max: 5 },
}, { _id: false });

const travelPlanPlaceStaySchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  type:       { type: String, trim: true },
  priceLevel: { type: String, enum: ['budget', 'mid-range', 'luxury'] },
  rating:     { type: Number, min: 1, max: 5 },
  priceRange: { type: String, trim: true },
}, { _id: false });

const travelPlanPlaceSchema = new mongoose.Schema({
  dayIndex:    { type: Number, required: true },
  name:        { type: String, required: true, trim: true },
  category:    { type: String, trim: true },
  description: { type: String, trim: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
  restaurants: [travelPlanPlaceRestaurantSchema],
  stays:       [travelPlanPlaceStaySchema],
}, { _id: false });

const travelPlanSchema = new mongoose.Schema({
  title:  { type: String, required: true, trim: true },
  places: [travelPlanPlaceSchema],
}, { _id: false });

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
    },
    country: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    bestTime: {
      type: String,
      trim: true,
      default: '',
    },
    heroImage: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    // AI-generated destination fields
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
    },
    aiGenerated: {
      type: Boolean,
      default: false,
    },
    travelPlans: [travelPlanSchema],
  },
  { timestamps: true }
);

destinationSchema.index({ bestTime: 1 });

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
