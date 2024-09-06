import React, { useEffect, useState } from "react";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import NavBar from "../component/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { click, setLoading, setTitle } from "../redux/sidenavReducer";
import CloseIcon from "@mui/icons-material/Close";

import semuaProduk from "../img/semuaProduk.png";
import kecapAsin from "../img/kecapAsin.png";
import kecapManis from "../img/kecapManis.png";
import kecapIkan from "../img/kecapIkan.png";
import cuka from "../img/cuka.png";
import spritus from "../img/spritus.png";
import ButtonCategory from "../component/ButtonCategory";
import { PRODUCT_CATEGORY } from "../constant/Home";
import ProductCard from "../component/ProductCard";
import CartList from "../component/CartList";
import DialogTambahan from "../component/DialogTambahan";

import { setCartData, setDiskon } from "../redux/cartReducer";
import { fetchProductData } from "../redux/action/productAction";
import { setBonusData } from "../redux/cartReducer";
import DialogSelectCustomer from "../component/DialogSelectCustomer";
import { fetchCustomerData } from "../redux/action/customerAction";
import { setOpenFailed, setOpenSuccess } from "../redux/transactionReducer";
import DialogSuccess from "../component/DialogSuccess";
import DialogFailed from "../component/DialogFailed";
import { decimalToFraction, formattedNumber } from "../utils/stingFormatted";
import { setTransactionCustomer } from "../redux/customerReducer";
import DialogConfirmation from "../component/DialogConfirmation";
import { pushTransaction } from "../redux/action/transactionAction";
import { useRef } from "react";

const style = {
  scroll: {
    "&::-webkit-scrollbar": {
      height: "1.4em",
      scrollBehavior: "smooth",
      "&-track": {
        background: "transparent",
      },
      "&-thumb": {
        backgroundColor: "#D9D9D9",
        borderRadius: "2em",
        backgroundClip: "content-box",
        border: "0.3em solid transparent",
        "&:hover": {
          background: "#a8a8a8",
          backgroundClip: "content-box",
          border: "0.35em solid transparent",
        },
      },
      "&-track-piece": {
        marginLeft: "-0.3em",
        marginRight: "-0.3em",
      },
    },
  },
  rowCheckout: { display: "flex", justifyContent: "space-between" },
  textCheckout: { fontFamily: "poppins", fontSize: "16px", fontWeight: "bold", color: "#12141E" },
  textCustomer: { fontFamily: "poppins", fontSize: "18px", fontWeight: "bold", color: "#12141E" },
  title: { fontFamily: "poppins", fontSize: "28px", fontWeight: "bold", color: "#12141E" },
  labelBotol: { fontFamily: "nunito", fontSize: "16px", fontWeight: "medium", color: "#828282" },
};

