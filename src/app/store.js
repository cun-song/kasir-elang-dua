import { configureStore } from "@reduxjs/toolkit";
import sidenavReducer from "../redux/sidenavReducer";
import cartReducer from "../redux/cartReducer";
import productReducer from "../redux/productReducer";
import customerReducer from "../redux/customerReducer";
import transactionReducer from "../redux/transactionReducer";

export default configureStore({
  reducer: {
    sidenav: sidenavReducer,
    cart: cartReducer,
    product: productReducer,
    customer: customerReducer,
    transaction: transactionReducer,
  },
});
