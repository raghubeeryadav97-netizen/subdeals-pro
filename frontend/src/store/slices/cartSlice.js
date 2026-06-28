import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { plan: null, duration: null, pricing: null },
  reducers: {
    setPurchase: (state, action) => {
      state.plan = action.payload.plan;
      state.duration = action.payload.duration;
      state.pricing = action.payload.pricing;
    },
    clearPurchase: (state) => {
      state.plan = null;
      state.duration = null;
      state.pricing = null;
    },
  },
});

export const { setPurchase, clearPurchase } = cartSlice.actions;
export default cartSlice.reducer;