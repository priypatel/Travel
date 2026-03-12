import mongoose from 'mongoose';

const propertyStaySchema = new mongoose.Schema(
  {
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Destination ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Property name is required'],
      trim: true,
    },
    priceRange: {
      type: String,
      required: [true, 'Price range is required'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

const PropertyStay = mongoose.model('PropertyStay', propertyStaySchema);
export default PropertyStay;
