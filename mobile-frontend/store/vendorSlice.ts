import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VendorState {
  vendors: any[];
  loading: boolean;
}

const initialState: VendorState = {
  vendors: [],
  loading: false,
};

const vendorSlice = createSlice({
  name: 'vendors',
  initialState,
  reducers: {
    setVendors: (state, action: PayloadAction<any[]>) => {
      state.vendors = action.payload;
    },
  },
});

export const { setVendors } = vendorSlice.actions;
export default vendorSlice.reducer;
