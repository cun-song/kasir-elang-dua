import { getDatabase, ref, get, push, set, serverTimestamp, child, query, orderByChild, startAt } from "firebase/database";
import dbConfig from "../../config/fbConfig";
import { getDownloadURL, ref as refimage, getStorage } from "firebase/storage";
import { FieldValue } from "firebase/firestore";
import { setOpenFailed, setOpenSuccess, setReset, setTransactionHistory, settra } from "../transactionReducer";
import { setLoading } from "../sidenavReducer";

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