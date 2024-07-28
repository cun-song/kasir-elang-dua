import { createSlice } from "@reduxjs/toolkit";

export const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    transactionData: {},
    openSuccess: false,
    openFailed: { isOpen: false, message: "" },
    transactionHistory: [],
    reset: false,
  },
  reducers: {
    setTransactionData: (state, action) => {
      state.transactionData = action.payload;
    },
    setOpenSuccess: (state, action) => {
      state.openSuccess = action.payload;
    },
    setOpenFailed: (state, action) => {
      state.openFailed = action.payload;
    },
    setTransactionHistory: (state, action) => {
      state.transactionHistory = action.payload;
    },
    setReset: (state) => {
      state.reset = !state.reset;
    },
  },
});

export const { setTransactionData, setOpenFailed, setOpenSuccess, setTransactionHistory, setReset } = transactionSlice.actions;

export default transactionSlice.reducer;
