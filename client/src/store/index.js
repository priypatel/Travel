import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import destinationReducer from './slices/destinationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    destinations: destinationReducer,
  },
});

export default store;
