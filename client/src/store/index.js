import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import destinationReducer from './slices/destinationSlice';
import aiReducer from './slices/aiSlice';
import wishlistReducer from './slices/wishlistSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    destinations: destinationReducer,
    ai: aiReducer,
    wishlist: wishlistReducer,
  },
});

export default store;
