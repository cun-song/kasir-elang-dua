import { getDatabase, ref, get, set, remove, query, orderByChild, equalTo } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";
import dbConfig from "../../config/fbConfig";
import { setName, setRole } from "../sidenavReducer";
import { setAllUsers, addUser, removeUser, setLoading, setOpenSuccess, setOpenFailed } from "../userReducer";

// ─── Secondary Firebase App ────────────────────────────────────────────────────
// dbConfig adalah Firebase App instance. Untuk membuat app kedua,
// ambil options dari app yang sudah ada via dbConfig.options.
// Ini agar createUserWithEmailAndPassword tidak logout Super Admin aktif.
function getSecondaryAuth() {
  const SECONDARY = "secondaryApp";
  const existing = getApps().find((a) => a.name === SECONDARY);
  const app = existing ?? initializeApp(dbConfig.options, SECONDARY);
  return getAuth(app);
}

// ─── 1. fetchUserData ── EXISTING, jangan dihapus ────────────────────────────
export const fetchUserData = (email) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const dbRef = ref(db, "user");
  const userQuery = query(dbRef, orderByChild("email"), equalTo(email));
  try {
    const snapshot = await get(userQuery);
    if (snapshot.exists()) {
      const arr = Object.values(snapshot.val());
      dispatch(setRole(arr[0]?.role));
      dispatch(setName(arr[0]?.username));
    } else {
      console.log("No user found");
    }
  } catch (error) {
    console.log("Error fetching user data : ", error);
  }
};

// ─── 2. fetchAllUsers ─────────────────────────────────────────────────────────
// get langsung tanpa orderByChild — sort di client seperti fetchProductData.
export const fetchAllUsers = () => async (dispatch) => {
  dispatch(setLoading(true));
  const db = getDatabase(dbConfig);
  const dbRef = ref(db, "user");
  try {
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const users = Object.entries(snapshot.val()).map(([key, val]) => ({
        key,
        ...val,
      }));
      users.sort((a, b) => (a?.username ?? "").localeCompare(b?.username ?? ""));
      dispatch(setAllUsers(users));
    } else {
      dispatch(setAllUsers([]));
    }
  } catch (error) {
    console.log("Error fetching all users : ", error);
    dispatch(setOpenFailed({ isOpen: true, message: "Gagal memuat data user." }));
  } finally {
    dispatch(setLoading(false));
  }
};

// ─── 3. createUser ────────────────────────────────────────────────────────────
export const createUser =
  ({ username, email, password, role }) =>
  async (dispatch) => {
    dispatch(setLoading(true));
    const db = getDatabase(dbConfig);
    const secondaryAuth = getSecondaryAuth();
    try {
      const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const uid = cred.user.uid;

      await set(ref(db, `user/${uid}`), { username, email, role });

      await secondaryAuth.signOut();

      dispatch(addUser({ key: uid, username, email, role }));
      dispatch(setOpenSuccess(true));
    } catch (error) {
      console.log("Error creating user : ", error);
      const message =
        error.code === "auth/email-already-in-use"
          ? "Email sudah terdaftar."
          : error.code === "auth/invalid-email"
            ? "Format email tidak valid."
            : error.code === "auth/weak-password"
              ? "Password terlalu lemah (minimal 6 karakter)."
              : `Gagal membuat user: ${error.message}`;
      dispatch(setOpenFailed({ isOpen: true, message }));
    } finally {
      dispatch(setLoading(false));
    }
  };

// ─── 4. deleteUserFromDB ──────────────────────────────────────────────────────
export const deleteUserFromDB = (userKey) => async (dispatch) => {
  dispatch(setLoading(true));
  const db = getDatabase(dbConfig);
  try {
    await remove(ref(db, `user/${userKey}`));
    dispatch(removeUser(userKey));
    dispatch(setOpenSuccess(true));
  } catch (error) {
    console.log("Error deleting user : ", error);
    dispatch(setOpenFailed({ isOpen: true, message: "Gagal menghapus user." }));
  } finally {
    dispatch(setLoading(false));
  }
};

// ─── 5. resetUserPassword ─────────────────────────────────────────────────────
export const resetUserPassword = (email) => async (dispatch) => {
  dispatch(setLoading(true));
  const primaryAuth = getAuth();
  try {
    await sendPasswordResetEmail(primaryAuth, email);
    dispatch(setOpenSuccess(true));
  } catch (error) {
    console.log("Error sending reset email : ", error);
    const message = error.code === "auth/user-not-found" ? "Email tidak ditemukan di Firebase Auth." : "Gagal mengirim email reset password.";
    dispatch(setOpenFailed({ isOpen: true, message }));
  } finally {
    dispatch(setLoading(false));
  }
};
