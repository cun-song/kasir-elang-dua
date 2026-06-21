import { createSlice } from "@reduxjs/toolkit";

export const titipBonSlice = createSlice({
  name: "titipBon",
  initialState: {
    titipBonList: [],
    openSuccessTitipBon: false,
    openFailedTitipBon: { isOpen: false, message: "" },
    resetTitipBon: false,
  },
  reducers: {
    setTitipBonList: (state, action) => {
      state.titipBonList = action.payload;
    },
    setOpenSuccessTitipBon: (state, action) => {
      state.openSuccessTitipBon = action.payload;
    },
    setOpenFailedTitipBon: (state, action) => {
      state.openFailedTitipBon = action.payload;
    },
    setResetTitipBon: (state) => {
      state.resetTitipBon = !state.resetTitipBon;
    },
  },
});

export const { setTitipBonList, setOpenSuccessTitipBon, setOpenFailedTitipBon, setResetTitipBon } = titipBonSlice.actions;

export default titipBonSlice.reducer;
