import { getDatabase, ref, get, push, set, serverTimestamp, child, query, orderByChild, equalTo,update } from "firebase/database";
import dbConfig from "../../config/fbConfig";
import { setAllCustomer, setOpenFailedCustomer, setOpenSuccessCustomer, setResetCustomer } from "../customerReducer";
import { setLoading } from "../sidenavReducer";

function generateString(number) {
  // Convert the number to a string
  let numStr = number.toString();

  // Determine the number of leading zeros needed
  let numLeadingZeros = 7 - numStr.length;

  // Generate the leading zeros
  let leadingZeros = "0".repeat(numLeadingZeros);

  // Concatenate "T", the leading zeros, and the number string
  let result = "CU" + leadingZeros + numStr;

  return result;
}
function checkName(customer, key, name, area) {
  for (let id in customer) {
    if (customer[id][key] && customer[id][key].toLowerCase() === name.toLowerCase() && customer[id]?.area === area) {
      return true;
    }
  }
  return false;
}
const getNextCustomerIdANDCheckName = async (db, ownerName, merchantName, area) => {
  const dbRef = ref(db);
  let nextId = "CU0000001";

  try {
    const snapshot = await get(child(dbRef, "customer"));
    if (snapshot.exists()) {
      const customer = snapshot.val();
      if (checkName(customer, "ownerName", ownerName, area) && ownerName !== "-") return "Error Nama Pelanggan Telah Terdaftar";
      if (checkName(customer, "merchantName", merchantName, area) && merchantName !== "-") return "Error Nama Toko Telah Terdaftar";

      const ids = Object.values(customer).map((cust) => cust?.id);
      const lastId = ids
        .sort((a, b) => {
          const numA = parseInt(a.substring(2), 10);
          const numB = parseInt(b.substring(2), 10);
          return numA - numB;
        })
        .pop();
      const lastNumber = parseInt(lastId.substring(2), 10);
      nextId = generateString(lastNumber + 1);
    }
  } catch (error) {
    console.error("Error getting last id: ", error);
  }

  return nextId;
};

export const pushCustomer = (data) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const dbRef = ref(db, "customer");
  const customerID = await getNextCustomerIdANDCheckName(db, data?.ownerName, data?.merchantName, data?.area);
  if (customerID.substring(0, 5) !== "Error") {
    const snapshot = await push(dbRef);
    set(snapshot, {
      ...data,
      id: customerID,
      timestamp: serverTimestamp(),
    })
      .then(() => {
        dispatch(setOpenSuccessCustomer(true));
        dispatch(setResetCustomer());
        dispatch(setLoading());
      })
      .catch((error) => {
        console.error("Error pushing customer: ", error);
        dispatch(setOpenFailedCustomer({ isOpen: true, message: "Error pushing customer" }));
        dispatch(setLoading());
      });
  } else {
    dispatch(setOpenFailedCustomer({ isOpen: true, message: customerID }));
    dispatch(setLoading());
  }
};

export const fetchCustomerData = () => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const dbRef = ref(db, "customer");
  const snapshot = await get(dbRef);

  if (snapshot.exists()) {
    const arr = Object.values(snapshot.val());
    arr.sort((a, b) => {
      const numA = parseInt(a.id.substring(1), 10);
      const numB = parseInt(b.id.substring(1), 10);
      return numA - numB;
    });
    dispatch(setAllCustomer(arr));
  } else {
    console.log("Error fetching customer");
  }
};

export const updateCustomer = (data) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const customerRef = ref(db, "customer");
  const idQuery = query(customerRef, orderByChild("id"), equalTo(data?.id));

  get(idQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const key = childSnapshot.key;
          const dbRef = ref(db, "customer/" + key);
          update(dbRef, {
            ...data?.data,
            timestamp: serverTimestamp(),
          })
            .then(() => {
              dispatch(setOpenSuccessCustomer(true));
              dispatch(setResetCustomer());
              dispatch(setLoading());
            })
            .catch((error) => {
              console.error("Error updating customer: ", error);
              dispatch(setOpenFailedCustomer({ isOpen: true, message: "Error updating customer" }));
              dispatch(setLoading());
            });
        });
      } else {
        console.log("No data found");
      }
    })
    .catch((error) => {
      console.error("Error find customer key:", error);
      dispatch(setOpenFailedCustomer({ isOpen: true, message: "Error find customer key" }));
      dispatch(setLoading());
    });
};