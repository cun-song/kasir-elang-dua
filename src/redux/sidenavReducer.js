import { createSlice } from "@reduxjs/toolkit";

export const sidenavSlice = createSlice({
  name: "sidenav",
  initialState: {
    value: 0,
    title: "",
    name: "",
    role: "",
    loading: false,
    openFailedLogin: { isOpen: false, message: "" },
  },
  reducers: {
    click: (state, action) => {
      state.value = action.payload;
    },
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setLoading: (state) => {
      state.loading = !state.loading;
    },
    setOpenFailedLogin: (state, action) => {
      state.openFailedLogin = action.payload;
    },
  },
});

export const { click, setTitle, setName, setRole, setLoading, setOpenFailedLogin } = sidenavSlice.actions;

export default sidenavSlice.reducer;
