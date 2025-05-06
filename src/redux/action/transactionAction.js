import { getDatabase, ref, get, push, set, serverTimestamp, child, query, orderByChild, startAt, update, equalTo, remove,onValue } from "firebase/database";
import dbConfig, { storage, database } from "../../config/fbConfig";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { FieldValue } from "firebase/firestore";
import { setOpenFailed, setOpenFailedUpdate, setOpenSuccess, setOpenSuccessUpdate, setReset, setTransactionHistory, settra } from "../transactionReducer";
import { setLoading } from "../sidenavReducer";
import { v4 as uuidv4 } from "uuid";
import dayjs from 'dayjs';

function generateString(number) {
  // Convert the number to a string
  let numStr = number.toString();

  // Determine the number of leading zeros needed
  let numLeadingZeros = 7 - numStr.length;

  // Generate the leading zeros
  let leadingZeros = "0".repeat(numLeadingZeros);

  // Concatenate "T", the leading zeros, and the number string
  let result = "T" + leadingZeros + numStr;

  return result;
}

const getNextTransactionId = async (db) => {
  const dbRef = ref(db);
  let nextId = "T0000001";

  try {
    const snapshot = await get(child(dbRef, "transaction"));
    if (snapshot.exists()) {
      const transactions = snapshot.val();
      const ids = Object.values(transactions).map((trans) => trans.id);
      const lastId = ids
        .sort((a, b) => {
          const numA = parseInt(a.substring(1), 10);
          const numB = parseInt(b.substring(1), 10);
          return numA - numB;
        })
        .pop();
      const lastNumber = parseInt(lastId.substring(1), 10);
      nextId = generateString(lastNumber + 1);
    }
  } catch (error) {
    console.error("Error getting last id: ", error);
  }

  return nextId;
};

export const pushTransaction = (data) => async (dispatch) => {
  const db = getDatabase();
  const transactionID = await getNextTransactionId(db);
  const transactionRef = push(ref(db, "transaction"));
  const productEntries = Object.entries(data?.product);

  const combinedMap = {};

  productEntries.forEach(([id, item]) => {
    const isBVersion = id?.startsWith("BP");
    const baseId = isBVersion ? id?.replace(/^B/, "") : id;

    const targetId = productEntries?.some(([otherId]) => otherId === baseId)
      ? baseId // jika versi non-B ada, pakai itu
      : id; // kalau tidak ada, pakai ID aslinya

    if (!combinedMap[targetId]) {
      combinedMap[targetId] = {
        id: targetId,
        qty: item?.qty || 0,
        cartQty: item?.productQty || 0,
      };
    } else {
      combinedMap[targetId].cartQty += item?.productQty || 0;
    }
  });

  const products = Object.values(combinedMap);

  try {
    const productSnapshot = await get(ref(db, "product"));
    const productData = productSnapshot.val();

    // Siapkan update path untuk stok produk
    const updates = {};

    for (const item of products) {
      const normalizedId = item.id.replace(/^B/, "");

      const matchedEntry = Object.entries(productData).find(([, value]) => value?.id?.replace(/^B/, "") === normalizedId);

      if (matchedEntry) {
        const [productKey, productValue] = matchedEntry;
        const currentQty = productValue?.qty || 0;
        const newQty = currentQty - item?.cartQty;

        updates[`product/${productKey}/qty`] = newQty;
      } else {
        console.warn(`Produk tidak ditemukan di database untuk ID: ${item.id}`);
      }
    }

    // Lakukan update qty semua produk sekaligus
    await update(ref(db), updates);

    // Simpan transaksi
    await set(transactionRef, {
      ...data,
      id: transactionID,
      timestamp: serverTimestamp(),
    });

    dispatch(setOpenSuccess(true));
    dispatch(setReset());
  } catch (error) {
    console.error("Transaksi gagal:", error?.message);
    dispatch(
      setOpenFailed({
        isOpen: true,
        message: error?.message || "Transaksi gagal diproses.",
      })
    );
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteTransaction2 = (id) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const transaksiRef = ref(db, "transaction");
  const idQuery = query(transaksiRef, orderByChild("id"), equalTo(id));

  get(idQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const key = childSnapshot.key;
          const dbRef = ref(db, `transaction/${key}`);
          remove(dbRef)
            .then(() => {
              dispatch(setOpenSuccessUpdate(true));
              dispatch(setReset());
              dispatch(setLoading());
            })
            .catch((error) => {
              console.error("Error deleting transaction:", error);
              dispatch(setOpenFailed({ isOpen: true, message: "Gagal menghapus transaksi" }));
              dispatch(setLoading());
            });
        });
      } else {
        console.log("No transaction found");
        dispatch(setOpenFailed({ isOpen: true, message: "Transaksi tidak ditemukan" }));
        dispatch(setLoading());
      }
    })
    .catch((error) => {
      console.error("Error finding transaction:", error);
      dispatch(setOpenFailed({ isOpen: true, message: "Gagal mencari transaksi" }));
      dispatch(setLoading());
    });
};

