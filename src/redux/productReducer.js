import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
  name: "product",
  initialState: {
    allProduct: [],
    openSuccessProduct: false,
    openFailedProduct: { isOpen: false, message: "" },
    resetProduct: false,
  },
  reducers: {
    setAllProduct: (state, action) => {
      state.allProduct = action.payload;
    },
    setOpenSuccessProduct: (state, action) => {
      state.openSuccessProduct = action.payload;
    },
    setOpenFailedProduct: (state, action) => {
      state.openFailedProduct = action.payload;
    },
    setResetProduct: (state) => {
      state.resetProduct = !state.resetProduct;
    },
  },
});

export const { setAllProduct, setOpenFailedProduct, setOpenSuccessProduct, setResetProduct } = productSlice.actions;

export default productSlice.reducer;