export default function Home() {
  const dispatch = useDispatch();
  const [category, setCategory] = useState(null);
  const [product, setProduct] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState({ total: 0, besar: 0, kecil: 0 });
  const [total, setTotal] = useState(0);
  const [lusin, setLusin] = useState(0);
  const [openTambahan, setOpenTambahan] = useState(false);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [listCart, setListCart] = useState({});
  const [transactionData, setTransactionData] = useState({});

  const formattedSubtotal = formattedNumber(subtotal);
  const formattedDiscount = formattedNumber(discount?.total);
  const formattedTotal = formattedNumber(subtotal - discount?.total);

  const cart = useSelector((state) => state.cart.cartData);
  const bonusData = useSelector((state) => state.cart.bonusData);
  const diskon = useSelector((state) => state.cart.diskon);
  const allProduct = useSelector((state) => state.product.allProduct);
  const transactionSuccess = useSelector((state) => state.transaction.openSuccess);
  const transactionFailed = useSelector((state) => state.transaction.openFailed);
  const refresh = useSelector((state) => state.transaction.reset);
  const defaultCustomer = useSelector((state) => state?.customer?.transactionCustomer);
  const customerData = useSelector((state) => state?.customer?.allCustomer);
  const adminName = useSelector((state) => state?.sidenav?.name);

  function add(index, productId) {
    if (cart.hasOwnProperty(productId)) {
      const temp = {
        ...cart,
        [productId]: { ...cart[productId], productQty: cart[productId].productQty + 1 },
      };
      dispatch(setCartData(temp));
    } else {
      const temp = {
        ...cart,
        [productId]: {
          img: product[index]?.img,
          label: product[index]?.label,
          size: product[index]?.size,
          type: product[index]?.type,
          price: product[index]?.price,
          productQty: 1,
          index: product[index]?.index,
          totalLusin: product[index]?.totalLusin,
        },
      };
      dispatch(setCartData(temp));
    }
  }
  function subtract(productId) {
    if (cart[productId]?.productQty > 1) {
      const temp = {
        ...cart,
        [productId]: { ...cart[productId], productQty: cart[productId].productQty - 1 },
      };
      dispatch(setCartData(temp));
    } else {
      removeCart(productId);
    }
  }
  function removeCart(productId) {
    if (productId[0] === "B") {
      const realId = productId?.substring(1);
      const newData = bonusData.filter((product) => product?.productID !== realId);
      dispatch(setBonusData(newData));
    } else {
      const newData = { ...cart };
      delete newData[productId];
      dispatch(setCartData(newData));
    }
  }
  function edit(qty, productId) {
    if (qty !== 0) {
      const temp = {
        ...cart,
        [productId]: { ...cart[productId], productQty: qty },
      };
      dispatch(setCartData(temp));
    } else {
      removeCart(productId);
    }
  }
  function openDialogCheckout() {
    if (Object.values(listCart).length !== 0 && defaultCustomer?.ownerName && defaultCustomer?.merchantName) {
      if (Object.values(listCart).length > 13) {
        dispatch(setOpenFailed({ isOpen: true, message: "Pesanan melebihi 13 jenis produk, Mohon untuk membagi pesanan menjadi 2 invoice !!" }));
      } else {
        const tempCart = Object.keys(listCart).reduce((acc, key) => {
          const { img, ...rest } = listCart[key];
          acc[key] = rest;
          return acc;
        }, {});
        const tempData = {
          total: subtotal - discount?.total,
          subtotal: subtotal,
          discount: discount,
          lusin: lusin,
          product: tempCart,
        };

        setTransactionData(tempData);
        setOpenCheckout(true);
      }
    }
  }

  function checkOut() {
    if (Object.keys(transactionData)?.length !== 0) {
      const temp = {
        customerID: defaultCustomer?.customerID,
        ownerName: defaultCustomer?.ownerName,
        merchantName: defaultCustomer?.merchantName,
        adminName: adminName,
        isDelivered: 0,
        isPaid: 0,
        ...transactionData,
      };
      dispatch(setLoading());
      dispatch(pushTransaction(temp));
    }
  }

  useEffect(() => {
    dispatch(click(0));
    dispatch(setTitle("Pemesanan"));
    dispatch(fetchProductData());
    dispatch(fetchCustomerData());
  }, []);

  useEffect(() => {
    setProduct(allProduct);
    setTotal(allProduct?.length);
  }, [allProduct]);

  useEffect(() => {
    if (transactionSuccess) {
      setOpenCheckout(false);
      setSubtotal(0);
      setDiscount({ total: 0, besar: 0, kecil: 0 });
      setLusin(0);
      setListCart({});
      dispatch(setCartData({}));
      dispatch(setBonusData([{ productID: null, label: null, qty: null }]));
      dispatch(setDiskon({ besar: 0, kecil: 0 }));
      dispatch(setTransactionCustomer({ customerID: "", ownerName: "", merchantName: "" }));
    }
  }, [refresh]);

  useEffect(() => {
    const defaultDiskon = customerData.filter((cust) => cust?.id === defaultCustomer?.customerID)[0]?.discount ?? { besar: 0, kecil: 0 };
    dispatch(setDiskon(defaultDiskon));
  }, [defaultCustomer]);

  useEffect(() => {
    let filteredProducts;
    if (category === null) {
      filteredProducts = allProduct;
    } else {
      filteredProducts = allProduct.filter((product) => product.categoryID === category);
    }
    setProduct(filteredProducts);
    setTotal(filteredProducts.length);
  }, [category]);

  useEffect(() => {
    if (Object.keys(cart).length !== 0) {
      const bonusObj = {};
      bonusData.forEach((bd) => {
        const item = allProduct.find((item) => item?.id === bd?.productID);
        if (item) {
          bonusObj[`B${item?.id}`] = {
            img: item?.img,
            label: item?.label,
            size: item?.size,
            type: item?.type,
            index: item?.index,
            price: 0,
            productQty: bd?.qty,
            totalLusin: item?.totalLusin,
          };
        }
      });

      const newCart = { ...cart, ...bonusObj };
      const totalQty = Object.values(newCart).reduce((acc, item) => acc + item?.productQty * item?.totalLusin, 0);
      const subtotal = Object.values(newCart).reduce((acc, item) => acc + item?.productQty * item?.price, 0);
      const disc = Object.values(newCart).reduce((acc, item) => acc + item?.productQty * item?.totalLusin * (item?.price === 0 ? 0 : item?.size === "Besar" ? diskon?.besar : item?.size === "Kecil" ? diskon?.kecil : 0), 0);
      setLusin(totalQty);
      setSubtotal(subtotal);
      setDiscount({ total: disc, besar: diskon?.besar, kecil: diskon?.kecil });
      setListCart(newCart);
    } else {
      setLusin(0);
      setDiscount({ total: 0, besar: 0, kecil: 0 });
      setSubtotal(0);
      setListCart({});
    }
  }, [cart, diskon, bonusData]);

  return (
    <Grid container sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between" }}>
      <Grid item sx={{ pr: 5, height: "100%" }} xs={9}>
        <NavBar />
        <Grid container mt={5} justifyContent={"space-between"}>
          <ButtonCategory id={null} value={category} img={semuaProduk} label={"Semua Produk"} setCategory={setCategory} />
          <ButtonCategory id={"C1"} value={category} img={kecapAsin} label={"Kecap Asin"} setCategory={setCategory} />
          <ButtonCategory id={"C2"} value={category} img={kecapManis} label={"Kecap Manis"} setCategory={setCategory} />
          <ButtonCategory id={"C3"} value={category} img={cuka} label={"Cuka"} setCategory={setCategory} />
          <ButtonCategory id={"C4"} value={category} img={kecapIkan} label={"Kecap Ikan"} setCategory={setCategory} />
          <ButtonCategory id={"C5"} value={category} img={spritus} label={"Spritus"} setCategory={setCategory} />
        </Grid>
        <Grid container justifyContent={"space-between"} alignItems={"center"} mt={3}>
          <Grid item>
            <Typography sx={{ fontFamily: "poppins", fontSize: 28, fontWeight: "bold", color: "#12141E" }}>{PRODUCT_CATEGORY[category]}</Typography>
          </Grid>
          <Grid item>
            <Typography sx={{ fontFamily: "nunito", fontSize: 18, fontWeight: "semibold", color: "#6D6F75" }}>{total} jenis produk</Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent={"space-between"} alignItems={"center"} mt={3} rowGap={4} overflow={"auto"} maxHeight={"57%"} sx={style.scroll}>
          {product.map((product, idx) => (
            <ProductCard
              label={product?.label}
              img={product?.img}
              price={product?.price}
              cartQty={cart[product?.id]?.productQty ?? 0}
              add={() => add(idx, product?.id)}
              write={(qty) => edit(qty, product?.id)}
              subtract={() => subtract(product?.id)}
            />
          ))}
        </Grid>
      </Grid>
      <Grid item sx={{ backgroundColor: "#FFFFFF", height: "100%" }} xs={3}>
        <Grid p={3}>
          {/* <Grid item>
            <Typography sx={{ fontFamily: "poppins", fontSize: 28, fontWeight: "bold", color: "#12141E" }}>Pesanan</Typography>
          </Grid> */}
          <Grid item container gap={2} mt={1}>
            <Typography sx={{ ...style.textCustomer, fontWeight: "medium" }}>Nama Pemesan: </Typography>
            <Grid item sx={style.rowCheckout}>
              {defaultCustomer?.ownerName === "" ? (
                <Button
                  disableElevation
                  disableRipple
                  onClick={() => setOpenCustomer(true)}
                  sx={{ color: "#707278", textTransform: "none", fontSize: "16px", fontFamily: "poppins", ":hover": { backgroundColor: "transparent", color: "#12141E" }, padding: 0, textAlign: "start" }}
                >
                  Pilih data
                </Button>
              ) : (
                <Grid item container gap={2}>
                  <Typography sx={style.textCustomer}>{defaultCustomer?.ownerName}</Typography>
                  <IconButton
                    onClick={() => dispatch(setTransactionCustomer({ customerID: "", ownerName: "", merchantName: "" }))}
                    sx={{ width: "30px", height: "30px", ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item container gap={2}>
            <Typography sx={{ ...style.textCustomer, fontWeight: "medium" }}>Nama Toko: </Typography>
            <Grid item sx={style.rowCheckout}>
              {defaultCustomer?.merchantName === "" ? (
                <Button
                  disableElevation
                  disableRipple
                  onClick={() => setOpenCustomer(true)}
                  sx={{ color: "#707278", textTransform: "none", fontSize: "16px", fontFamily: "poppins", ":hover": { backgroundColor: "transparent", color: "#12141E" }, padding: 0, textAlign: "start" }}
                >
                  Pilih data
                </Button>
              ) : (
                <Grid item container gap={2}>
                  <Typography sx={style.textCustomer}>{defaultCustomer?.merchantName}</Typography>
                  <IconButton
                    onClick={() => dispatch(setTransactionCustomer({ customerID: "", ownerName: "", merchantName: "" }))}
                    sx={{ width: "30px", height: "30px", ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item mt={2} sx={{ display: "flex", flexDirection: "column", height: "480px", overflow: "auto", ...style.scroll }} gap={3}>
            {Object.entries(listCart).map(([key, value]) => (
              <CartList img={value?.img} label={value?.label} size={value?.size} qty={value?.productQty} price={value?.price} remove={() => removeCart(key)} />
            ))}
          </Grid>
          <Grid item sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
            <Grid item sx={style.rowCheckout}>
              <Button
                disableElevation
                disableRipple
                onClick={() => setOpenTambahan(true)}
                sx={{ color: "#707278", textTransform: "none", fontSize: "16px", fontFamily: "poppins", ":hover": { backgroundColor: "transparent", color: "#12141E" }, padding: 0, textAlign: "start" }}
              >
                + tambahan
              </Button>
            </Grid>
            <Grid item sx={style.rowCheckout}>
              <Typography sx={style.textCheckout}>Subtotal</Typography>
              <Typography sx={style.textCheckout}>Rp {formattedSubtotal}</Typography>
            </Grid>
            <Grid item sx={style.rowCheckout}>
              <Typography sx={style.textCheckout}>Discount</Typography>
              <Typography sx={style.textCheckout}>Rp {formattedDiscount}</Typography>
            </Grid>
            <Grid item sx={{ height: "1px", width: "100%", border: "1px dashed #9A9B9F" }}></Grid>
            <Grid item sx={style.rowCheckout}>
              <Typography sx={style.textCheckout}>Total</Typography>
              <Typography sx={style.textCheckout}>Rp {formattedTotal}</Typography>
            </Grid>
            <Grid item sx={style.rowCheckout}>
              <Typography sx={style.textCheckout}>Total Lusin</Typography>
              <Typography sx={style.textCheckout}>{decimalToFraction(lusin)}</Typography>
            </Grid>
          </Grid>
          <Grid item container justifyContent={"center"} mt={4}>
            <Button onClick={() => openDialogCheckout()} sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, width: "100%", height: "66px", borderRadius: "30px", textTransform: "none" }} variant="contained">
              Checkout
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <DialogTambahan open={openTambahan} handleToggle={() => setOpenTambahan((prev) => !prev)} />
      <DialogSelectCustomer open={openCustomer} handleToggle={() => setOpenCustomer((prev) => !prev)} />
      <DialogSuccess open={transactionSuccess} handleToggle={() => dispatch(setOpenSuccess(false))} />
      <DialogFailed open={transactionFailed?.isOpen} message={transactionFailed?.message} handleToggle={() => dispatch(setOpenFailed({ isOpen: false, message: "" }))} />
      <DialogConfirmation open={openCheckout} handleToggle={() => setOpenCheckout((prev) => !prev)} label={"Yakin Ingin Memproses Pesanan"} save={() => checkOut()}>
        <Grid sx={{ display: "flex", alignItems: "center", flexDirection: "column", marginTop: -2, marginBottom: 2 }}>
          <Typography sx={{ fontFamily: "poppins", fontSize: 22, fontWeight: "medium", color: "#12141E" }}>
            {defaultCustomer?.ownerName !== "-" ? defaultCustomer?.ownerName : ""}
            {defaultCustomer?.ownerName !== "-" && defaultCustomer?.merchantName !== "-" ? ", " : ""}
            {defaultCustomer?.merchantName !== "-" ? defaultCustomer?.merchantName : ""}
          </Typography>
          <Typography sx={{ fontFamily: "poppins", fontSize: 20, color: "#12141E" }}>
            Diskon Besar: {discount?.besar} Diskon Kecil: {discount?.kecil}
          </Typography>
        </Grid>
      </DialogConfirmation>
    </Grid>
  );
}
