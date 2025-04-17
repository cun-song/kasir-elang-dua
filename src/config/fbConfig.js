// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
// import "firebase/firestore";
// import "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBP6BrBBqkuXfA372XJqVBibxzGNUvd-3Q",
  authDomain: "kasir-elang-dua.firebaseapp.com",
  databaseURL: "https://kasir-elang-dua-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kasir-elang-dua",
  storageBucket: "kasir-elang-dua.appspot.com",
  messagingSenderId: "678797826130",
  appId: "1:678797826130:web:2011696b8bef48ca4fa78b",
  measurementId: "G-27HYYWQWNR",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
export const database = getDatabase(app);
export const storage = getStorage(app);

// firebase.initializeApp(firebaseConfig);
// firebase.firestore().settings({ timestampsInSnapshots: true });

// export default firebase;
