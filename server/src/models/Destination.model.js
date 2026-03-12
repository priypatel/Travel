import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    bestTime: {
      type: String,
      required: [true, 'Best time to visit is required'],
      trim: true,
    },
    heroImage: {
      type: String,
      required: [true, 'Hero image URL is required'],
    },
    tags: {
      type: [String],
      default: [],
    },
    coordinates: {
      lat: { type: Number, required: [true, 'Latitude is required'] },
      lng: { type: Number, required: [true, 'Longitude is required'] },
    },
  },
  { timestamps: true }
);

// Index for month filtering (RegExp on bestTime)
destinationSchema.index({ bestTime: 1 });

const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
