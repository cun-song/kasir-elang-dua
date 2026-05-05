// src/redux/action/hppAction.js
import { getDatabase, ref, get, update, onValue } from "firebase/database";
import dbConfig from "../../config/fbConfig";
import { setProductList, setLoadingProduct, setHppData, resetHppData, setLoadingHpp, setSaveStatus, setOpenSuccess, setOpenFailed } from "../hppReducer";

// ─────────────────────────────────────────────────────────────────────────────
//  Helper: konversi array bahan/kemasan ke object keyed by rowId
//  (format yang disimpan di RTDB)
// ─────────────────────────────────────────────────────────────────────────────
const arrToObj = (arr) => {
  const obj = {};
  arr.forEach((item) => {
    obj[item.rowId] = item;
  });
  return obj;
};

// ─────────────────────────────────────────────────────────────────────────────
//  Helper: generate rowId unik
// ─────────────────────────────────────────────────────────────────────────────
let _seq = 1000;
export const genRowId = () => `r${++_seq}_${Date.now()}`;

// ═════════════════════════════════════════════════════════════════════════════
//  ACTION: Fetch daftar produk dari node `product`
//  Dipanggil sekali saat halaman mount (pakai onValue agar realtime)
//  Kembalikan fungsi unsubscribe agar bisa dipanggil saat unmount
// ═════════════════════════════════════════════════════════════════════════════
export const subscribeProductList = () => (dispatch) => {
  const db = getDatabase(dbConfig);
  dispatch(setLoadingProduct(true));

  const unsubscribe = onValue(
    ref(db, "product"),
    (snap) => {
      if (!snap.exists()) {
        dispatch(setProductList([]));
        dispatch(setLoadingProduct(false));
        return;
      }

      const list = Object.entries(snap.val())
        .map(([key, val]) => ({ _key: key, ...val }))
        .filter((p) => p.label) // abaikan entry tanpa label
        .sort((a, b) => (a.index || 99) - (b.index || 99)); // urutkan berdasarkan index

      dispatch(setProductList(list));
      dispatch(setLoadingProduct(false));
    },
    (error) => {
      console.error("Error loading product list:", error);
      dispatch(setLoadingProduct(false));
      dispatch(setOpenFailed({ isOpen: true, message: "Gagal memuat daftar produk: " + error.message }));
    },
  );

  // kembalikan fungsi unsubscribe untuk dipanggil di useEffect cleanup
  return unsubscribe;
};

// ═════════════════════════════════════════════════════════════════════════════
//  ACTION: Fetch data HPP untuk satu produk
//  Dipanggil setiap kali selectedKey berubah
// ═════════════════════════════════════════════════════════════════════════════
export const fetchHpp = (productKey) => async (dispatch) => {
  if (!productKey) {
    dispatch(resetHppData());
    return;
  }

  const db = getDatabase(dbConfig);
  dispatch(setLoadingHpp(true));

  try {
    const snap = await get(ref(db, `hpp/${productKey}`));

    if (snap.exists()) {
      const d = snap.val();

      // konversi bahan & kemasan dari object (RTDB) ke array (untuk state React)
      const bahan = d.bahan ? Object.values(d.bahan).map((b) => ({ ...b, rowId: b.rowId || genRowId() })) : [];
      const kemasan = d.kemasan ? Object.values(d.kemasan).map((k) => ({ ...k, rowId: k.rowId || genRowId() })) : [];

      dispatch(
        setHppData({
          jumlahProduksi: d.jumlahProduksi ?? 10,
          unitType: d.unitType ?? "lusin",
          hargaJual: d.hargaJual ?? 0,
          diskonType: d.diskonType ?? "persen",
          diskonPersen: d.diskonPersen ?? 0,
          diskonNominal: d.diskonNominal ?? 0,
          bahan,
          kemasan,
        }),
      );
    } else {
      // belum ada data HPP untuk produk ini → reset ke default
      dispatch(resetHppData());
    }
  } catch (error) {
    console.error("Error loading HPP:", error);
    dispatch(setOpenFailed({ isOpen: true, message: "Gagal memuat HPP: " + error.message }));
  } finally {
    dispatch(setLoadingHpp(false));
  }
};

// ═════════════════════════════════════════════════════════════════════════════
//  ACTION: Simpan satu section HPP ke Firebase
//
//  section : "produksi" | "bahan" | "kemasan" | "harga"
//  payload : object data yang akan di-merge ke hpp/{productKey}
// ═════════════════════════════════════════════════════════════════════════════
export const saveHppSection =
  ({ productKey, productId, productNama, section, data, updatedBy }) =>
  async (dispatch) => {
    if (!productKey) {
      dispatch(setOpenFailed({ isOpen: true, message: "Pilih produk terlebih dahulu" }));
      return;
    }

    const db = getDatabase(dbConfig);
    dispatch(setSaveStatus({ key: section, status: "saving" }));

    try {
      await update(ref(db, `hpp/${productKey}`), {
        productId,
        productNama,
        ...data,
        updatedAt: Date.now(),
        updatedBy: updatedBy ?? "",
      });

      dispatch(setSaveStatus({ key: section, status: "saved" }));
      dispatch(setOpenSuccess(true));

      // reset ke idle setelah 3 detik
      setTimeout(() => {
        dispatch(setSaveStatus({ key: section, status: "idle" }));
        dispatch(setOpenSuccess(false));
      }, 3000);
    } catch (error) {
      console.error(`Error saving HPP section [${section}]:`, error);
      dispatch(setSaveStatus({ key: section, status: "error" }));
      dispatch(setOpenFailed({ isOpen: true, message: "Gagal menyimpan: " + error.message }));

      setTimeout(() => {
        dispatch(setSaveStatus({ key: section, status: "idle" }));
        dispatch(setOpenFailed({ isOpen: false, message: "" }));
      }, 4000);
    }
  };

// ─────────────────────────────────────────────────────────────────────────────
//  Shortcut actions untuk masing-masing section
//  (dipanggil dari komponen, sudah include konversi arrToObj untuk bahan/kemasan)
// ─────────────────────────────────────────────────────────────────────────────

export const saveProduksi =
  ({ productKey, productId, productNama, jumlahProduksi, unitType, updatedBy }) =>
  (dispatch) => {
    dispatch(
      saveHppSection({
        productKey,
        productId,
        productNama,
        section: "produksi",
        data: { jumlahProduksi, unitType },
        updatedBy,
      }),
    );
  };

export const saveBahan =
  ({ productKey, productId, productNama, bahan, updatedBy }) =>
  (dispatch) => {
    dispatch(
      saveHppSection({
        productKey,
        productId,
        productNama,
        section: "bahan",
        data: { bahan: arrToObj(bahan) }, // array → object sebelum simpan ke RTDB
        updatedBy,
      }),
    );
  };

export const saveKemasan =
  ({ productKey, productId, productNama, kemasan, updatedBy }) =>
  (dispatch) => {
    dispatch(
      saveHppSection({
        productKey,
        productId,
        productNama,
        section: "kemasan",
        data: { kemasan: arrToObj(kemasan) },
        updatedBy,
      }),
    );
  };

export const saveHarga =
  ({ productKey, productId, productNama, hargaJual, diskonType, diskonPersen, diskonNominal, updatedBy }) =>
  (dispatch) => {
    dispatch(
      saveHppSection({
        productKey,
        productId,
        productNama,
        section: "harga",
        data: { hargaJual, diskonType, diskonPersen, diskonNominal },
        updatedBy,
      }),
    );
  };
