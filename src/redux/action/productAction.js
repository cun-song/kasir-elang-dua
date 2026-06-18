import { getDatabase, ref, get, push, set, serverTimestamp, child, query, orderByChild, update, equalTo } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import dbConfig from "../../config/fbConfig";
import { setAllProduct, setOpenFailedProduct, setOpenSuccessProduct, setResetProduct } from "../productReducer";
import { setLoading } from "../sidenavReducer";

const getNextProductId = async (db) => {
  const dbRef = ref(db);
  let nextId = "1";

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
      nextId = newId;
    }
  } catch (error) {
    console.error("Error getting last id: ", error);
  }

  return nextId;
};
const uploadProductImage = async (imageFile, productId) => {
  const storage = getStorage();
  const imgRef = storageRef(storage, `product/${productId}`);
  await uploadBytes(imgRef, imageFile);
  const downloadURL = await getDownloadURL(imgRef);
  return downloadURL;
};

export const pushProduct = (data, imageFile) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const dbRef = ref(db, "product");
  const productID = await getNextProductId(db);
  const newProductId = "P" + productID;

  let imgUrl = "";
  if (imageFile) {
    try {
      imgUrl = await uploadProductImage(imageFile, newProductId);
    } catch (error) {
      console.error("Error uploading image:", error);
      dispatch(setOpenFailedProduct({ isOpen: true, message: "Gagal upload foto produk" }));
      dispatch(setLoading());
      return;
    }
  }

  const snapshot = await push(dbRef);
  set(snapshot, {
    ...data,
    id: newProductId,
    img: imgUrl,
    index: productID,
    timestamp: serverTimestamp(),
  })
    .then(() => {
      dispatch(setOpenSuccessProduct(true));
      dispatch(setResetProduct());
      dispatch(setLoading());
    })
    .catch((error) => {
      console.error("Error pushing product:", error);
      dispatch(setOpenFailedProduct({ isOpen: true, message: "Error pushing product" }));
      dispatch(setLoading());
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE — Edit produk yang sudah ada
//   data.img  : URL lama dari Firebase (dipakai jika imageFile null)
//   imageFile : File | null   (jika ada → upload & replace URL lama)
// ─────────────────────────────────────────────────────────────────────────────
export const updateProduct = (data, imageFile) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const productRef = ref(db, "product");
  const idQuery = query(productRef, orderByChild("id"), equalTo(data?.id));

  get(idQuery)
    .then(async (snapshot) => {
      if (!snapshot.exists()) {
        console.log("No data found");
        dispatch(setOpenFailedProduct({ isOpen: true, message: "Produk tidak ditemukan" }));
        dispatch(setLoading());
        return;
      }

      // Tentukan URL gambar akhir
      let imgUrl = data.img ?? ""; // default: pertahankan URL lama

      if (imageFile) {
        try {
          // Upload overwrite ke path product/{id} → URL baru
          imgUrl = await uploadProductImage(imageFile, data.id);
        } catch (error) {
          console.error("Error uploading image:", error);
          dispatch(setOpenFailedProduct({ isOpen: true, message: "Gagal upload foto produk" }));
          dispatch(setLoading());
          return;
        }
      }

      snapshot.forEach((childSnapshot) => {
        const key = childSnapshot.key;
        const dbRef = ref(db, "product/" + key);
        update(dbRef, {
          ...data,
          img: imgUrl,
          timestamp: serverTimestamp(),
        })
          .then(() => {
            dispatch(setOpenSuccessProduct(true));
            dispatch(setResetProduct());
            dispatch(setLoading());
          })
          .catch((error) => {
            console.error("Error updating product:", error);
            dispatch(setOpenFailedProduct({ isOpen: true, message: "Error updating product" }));
            dispatch(setLoading());
          });
      });
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
  const ref = storageRef(storage, address);
  const url = await getDownloadURL(ref);
  return url;
};
export const updateProductOrder = (orderedProducts) => async (dispatch) => {
  const db = getDatabase(dbConfig);
  const dbRef = ref(db);

  try {
    const snapshot = await get(child(dbRef, "product"));
    if (!snapshot.exists()) {
      dispatch(setOpenFailedProduct({ isOpen: true, message: "Produk tidak ditemukan" }));
      dispatch(setLoading());
      return;
    }

    const products = snapshot.val();

    // map id produk -> key node firebase
    const idToKey = {};
    Object.entries(products).forEach(([key, val]) => {
      idToKey[val?.id] = key;
    });

    // siapkan multi-path update, hanya mengubah field index
    const updates = {};
    orderedProducts.forEach((p, idx) => {
      const key = idToKey[p?.id];
      if (key) {
        updates[`product/${key}/index`] = idx + 1;
      }
    });

    await update(dbRef, updates);

    dispatch(setOpenSuccessProduct(true));
    dispatch(setResetProduct());
    dispatch(setLoading());
  } catch (error) {
    console.error("Error updating product order:", error);
    dispatch(setOpenFailedProduct({ isOpen: true, message: "Error mengatur urutan produk" }));
    dispatch(setLoading());
  }
};
