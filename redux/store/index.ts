import { configureStore } from '@reduxjs/toolkit';
import carbonIntensityReducer from '../carbonIntensitySlice';

const store = configureStore({
  reducer: {
    carbonIntensity: carbonIntensityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
