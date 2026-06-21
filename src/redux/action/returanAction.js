import { getDatabase, ref, get, push, set, serverTimestamp, child, query, orderByChild, startAt, update, equalTo, remove } from "firebase/database";
import dbConfig from "../../config/fbConfig";
import { setOpenFailedReturan, setOpenSuccessReturan, setResetReturan, setReturanList } from "../returanReducer";
import { setLoading } from "../sidenavReducer";
import { getServerTimeGMT7 } from "./transactionAction";

/**
 * Generate returan ID with format R{YYYYMMDD}-{NNN}
 * e.g. R20260621-001
 */
const getNextReturanId = async (db) => {
  try {
    // Get server time in GMT+7
    const serverTime = await getServerTimeGMT7();
    const dateStr = serverTime.format("YYYYMMDD");
    const prefix = `R${dateStr}-`;

    const snapshot = await get(child(ref(db), "returan"));
    let nextIndex = 1;

    if (snapshot.exists()) {
      const returans = snapshot.val();
      const todayIds = Object.values(returans)
        .map((r) => r.id)
        .filter((id) => id?.startsWith(prefix));

      if (todayIds.length > 0) {
        const lastIndex = todayIds
          .map((id) => parseInt(id.split("-").pop(), 10))
          .sort((a, b) => a - b)
          .pop();
        nextIndex = lastIndex + 1;
      }
    }

    const indexStr = String(nextIndex).padStart(3, "0");
    return prefix + indexStr;
  } catch (error) {
    console.error("Error generating returan ID:", error);
    // Fallback: use local date
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `R${y}${m}${d}-001`;
  }
};

export const pushReturan = (data) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const returanId = await getNextReturanId(db);
  const returanRef = push(ref(db, "returan"));

  try {
    await set(returanRef, {
      ...data,
      id: returanId,
      isSent: false,
      sentAt: null,
      sentBy: null,
      timestamp: serverTimestamp(),
    });

    dispatch(setOpenSuccessReturan(true));
    dispatch(setResetReturan());
  } catch (error) {
    console.error("Error pushing returan:", error);
    dispatch(setOpenFailedReturan({ isOpen: true, message: error?.message || "Gagal membuat returan." }));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchReturanList = (time) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const dbRef = ref(db, "returan");
  const now = new Date();
  const lastTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate() - time).getTime();
  const returanQuery = query(dbRef, orderByChild("timestamp"), startAt(lastTimestamp));

  try {
    const snapshot = await get(returanQuery);
    if (snapshot.exists()) {
      const arr = Object.values(snapshot.val());
      dispatch(setReturanList(arr));
    } else {
      dispatch(setReturanList([]));
    }
  } catch (error) {
    console.error("Error fetching returan list:", error);
    dispatch(setReturanList([]));
  }
};

export const updateReturan = (id, data) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const returanRef = ref(db, "returan");
  const idQuery = query(returanRef, orderByChild("id"), equalTo(id));

  try {
    const snapshot = await get(idQuery);
    if (!snapshot.exists()) {
      dispatch(setOpenFailedReturan({ isOpen: true, message: "Returan tidak ditemukan" }));
      dispatch(setLoading(false));
      return;
    }

    snapshot.forEach((childSnapshot) => {
      const key = childSnapshot.key;
      const existingData = childSnapshot.val();

      // Block editing if already sent
      if (existingData?.isSent === true) {
        dispatch(setOpenFailedReturan({ isOpen: true, message: "Returan sudah dikirim, tidak dapat diubah." }));
        dispatch(setLoading(false));
        return;
      }

      const dbRef = ref(db, "returan/" + key);
      update(dbRef, {
        ...data,
        timestamp: serverTimestamp(),
      })
        .then(() => {
          dispatch(setOpenSuccessReturan(true));
          dispatch(setResetReturan());
          dispatch(setLoading(false));
        })
        .catch((error) => {
          console.error("Error updating returan:", error);
          dispatch(setOpenFailedReturan({ isOpen: true, message: "Gagal mengupdate returan." }));
          dispatch(setLoading(false));
        });
    });
  } catch (error) {
    console.error("Error find returan key:", error);
    dispatch(setOpenFailedReturan({ isOpen: true, message: "Gagal menemukan returan." }));
    dispatch(setLoading(false));
  }
};

export const deleteReturan = (id) => async (dispatch, getState) => {
  const db = getDatabase(dbConfig);
  const returanRef = ref(db, "returan");
  const idQuery = query(returanRef, orderByChild("id"), equalTo(id));

  try {
    const snapshot = await get(idQuery);
    if (!snapshot.exists()) {
      dispatch(setOpenFailedReturan({ isOpen: true, message: "Returan tidak ditemukan" }));
      dispatch(setLoading(false));
      return;
    }

    const role = getState()?.sidenav?.role;

    snapshot.forEach(async (childSnapshot) => {
      const key = childSnapshot.key;
      const existingData = childSnapshot.val();

      // Block deleting if already sent (only if not Super Admin)
      if (existingData?.isSent === true && role !== "Super Admin") {
        dispatch(setOpenFailedReturan({ isOpen: true, message: "Returan sudah dikirim, tidak dapat dihapus." }));
        dispatch(setLoading(false));
        return;
      }

      const dbRef = ref(db, `returan/${key}`);
      await remove(dbRef);

      dispatch(setOpenSuccessReturan(true));
      dispatch(setResetReturan());
      dispatch(setLoading(false));
    });
  } catch (error) {
    console.error("Error deleting returan:", error);
    dispatch(setOpenFailedReturan({ isOpen: true, message: "Gagal menghapus returan." }));
    dispatch(setLoading(false));
  }
};

export const sendReturan = (ids, sentByName) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const returanRef = ref(db, "returan");

  for (let id of ids) {
    const idQuery = query(returanRef, orderByChild("id"), equalTo(id));
    try {
      const snapshot = await get(idQuery);
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const key = childSnapshot.key;
          const dbRef = ref(db, "returan/" + key);
          update(dbRef, {
            isSent: true,
            sentAt: serverTimestamp(),
            sentBy: sentByName,
          })
            .then(() => {
              dispatch(setOpenSuccessReturan(true));
              dispatch(setResetReturan());
            })
            .catch((error) => {
              console.error("Error sending returan:", error);
              dispatch(setOpenFailedReturan({ isOpen: true, message: "Gagal mengirim returan." }));
            });
        });
      } else {
        dispatch(setOpenFailedReturan({ isOpen: true, message: "Returan tidak ditemukan." }));
      }
    } catch (error) {
      console.error("Error finding returan:", error);
      dispatch(setOpenFailedReturan({ isOpen: true, message: "Gagal mengirim returan." }));
    }
  }
  dispatch(setLoading(false));
};
