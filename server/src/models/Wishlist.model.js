import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate entries per user
wishlistSchema.index({ userId: 1, destinationId: 1 }, { unique: true });

export default mongoose.model('Wishlist', wishlistSchema);
