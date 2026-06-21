import { createSlice } from "@reduxjs/toolkit";

export const returanSlice = createSlice({
  name: "returan",
  initialState: {
    returanList: [],
    openSuccessReturan: false,
    openFailedReturan: { isOpen: false, message: "" },
    resetReturan: false,
  },
  reducers: {
    setReturanList: (state, action) => {
      state.returanList = action.payload;
    },
    setOpenSuccessReturan: (state, action) => {
      state.openSuccessReturan = action.payload;
    },
    setOpenFailedReturan: (state, action) => {
      state.openFailedReturan = action.payload;
    },
    setResetReturan: (state) => {
      state.resetReturan = !state.resetReturan;
    },
  },
});

export const { setReturanList, setOpenSuccessReturan, setOpenFailedReturan, setResetReturan } = returanSlice.actions;

export default returanSlice.reducer;