export const deleteTransaction = (id) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const transaksiRef = ref(db, "transaction");
  const idQuery = query(transaksiRef, orderByChild("id"), equalTo(id));

  try {
    const snapshot = await get(idQuery);

    if (!snapshot.exists()) {
      dispatch(setOpenFailed({ isOpen: true, message: "Transaksi tidak ditemukan" }));
      dispatch(setLoading());
      return;
    }

    snapshot.forEach(async (childSnapshot) => {
      const key = childSnapshot.key;
      const transaksiData = childSnapshot.val();

      const produkList = transaksiData?.product || {};

      // Tambah qty kembali ke masing-masing produk
      for (const [productKey, item] of Object.entries(produkList)) {
        const productRef = ref(db, `product/${productKey.startsWith("BP") ? productKey.replace(/^B/, "") : productKey}`);
        const productSnapshot = await get(productRef);

        if (productSnapshot.exists()) {
          const currentQty = productSnapshot.val().qty || 0;
          const newQty = currentQty + item?.productQty;

          await update(productRef, { qty: newQty });
        }
      }

      // Setelah produk di-update, hapus transaksi
      const dbRef = ref(db, `transaction/${key}`);
      await remove(dbRef);

      // Redux
      dispatch(setOpenSuccessUpdate(true));
      dispatch(setReset());
      dispatch(setLoading());
    });
  } catch (error) {
    console.error("Error saat memproses transaksi:", error);
    dispatch(setOpenFailed({ isOpen: true, message: "Gagal memproses transaksi" }));
    dispatch(setLoading());
  }
};

export const fetchTransactionHistory = (time) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const dbRef = ref(db, "transaction");
  const now = new Date();
  const lastTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate() - time).getTime();
  const transactionQuery = query(dbRef, orderByChild("timestamp"), startAt(lastTimestamp));
  try {
    const snapshot = await get(transactionQuery);
    if (snapshot.exists()) {
      const arr = Object.values(snapshot.val());
      dispatch(setTransactionHistory(arr));
    } else {
      dispatch(setTransactionHistory([]));
      console.log("No transaction found");
    }
  } catch (error) {
    console.log("Error fetching Transaction History : ", error);
  }
};

export const updateShipped = (ids) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const transactionRef = ref(db, "transaction");
  for (let id of ids) {
    const idQuery = query(transactionRef, orderByChild("id"), equalTo(id));
    get(idQuery)
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const key = childSnapshot.key;
            const dbRef = ref(db, "transaction/" + key);
            update(dbRef, {
              isDelivered: 1,
              deliveredTimestamp: serverTimestamp(),
            })
              .then(() => {
                dispatch(setOpenSuccessUpdate(true));
                dispatch(setReset());
              })
              .catch((error) => {
                console.error("Error updating shipped transaction: ", error);
                dispatch(setOpenFailedUpdate({ isOpen: true, message: "Update Pengiriman Gagal!!" }));
              });
          });
        } else {
          dispatch(setOpenFailedUpdate({ isOpen: true, message: "Update Pengiriman Gagal!!" }));
          console.log("No data found");
        }
      })
      .catch((error) => {
        console.error("Error find product key:", error);
        dispatch(setOpenFailedUpdate({ isOpen: true, message: "Update Pengiriman Gagal!!" }));
        dispatch(setLoading());
      });
  }
  dispatch(setLoading());
};

export const updatePaid = (ids) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const transactionRef = ref(db, "transaction");
  for (let id of ids) {
    const idQuery = query(transactionRef, orderByChild("id"), equalTo(id));
    get(idQuery)
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const key = childSnapshot.key;
            const dbRef = ref(db, "transaction/" + key);
            update(dbRef, {
              isDelivered: 1,
              isPaid: 1,
              paidTimestamp: serverTimestamp(),
            })
              .then(() => {
                dispatch(setOpenSuccessUpdate(true));
                dispatch(setReset());
              })
              .catch((error) => {
                console.error("Error updating paid transaction: ", error);
                dispatch(setOpenFailedUpdate({ isOpen: true, message: "Update Pembayaran Gagal!!" }));
              });
          });
        } else {
          dispatch(setOpenFailedUpdate({ isOpen: true, message: "Update Pembayaran Gagal!!" }));
          console.log("No data found");
        }
      })
      .catch((error) => {
        dispatch(setOpenFailedUpdate({ isOpen: true, message: "Update Pembayaran Gagal!!" }));
        console.error("Error find product key:", error);
      });
  }
  dispatch(setLoading());
};

export const sendPdfToFirebaseJob = async (pdfBlob) => {
  try {
    const jobId = uuidv4();
    const filePath = `temp-invoice/${jobId}.pdf`;
    const fileRef = storageRef(storage, filePath);

    // Upload ke Firebase Storage
    await uploadBytes(fileRef, pdfBlob);
    const downloadURL = await getDownloadURL(fileRef);

    // Tulis ke Firebase Database
    const jobData = {
      id: jobId,
      pdfUrl: downloadURL,
      status: "pending",
      assignedTo: "printerInvoice",
      createdAt: Date.now(),
    };

    await set(ref(database, `printQueue/${jobId}`), jobData);

    return { success: true, jobId, url: downloadURL };
  } catch (error) {
    console.error("Gagal mengirim ke print server:", error);
    return { success: false, error };
  }
};
export const getServerTimeGMT7 = async () => {
  return new Promise((resolve, reject) => {
    try {
      const db = getDatabase();
      const timeRef = ref(db, 'utils/serverTime');

      // Trigger penulisan waktu server
      set(timeRef, serverTimestamp());

      // Ambil waktu server setelah tersimpan
      onValue(timeRef, (snapshot) => {
        const timestamp = snapshot.val();
        if (timestamp) {
          // Konversi dari UNIX timestamp ke objek dayjs
          const serverTime = dayjs(timestamp);
          // Tambahkan offset +7 jam
          const gmt7Time = serverTime.utcOffset(7 * 60); // 7*60 menit

          resolve(gmt7Time);
        } else {
          reject(new Error('Server timestamp not available'));
        }
      }, { onlyOnce: true });
    } catch (error) {
      reject(error);
    }
  });
};