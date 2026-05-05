import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    // daftar semua user dari node `user`
    allUsers: [],

    // status loading
    loading: false,

    // notifikasi
    openSuccess: false,
    openFailed: { isOpen: false, message: "" },
  },

  reducers: {
    // ── user list ─────────────────────────────────────────────
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },

    // tambah satu user baru ke list (setelah create berhasil)
    addUser: (state, action) => {
      state.allUsers = [...state.allUsers, action.payload];
    },

    // hapus user dari list berdasarkan key
    removeUser: (state, action) => {
      state.allUsers = state.allUsers.filter((u) => u.key !== action.payload);
    },

    // ── loading ───────────────────────────────────────────────
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // ── notifikasi ────────────────────────────────────────────
    setOpenSuccess: (state, action) => {
      state.openSuccess = action.payload;
    },
    setOpenFailed: (state, action) => {
      state.openFailed = action.payload;
    },
  },
});

export const {
  setAllUsers,
  addUser,
  removeUser,
  setLoading,
  setOpenSuccess,
  setOpenFailed,
} = userSlice.actions;

export default userSlice.reducer;