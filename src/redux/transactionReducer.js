import { createSlice } from "@reduxjs/toolkit";

export const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    transactionData: {},
    openSuccess: false,
    openFailed: { isOpen: false, message: "" },
    openSuccessUpdate: false,
    openFailedUpdate: { isOpen: false, message: "" },
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
    setOpenSuccessUpdate: (state, action) => {
      state.openSuccessUpdate = action.payload;
    },
    setOpenFailedUpdate: (state, action) => {
      state.openFailedUpdate = action.payload;
    },
    setTransactionHistory: (state, action) => {
      state.transactionHistory = action.payload;
    },
    setReset: (state) => {
      state.reset = !state.reset;
    },
  },
});

export const { setTransactionData, setOpenFailed, setOpenSuccess, setTransactionHistory, setReset, setOpenFailedUpdate, setOpenSuccessUpdate } = transactionSlice.actions;

export default transactionSlice.reducer;
