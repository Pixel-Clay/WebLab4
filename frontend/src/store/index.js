import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import pointsReducer from './slices/pointsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    points: pointsReducer,
  },
});

export default store;


