import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookingState {
  bookings: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    setBookings: (state, action: PayloadAction<any[]>) => {
      state.bookings = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setBookings, setLoading, setError } = bookingSlice.actions;
export default bookingSlice.reducer;
