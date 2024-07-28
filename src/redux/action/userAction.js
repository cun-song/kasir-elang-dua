import { getDatabase, ref, get, query, orderByChild, startAt, equalTo } from "firebase/database";
import dbConfig from "../../config/fbConfig";
import { setName, setRole } from "../sidenavReducer";

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
