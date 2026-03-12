import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import destinationReducer from './slices/destinationSlice';
import aiReducer from './slices/aiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    destinations: destinationReducer,
    ai: aiReducer,
  },
});

export default store;
