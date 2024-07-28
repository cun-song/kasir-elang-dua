import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartData: {},
    bonusData: [{ productID: null, label: null, qty: null }],
    diskon: { besar: 0, kecil: 0 },
  },
  reducers: {
    setCartData: (state, action) => {
      state.cartData = action.payload;
    },
    setBonusData: (state, action) => {
      state.bonusData = action.payload;
    },
    setDiskon: (state, action) => {
      state.diskon = action.payload;
    },
  },
});

export const { setCartData, setBonusData, setDiskon } = cartSlice.actions;

export default cartSlice.reducer;
