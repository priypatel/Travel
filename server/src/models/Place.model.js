import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema(
  {
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Destination ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Temple', 'Museum', 'Park', 'Beach', 'Market', 'Monument', 'Nature', 'Castle', 'Palace', 'Other'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
  },
  { timestamps: true }
);

const Place = mongoose.model('Place', placeSchema);
export default Place;
