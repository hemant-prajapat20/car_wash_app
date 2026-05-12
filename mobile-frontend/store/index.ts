import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@shared/store/authSlice';
import bookingReducer from './bookingSlice';
import vendorReducer from './vendorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingReducer,
    vendors: vendorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
