import { getDatabase, ref, get, push, set, serverTimestamp, child, query, orderByChild, startAt, update, equalTo, remove } from "firebase/database";
import dbConfig from "../../config/fbConfig";
import { setOpenFailedTitipBon, setOpenSuccessTitipBon, setResetTitipBon, setTitipBonList } from "../titipBonReducer";
import { setLoading } from "../sidenavReducer";
import { getServerTimeGMT7 } from "./transactionAction";

/**
 * Generate Titip Bon ID with format TB{YYYYMMDD}-{NNN}
 * e.g. TB20260621-001
 */
const getNextTitipBonId = async (db) => {
  try {
    const serverTime = await getServerTimeGMT7();
    const dateStr = serverTime.format("YYYYMMDD");
    const prefix = `TB${dateStr}-`;

    const snapshot = await get(child(ref(db), "titipBon"));
    let nextIndex = 1;

    if (snapshot.exists()) {
      const titipBons = snapshot.val();
      const todayIds = Object.values(titipBons)
        .map((tb) => tb.id)
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
    console.error("Error generating Titip Bon ID:", error);
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `TB${y}${m}${d}-001`;
  }
};

/**
 * Find Firebase push key for a transaction by its id field
 */
const findTransactionKey = async (db, transactionId) => {
  const transactionRef = ref(db, "transaction");
  const idQuery = query(transactionRef, orderByChild("id"), equalTo(transactionId));
  const snapshot = await get(idQuery);
  if (snapshot.exists()) {
    let key = null;
    snapshot.forEach((childSnapshot) => {
      key = childSnapshot.key;
    });
    return key;
  }
  return null;
};

/**
 * Find Firebase push key for a titipBon by its id field
 */
const findTitipBonKey = async (db, titipBonId) => {
  const titipBonRef = ref(db, "titipBon");
  const idQuery = query(titipBonRef, orderByChild("id"), equalTo(titipBonId));
  const snapshot = await get(idQuery);
  if (snapshot.exists()) {
    let key = null;
    snapshot.forEach((childSnapshot) => {
      key = childSnapshot.key;
    });
    return key;
  }
  return null;
};

/**
 * Fetch Titip Bon list filtered by time range
 */
export const fetchTitipBonList = (time) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const dbRef = ref(db, "titipBon");
  const now = new Date();
  const lastTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate() - time).getTime();
  const titipBonQuery = query(dbRef, orderByChild("timestamp"), startAt(lastTimestamp));

  try {
    const snapshot = await get(titipBonQuery);
    if (snapshot.exists()) {
      const arr = Object.values(snapshot.val());
      dispatch(setTitipBonList(arr));
    } else {
      dispatch(setTitipBonList([]));
    }
  } catch (error) {
    console.error("Error fetching Titip Bon list:", error);
    dispatch(setTitipBonList([]));
  }
};

/**
 * Fetch eligible invoices for a given customer.
 * Eligible = isDelivered === 1 AND isPaid !== 1 AND (titipBonId === null OR titipBonStatus === "gagal_via_titipbon")
 */
export const fetchEligibleInvoices = async (customerID) => {
  const db = getDatabase(dbConfig);
  const transactionRef = ref(db, "transaction");
  const customerQuery = query(transactionRef, orderByChild("customerID"), equalTo(customerID));

  try {
    const snapshot = await get(customerQuery);
    if (!snapshot.exists()) return [];

    const eligible = [];
    snapshot.forEach((childSnapshot) => {
      const t = childSnapshot.val();
      // Must be delivered and not paid
      if (t?.isDelivered === 1 && t?.isPaid !== 1) {
        // Must not belong to an active titipBon, OR have failed via titipBon
        if (!t?.titipBonId || t?.titipBonStatus === "gagal_via_titipbon") {
          eligible.push(t);
        }
      }
    });

    return eligible;
  } catch (error) {
    console.error("Error fetching eligible invoices:", error);
    return [];
  }
};

/**
 * Create a new Titip Bon and update linked transactions atomically
 */
export const pushTitipBon = (data) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const titipBonId = await getNextTitipBonId(db);
  const titipBonRef = push(ref(db, "titipBon"));
  const titipBonPushKey = titipBonRef.key;

  try {
    // Build multi-path updates
    const updates = {};

    // Write the titipBon record
    updates[`titipBon/${titipBonPushKey}`] = {
      ...data,
      id: titipBonId,
      status: "aktif",
      timestamp: serverTimestamp(),
    };

    // Update each linked transaction
    for (const invoice of data.invoices) {
      const transactionKey = await findTransactionKey(db, invoice.invoiceId);
      if (transactionKey) {
        updates[`transaction/${transactionKey}/titipBonId`] = titipBonId;
        updates[`transaction/${transactionKey}/titipBonStatus`] = null;
      }
    }

    await update(ref(db), updates);

    dispatch(setOpenSuccessTitipBon(true));
    dispatch(setResetTitipBon());
  } catch (error) {
    console.error("Error creating Titip Bon:", error);
    dispatch(setOpenFailedTitipBon({ isOpen: true, message: error?.message || "Gagal membuat Titip Bon." }));
  } finally {
    dispatch(setLoading(false));
  }
};

