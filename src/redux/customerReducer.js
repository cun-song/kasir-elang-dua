import { createSlice } from "@reduxjs/toolkit";

export const customerSlice = createSlice({
  name: "customer",
  initialState: {
    allCustomer: [],
    openSuccessCustomer: false,
    openFailedCustomer: { isOpen: false, message: "" },
    resetCustomer: false,
    transactionCustomer: { customerID: "", ownerName: "", merchantName: "" },
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
    setTransactionCustomer: (state, action) => {
      state.transactionCustomer = action.payload;
    },
  },
});

export const { setAllCustomer, setOpenFailedCustomer, setOpenSuccessCustomer, setResetCustomer, setTransactionCustomer } = customerSlice.actions;

export default customerSlice.reducer;
