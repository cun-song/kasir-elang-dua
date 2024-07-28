import { getDatabase, ref, get, push, set, serverTimestamp, child, query, orderByChild, startAt, update, equalTo } from "firebase/database";
import dbConfig from "../../config/fbConfig";
import { getDownloadURL, ref as refimage, getStorage } from "firebase/storage";
import { setAllProduct, setOpenFailedProduct, setOpenSuccessProduct, setResetProduct } from "../productReducer";
import { setLoading } from "../sidenavReducer";

const getNextProductId = async (db) => {
  const dbRef = ref(db);
  let nextId = "P1";

  try {
    const snapshot = await get(child(dbRef, "product"));
    if (snapshot.exists()) {
      const products = snapshot.val();
      const ids = Object.values(products).map((prod) => prod?.id);
      const lastId = ids
        .sort((a, b) => {
          const numA = parseInt(a.substring(1), 10);
          const numB = parseInt(b.substring(1), 10);
          return numA - numB;
        })
        .pop();
      const newId = parseInt(lastId.substring(1), 10) + 1;
      nextId = "P" + newId;
    }
  } catch (error) {
    console.error("Error getting last id: ", error);
  }

  return nextId;
};

export const pushProduct = (data) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const dbRef = ref(db, "product");
  const productID = await getNextProductId(db);
  const snapshot = await push(dbRef);
  set(snapshot, {
    ...data,
    id: productID,
    img: "",
    timestamp: serverTimestamp(),
  })
    .then(() => {
      dispatch(setOpenSuccessProduct(true));
      dispatch(setResetProduct());
    })
    .catch((error) => {
      console.error("Error pushing product: ", error);
      dispatch(setOpenFailedProduct({ isOpen: true, message: "Error pushing product" }));
    });
};
export const updateProduct = (data) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const productRef = ref(db, "product");
  const idQuery = query(productRef, orderByChild("id"), equalTo(data?.id));

  get(idQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const key = childSnapshot.key;
          const dbRef = ref(db, "product/" + key);
          update(dbRef, {
            ...data,
            timestamp: serverTimestamp(),
          })
            .then(() => {
              dispatch(setOpenSuccessProduct(true));
              dispatch(setResetProduct());
              dispatch(setLoading());
            })
            .catch((error) => {
              console.error("Error updating product: ", error);
              dispatch(setOpenFailedProduct({ isOpen: true, message: "Error updating product" }));
              dispatch(setLoading());
            });
        });
      } else {
        console.log("No data found");
      }
    })
    .catch((error) => {
      console.error("Error find product key:", error);
      dispatch(setOpenFailedProduct({ isOpen: true, message: "Error find product key" }));
      dispatch(setLoading());
    });
};

export const fetchProductData = () => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const dbRef = ref(db, "product");
  const snapshot = await get(dbRef);

  if (snapshot.exists()) {
    const arr = Object.values(snapshot.val());
    arr.sort((a, b) => {
      const numA = a?.index;
      const numB = b?.index;
      return numA - numB;
    });

    const fetchPromises = arr.map((obj) => {
      if (obj?.img) {
        const address = obj?.img;
        return fetchImage(address)
          .then((url) => {
            obj.img = url;
          })
          .catch((error) => {
            console.error("Error fetching image:", error);
            obj.img = null;
          });
      }
      return Promise.resolve();
    });

    await Promise.all(fetchPromises);
    dispatch(setAllProduct(arr));
  } else {
    console.log("Error fetching product");
  }
};

const fetchImage = async (address) => {
  const storage = getStorage(dbConfig);
  const ref = refimage(storage, address);
  const url = await getDownloadURL(ref);
  return url;
};