/**
 * Delete a Titip Bon and release/rollback linked transactions
  * Only Super Admin can perform this action.
  */
export const deleteTitipBon = (id) => async (dispatch, getState) => {
  const db = getDatabase(dbConfig);
  const role = getState()?.sidenav?.role;

  try {
    if (role !== "Super Admin") {
      dispatch(setOpenFailedTitipBon({ isOpen: true, message: "Hanya Super Admin yang dapat menghapus Titip Bon." }));
      dispatch(setLoading(false));
      return;
    }

    const titipBonKey = await findTitipBonKey(db, id);
    if (!titipBonKey) {
      dispatch(setOpenFailedTitipBon({ isOpen: true, message: "Titip Bon tidak ditemukan" }));
      dispatch(setLoading(false));
      return;
    }

    // Get the titipBon data first to find linked invoices
    const tbSnapshot = await get(ref(db, `titipBon/${titipBonKey}`));
    const tbData = tbSnapshot.val();

    // Build multi-path updates
    const updates = {};

    // Remove the titipBon
    updates[`titipBon/${titipBonKey}`] = null;

    // Release and rollback linked transactions
    if (tbData?.invoices) {
      for (const invoice of tbData.invoices) {
        const transactionKey = await findTransactionKey(db, invoice.invoiceId);
        if (transactionKey) {
          updates[`transaction/${transactionKey}/titipBonId`] = null;
          updates[`transaction/${transactionKey}/titipBonStatus`] = null;
          updates[`transaction/${transactionKey}/isPaid`] = null;
          updates[`transaction/${transactionKey}/paidTimestamp`] = null;
        }
      }
    }

    await update(ref(db), updates);

    dispatch(setOpenSuccessTitipBon(true));
    dispatch(setResetTitipBon());
  } catch (error) {
    console.error("Error deleting Titip Bon:", error);
    dispatch(setOpenFailedTitipBon({ isOpen: true, message: "Gagal menghapus Titip Bon." }));
  } finally {
    dispatch(setLoading(false));
  }
};

/**
 * Mark Titip Bon as paid with selective invoice payment
 *
 * @param {string} titipBonId - The titipBon ID
 * @param {Array} checkedInvoiceIds - Invoice IDs that are being paid
 * @param {Array} uncheckedInvoiceIds - Invoice IDs that are NOT being paid
 */
export const markTitipBonPaid = (titipBonId, checkedInvoiceIds, uncheckedInvoiceIds) => async (dispatch) => {
  const db = getDatabase(dbConfig);

  try {
    if (checkedInvoiceIds.length === 0) {
      dispatch(setOpenFailedTitipBon({ isOpen: true, message: "Pilih minimal 1 invoice untuk ditandai lunas." }));
      dispatch(setLoading(false));
      return;
    }

    const titipBonKey = await findTitipBonKey(db, titipBonId);
    if (!titipBonKey) {
      dispatch(setOpenFailedTitipBon({ isOpen: true, message: "Titip Bon tidak ditemukan" }));
      dispatch(setLoading(false));
      return;
    }

    const updates = {};

    // Mark Titip Bon as paid
    updates[`titipBon/${titipBonKey}/status`] = "sudah_bayar";

    // Update checked invoices (paid)
    for (const invoiceId of checkedInvoiceIds) {
      const transactionKey = await findTransactionKey(db, invoiceId);
      if (transactionKey) {
        updates[`transaction/${transactionKey}/isPaid`] = 1;
        updates[`transaction/${transactionKey}/paidTimestamp`] = serverTimestamp();
        updates[`transaction/${transactionKey}/titipBonStatus`] = "lunas_via_titipbon";
      }
    }

    // Update unchecked invoices (payment failed, release from titipBon)
    for (const invoiceId of uncheckedInvoiceIds) {
      const transactionKey = await findTransactionKey(db, invoiceId);
      if (transactionKey) {
        updates[`transaction/${transactionKey}/titipBonStatus`] = "gagal_via_titipbon";
        updates[`transaction/${transactionKey}/titipBonId`] = null;
      }
    }

    // Update the invoices status inside the titipBon record too
    const tbSnapshot = await get(ref(db, `titipBon/${titipBonKey}`));
    const tbData = tbSnapshot.val();
    if (tbData?.invoices) {
      tbData.invoices.forEach((inv, index) => {
        if (checkedInvoiceIds.includes(inv.invoiceId)) {
          updates[`titipBon/${titipBonKey}/invoices/${index}/statusInvoice`] = "lunas_via_titipbon";
        } else if (uncheckedInvoiceIds.includes(inv.invoiceId)) {
          updates[`titipBon/${titipBonKey}/invoices/${index}/statusInvoice`] = "gagal_via_titipbon";
        }
      });
    }

    await update(ref(db), updates);

    dispatch(setOpenSuccessTitipBon(true));
    dispatch(setResetTitipBon());
  } catch (error) {
    console.error("Error marking Titip Bon as paid:", error);
    dispatch(setOpenFailedTitipBon({ isOpen: true, message: "Gagal memproses pembayaran Titip Bon." }));
  } finally {
    dispatch(setLoading(false));
  }
};
