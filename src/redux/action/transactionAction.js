import { getDatabase, ref, get, push, set, serverTimestamp, child, query, orderByChild, startAt, update, equalTo, remove } from "firebase/database";
import dbConfig, { storage, database } from "../../config/fbConfig";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { FieldValue } from "firebase/firestore";
import { setOpenFailed, setOpenFailedUpdate, setOpenSuccess, setOpenSuccessUpdate, setReset, setTransactionHistory, settra } from "../transactionReducer";
import { setLoading } from "../sidenavReducer";
import { v4 as uuidv4 } from "uuid";

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
  const db = getDatabase(dbConfig);
  const dbRef = ref(db, "transaction");
  const transactionID = await getNextTransactionId(db);
  const snapshot = await push(dbRef);
  set(snapshot, {
    ...data,
    id: transactionID,
    timestamp: serverTimestamp(),
  })
    .then(() => {
      dispatch(setOpenSuccess(true));
      dispatch(setReset());
      dispatch(setLoading());
    })
    .catch((error) => {
      dispatch(setLoading());
      console.error("Error pushing transaction: ", error);
      dispatch(setOpenFailed({ isOpen: true, message: "Pesanan Gagal Dibuat !!" }));
    });
};

export const deleteTransaction = (id) => async (dispatch) => {
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
              console.error("Error deleting transaksi:", error);
              dispatch(setOpenFailed({ isOpen: true, message: "Gagal menghapus transaksi" }));
              dispatch(setLoading());
            });
        });
      } else {
        console.log("Transaksi tidak ditemukan");
        dispatch(setOpenFailed({ isOpen: true, message: "Transaksi tidak ditemukan" }));
        dispatch(setLoading());
      }
    })
    .catch((error) => {
      console.error("Error saat mencari transaksi:", error);
      dispatch(setOpenFailed({ isOpen: true, message: "Gagal mencari transaksi" }));
      dispatch(setLoading());
    });
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
