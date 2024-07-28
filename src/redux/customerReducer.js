import { createSlice } from "@reduxjs/toolkit";

export const customerSlice = createSlice({
  name: "customer",
  initialState: {
    allCustomer: [],
    openSuccessCustomer: false,
    openFailedCustomer: { isOpen: false, message: "" },
    resetCustomer: false,
  },
  reducers: {
    setAllCustomer: (state, action) => {
      state.allCustomer = action.payload;
    },
    setOpenSuccessCustomer: (state, action) => {
      state.openSuccessCustomer = action.payload;
    },
    setOpenFailedCustomer: (state, action) => {
      state.openFailedCustomer = action.payload;
    },
    setResetCustomer: (state) => {
      state.resetCustomer = !state.resetCustomer;
    },
  },
});

export const { setAllCustomer, setOpenFailedCustomer, setOpenSuccessCustomer, setResetCustomer } = customerSlice.actions;

export default customerSlice.reducer;
