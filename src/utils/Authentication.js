import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import React from "react";
import { reset } from "../redux/sidenavReducer";

export const signup = (email, password) => {
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential;
      console.log(user); // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error);
      // ..
    });
};

export const signout = () => async (dispatch) => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      dispatch(reset());
    })
    .catch((error) => {
      // An error happened.
    });
};
