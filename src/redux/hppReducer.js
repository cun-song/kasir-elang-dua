// src/redux/hppReducer.js
import { createSlice } from "@reduxjs/toolkit";

export const hppSlice = createSlice({
  name: "hpp",
  initialState: {
    // daftar produk dari node `product`
    productList: [],

    // data hpp yang sedang aktif (loaded dari Firebase)
    hppData: {
      jumlahProduksi: 10,
      unitType: "lusin",
      bahan: [],
      kemasan: [],
      hargaJual: 0,
      diskonType: "persen",
      diskonPersen: 0,
      diskonNominal: 0,
    },

    // status loading
    loadingProduct: false,
    loadingHpp: false,

    // status save per section
    saveStatus: {
      produksi: "idle", // "idle" | "saving" | "saved" | "error"
      bahan: "idle",
      kemasan: "idle",
      harga: "idle",
    },

    // notifikasi
    openSuccess: false,
    openFailed: { isOpen: false, message: "" },
  },

  reducers: {
    // ── product list ─────────────────────────────────────────
    setProductList: (state, action) => {
      state.productList = action.payload;
    },
    setLoadingProduct: (state, action) => {
      state.loadingProduct = action.payload;
    },

    // ── hpp data (load dari Firebase) ─────────────────────────
    setHppData: (state, action) => {
      state.hppData = action.payload;
    },
    resetHppData: (state) => {
      state.hppData = {
        jumlahProduksi: 10,
        unitType: "lusin",
        bahan: [],
        kemasan: [],
        hargaJual: 0,
        diskonType: "persen",
        diskonPersen: 0,
        diskonNominal: 0,
      };
    },
    setLoadingHpp: (state, action) => {
      state.loadingHpp = action.payload;
    },

    // ── save status per section ───────────────────────────────
    setSaveStatus: (state, action) => {
      // payload: { key: "bahan"|"kemasan"|"produksi"|"harga", status: string }
      const { key, status } = action.payload;
      state.saveStatus[key] = status;
    },
    resetSaveStatus: (state) => {
      state.saveStatus = {
        produksi: "idle",
        bahan: "idle",
        kemasan: "idle",
        harga: "idle",
      };
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

export const { setProductList, setLoadingProduct, setHppData, resetHppData, setLoadingHpp, setSaveStatus, resetSaveStatus, setOpenSuccess, setOpenFailed } = hppSlice.actions;

export default hppSlice.reducer;
