import React, { useEffect, useState } from "react";
import { Button, Drawer, Grid, IconButton, Typography, useMediaQuery, Box } from "@mui/material";
import NavBar from "../component/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/sidenavReducer";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReplyIcon from "@mui/icons-material/Reply";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";

import semuaProduk from "../img/semuaProduk.png";
import kecapAsin from "../img/kecapAsin.png";
import kecapManis from "../img/kecapManis.png";
import kecapIkan from "../img/kecapIkan.png";
import cuka from "../img/cuka.png";
import spritus from "../img/spritus.png";
import jerigen from "../img/jerigen.png";

import ButtonCategory from "../component/ButtonCategory";
import { PRODUCT_CATEGORY, Label_Size } from "../constant/Home";
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
import { useNavigate } from "react-router-dom";

const style = {
  scroll: {
    "&::-webkit-scrollbar": {
      height: "1.4em",
      scrollBehavior: "smooth",
      "&-track": { background: "transparent" },
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
      "&-track-piece": { marginLeft: "-0.3em", marginRight: "-0.3em" },
    },
  },
  rowCheckout: { display: "flex", justifyContent: "space-between" },
  textCheckout: { fontFamily: "poppins", fontSize: "16px", fontWeight: "bold", color: "#12141E" },
  textCustomer: { fontFamily: "poppins", fontSize: "18px", fontWeight: "bold", color: "#12141E" },
  title: { fontFamily: "poppins", fontSize: "28px", fontWeight: "bold", color: "#12141E" },
};

export default function Home() {
  const dispatch = useDispatch();
  const [category, setCategory] = useState(null);
  const [product, setProduct] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState({ total: 0, besar: 0, kecil: 0, meja: 0 });
  const [total, setTotal] = useState(0);
  const [lusin, setLusin] = useState(0);
  const [openTambahan, setOpenTambahan] = useState(false);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [listCart, setListCart] = useState({});
  const [transactionData, setTransactionData] = useState({});
  const [openDrawer, setOpenDrawer] = useState(false);

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
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const cartItemCount = Object.keys(listCart).length;

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
          qty: product[index]?.qty,
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
      if (Object.values(listCart).length > 11) {
        dispatch(setOpenFailed({ isOpen: true, message: "Pesanan melebihi 11 jenis produk, Mohon untuk membagi pesanan menjadi 2 invoice !!" }));
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

    dispatch(fetchProductData());
    dispatch(fetchCustomerData());
  }, []);

  useEffect(() => {
    setProduct(allProduct);
    setTotal(allProduct?.length);
  }, [allProduct]);

  useEffect(() => {
    if (transactionSuccess) {
      setOpenDrawer(false);
      setOpenCheckout(false);
      setSubtotal(0);
      setDiscount({ total: 0, besar: 0, kecil: 0, meja: 0 });
      setLusin(0);
      setListCart({});
      setCategory(null);
      dispatch(setCartData({}));
      dispatch(setBonusData([{ productID: null, label: null, qty: null }]));
      dispatch(setDiskon({ besar: 0, kecil: 0, meja: 0 }));
      dispatch(setTransactionCustomer({ customerID: "", ownerName: "", merchantName: "" }));
      dispatch(fetchProductData());
    }
  }, [refresh]);

  useEffect(() => {
    const rawDiskon = customerData.find((cust) => cust?.id === defaultCustomer?.customerID)?.discount ?? {};
    const defaultDiskon = { besar: 0, kecil: 0, meja: 0, ...rawDiskon };
    dispatch(setDiskon(defaultDiskon));
  }, [defaultCustomer, customerData, dispatch]);

  useEffect(() => {
    let filteredProducts;
    if (category === null) {
      filteredProducts = allProduct;
    } else if (category === "C6") {
      filteredProducts = allProduct.filter((product) => product.type === "Gen");
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
            qty: item?.qty,
            price: 0,
            productQty: bd?.qty,
            totalLusin: item?.totalLusin,
          };
        }
      });
      const newCart = { ...cart, ...bonusObj };
      const totalQty = Object.values(newCart).reduce((acc, item) => acc + item?.productQty * item?.totalLusin, 0);
      const subtotal = Object.values(newCart).reduce((acc, item) => acc + item?.productQty * item?.price, 0);
      const disc = Object.values(newCart).reduce(
        (acc, item) => acc + item?.productQty * item?.totalLusin * (item?.price === 0 ? 0 : item?.size === "Besar" ? diskon?.besar : item?.size === "Kecil" ? diskon?.kecil : item?.size === "meja" ? diskon?.meja : 0),
        0,
      );
      setLusin(totalQty);
      setSubtotal(subtotal);
      setDiscount({ total: disc, besar: diskon?.besar, kecil: diskon?.kecil, meja: diskon?.meja });
      setListCart(newCart);
    } else {
      setLusin(0);
      setDiscount({ total: 0, besar: 0, kecil: 0, meja: 0 });
      setSubtotal(0);
      setListCart({});
    }
  }, [cart, diskon, bonusData]);

  // ─── PC checkout panel (tidak diubah sama sekali) ────────────────────────────
  const drawerCheckout = (
    <Grid item sx={{ backgroundColor: "#FFFFFF", height: "100%", width: isMobile ? "100vw" : "" }} xs={isMobile ? 0 : 3}>
      <Grid p={3} sx={{height:"100%"}}>
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
            <CartList key={key} img={value?.img} label={value?.label} size={value?.size} qty={value?.productQty} price={value?.price} remove={() => removeCart(key)} />
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
  );

  // ─── Mobile bottom sheet ──────────────────────────────────────────────────────
  const mobileBottomSheet = (
    <Box sx={{ width: "100vw", maxHeight: "90vh", display: "flex", flexDirection: "column", borderRadius: "20px 20px 0 0", overflow: "hidden", backgroundColor: "#fff" }}>
      {/* Handle bar */}
      <Box sx={{ display: "flex", justifyContent: "center", pt: 1.5, pb: 1 }}>
        <Box sx={{ width: 40, height: 4, borderRadius: 2, backgroundColor: "#E0E0E0" }} />
      </Box>

      {/* Header sheet */}
      <Box sx={{ px: 2, pb: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "0.5px solid #F0F0F0" }}>
        <Typography sx={{ fontFamily: "poppins", fontSize: 16, fontWeight: "bold", color: "#12141E" }}>Pesanan</Typography>
        <IconButton onClick={() => setOpenDrawer(false)} sx={{ width: 32, height: 32, ":hover": { backgroundColor: "transparent" } }}>
          <ReplyIcon sx={{ color: "#E06F2C", fontSize: 22 }} />
        </IconButton>
      </Box>

      {/* Customer section */}
      <Box sx={{ px: 2, py: 1.5, backgroundColor: "#FAFAFB", borderBottom: "0.5px solid #F0F0F0" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Nama Pemesan */}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontFamily: "poppins", fontSize: 11, color: "#9A9B9F", mb: 0.5 }}>Nama Pemesan</Typography>
            {defaultCustomer?.ownerName === "" ? (
              <Button
                disableElevation
                disableRipple
                onClick={() => setOpenCustomer(true)}
                sx={{ color: "#E06F2C", textTransform: "none", fontSize: "13px", fontFamily: "poppins", ":hover": { backgroundColor: "transparent" }, padding: 0, fontWeight: "bold" }}
              >
                + Pilih
              </Button>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography sx={{ fontFamily: "poppins", fontSize: 13, fontWeight: "bold", color: "#12141E", flex: 1 }} noWrap>
                  {defaultCustomer?.ownerName}
                </Typography>
                <IconButton onClick={() => dispatch(setTransactionCustomer({ customerID: "", ownerName: "", merchantName: "" }))} sx={{ width: 20, height: 20, ":hover": { backgroundColor: "transparent" }, p: 0 }}>
                  <CloseIcon sx={{ fontSize: 14, color: "#9A9B9F" }} />
                </IconButton>
              </Box>
            )}
          </Box>
          {/* Nama Toko */}
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontFamily: "poppins", fontSize: 11, color: "#9A9B9F", mb: 0.5 }}>Nama Toko</Typography>
            {defaultCustomer?.merchantName === "" ? (
              <Button
                disableElevation
                disableRipple
                onClick={() => setOpenCustomer(true)}
                sx={{ color: "#E06F2C", textTransform: "none", fontSize: "13px", fontFamily: "poppins", ":hover": { backgroundColor: "transparent" }, padding: 0, fontWeight: "bold" }}
              >
                + Pilih
              </Button>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Typography sx={{ fontFamily: "poppins", fontSize: 13, fontWeight: "bold", color: "#12141E", flex: 1 }} noWrap>
                  {defaultCustomer?.merchantName}
                </Typography>
                <IconButton onClick={() => dispatch(setTransactionCustomer({ customerID: "", ownerName: "", merchantName: "" }))} sx={{ width: 20, height: 20, ":hover": { backgroundColor: "transparent" }, p: 0 }}>
                  <CloseIcon sx={{ fontSize: 14, color: "#9A9B9F" }} />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Cart list */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 1.5, display: "flex", flexDirection: "column", gap: 1.5, maxHeight: "40vh" }}>
        {Object.entries(listCart).length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 4, gap: 1 }}>
            <ShoppingCartIcon sx={{ fontSize: 40, color: "#E0E0E0" }} />
            <Typography sx={{ fontFamily: "poppins", fontSize: 13, color: "#9A9B9F" }}>Belum ada produk dipilih</Typography>
          </Box>
        ) : (
          Object.entries(listCart).map(([key, value]) => <CartList key={key} img={value?.img} label={value?.label} size={value?.size} qty={value?.productQty} price={value?.price} remove={() => removeCart(key)} />)
        )}
      </Box>

      {/* Tambahan button */}
      <Box sx={{ px: 2, py: 1, borderTop: "0.5px solid #F0F0F0" }}>
        <Button
          disableElevation
          disableRipple
          onClick={() => setOpenTambahan(true)}
          sx={{ color: "#E06F2C", textTransform: "none", fontSize: "13px", fontFamily: "poppins", ":hover": { backgroundColor: "transparent" }, padding: 0, fontWeight: "bold" }}
        >
          + Tambahan
        </Button>
      </Box>

      {/* Summary */}
      <Box sx={{ px: 2, py: 1.5, backgroundColor: "#FAFAFB", borderTop: "0.5px solid #F0F0F0", display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontFamily: "poppins", fontSize: 13, color: "#6D6F75" }}>Subtotal</Typography>
          <Typography sx={{ fontFamily: "poppins", fontSize: 13, fontWeight: "bold", color: "#12141E" }}>Rp {formattedSubtotal}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontFamily: "poppins", fontSize: 13, color: "#6D6F75" }}>Discount</Typography>
          <Typography sx={{ fontFamily: "poppins", fontSize: 13, fontWeight: "bold", color: "#E06F2C" }}>- Rp {formattedDiscount}</Typography>
        </Box>
        <Box sx={{ height: "1px", backgroundColor: "#EBEBEB", my: 0.5 }} />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontFamily: "poppins", fontSize: 14, fontWeight: "bold", color: "#12141E" }}>Total</Typography>
          <Typography sx={{ fontFamily: "poppins", fontSize: 14, fontWeight: "bold", color: "#12141E" }}>Rp {formattedTotal}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontFamily: "poppins", fontSize: 12, color: "#9A9B9F" }}>Total Lusin</Typography>
          <Typography sx={{ fontFamily: "poppins", fontSize: 12, color: "#9A9B9F" }}>{decimalToFraction(lusin)}</Typography>
        </Box>
      </Box>

      {/* Checkout button */}
      <Box sx={{ px: 2, pb: 3, pt: 1.5, backgroundColor: "#fff" }}>
        <Button
          onClick={() => openDialogCheckout()}
          fullWidth
          variant="contained"
          disableElevation
          sx={{
            backgroundColor: cartItemCount === 0 || !defaultCustomer?.ownerName || !defaultCustomer?.merchantName ? "#E0E0E0" : "#E06F2C",
            ":hover": { backgroundColor: cartItemCount === 0 || !defaultCustomer?.ownerName || !defaultCustomer?.merchantName ? "#E0E0E0" : "#c95f1f" },
            height: 52,
            borderRadius: "26px",
            textTransform: "none",
            fontFamily: "poppins",
            fontSize: 15,
            fontWeight: "bold",
          }}
        >
          {!defaultCustomer?.ownerName ? "Pilih customer dulu" : cartItemCount === 0 ? "Keranjang kosong" : "Checkout Sekarang"}
        </Button>
      </Box>
    </Box>
  );

  // ─── Mobile FAB (floating cart bar) ──────────────────────────────────────────
  const mobileFAB = (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: "#fff",
        borderTop: "0.5px solid #F0F0F0",
        px: 2,
        pt: 1.5,
        pb: 2.5,
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box sx={{ flex: 1 }}>
        {cartItemCount === 0 ? (
          <Typography sx={{ fontFamily: "poppins", fontSize: 13, color: "#9A9B9F" }}>Belum ada produk</Typography>
        ) : (
          <>
            <Typography sx={{ fontFamily: "poppins", fontSize: 11, color: "#9A9B9F" }}>{cartItemCount} jenis produk</Typography>
            <Typography sx={{ fontFamily: "poppins", fontSize: 15, fontWeight: "bold", color: "#12141E" }}>Rp {formattedTotal}</Typography>
          </>
        )}
      </Box>
      <Button
        onClick={() => setOpenDrawer(true)}
        variant="contained"
        disableElevation
        startIcon={<ShoppingCartIcon />}
        sx={{
          backgroundColor: "#E06F2C",
          ":hover": { backgroundColor: "#c95f1f" },
          borderRadius: "24px",
          px: 2.5,
          height: 48,
          textTransform: "none",
          fontFamily: "poppins",
          fontSize: 13,
          fontWeight: "bold",
          flexShrink: 0,
        }}
      >
        Pesanan
        {cartItemCount > 0 && (
          <Box
            sx={{
              ml: 1,
              backgroundColor: "#fff",
              color: "#E06F2C",
              borderRadius: "50%",
              width: 20,
              height: 20,
              fontSize: 11,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {cartItemCount}
          </Box>
        )}
      </Button>
    </Box>
  );

  return (
    <Grid
      container
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        height: isMobile ? "100dvh" : "100vh",
        overflow: "hidden",
      }}
    >
      {/* ── LEFT / MAIN AREA ── */}
      <Grid
        item
        sx={{
          pr: isMobile ? 0 : 5,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
        }}
        xs={isMobile ? 12 : 9}
      >
        {/* NavBar: di mobile compact, di PC tetap */}
        {!isMobile && <NavBar />}

        {/* Mobile header */}
        {isMobile && (
          <Box
            sx={{
              backgroundColor: "#fff",
              px: 2,
              pt: 2,
              pb: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "0.5px solid #F0F0F0",
              flexShrink: 0,
            }}
          >
            <Box>
               <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open navigation menu"
            aria-controls={isMenuOpen ? 'nav-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={isMenuOpen ? 'true' : undefined}
            onClick={handleMenuOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

              <Menu
            id="nav-menu"
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'start' }}
            transformOrigin={{ vertical: 'top', horizontal: 'start' }}
          >
              <MenuItem
                key={"home"}
                to={"/"}
                  onClick={() => {
              navigate("/");
            }}
              >
                Pemesanan
              </MenuItem>
                      <MenuItem
                key={"customer"}
                to={"/customer"}
  onClick={() => {
              navigate("/customer");
            }}              >
                Pelanggan
              </MenuItem> 
                          <MenuItem
                key={"history"}
                to={"/history"}
  onClick={() => {
              navigate("/history");
            }}              >
                Transaksi
              </MenuItem> 
                              <MenuItem
                key={"settings"}
                to={"/settings"}
  onClick={() => {
              navigate("/settings");
            }}              >
                Pengaturan
              </MenuItem> 
              
     
          </Menu> 
              <Typography sx={{ fontFamily: "poppins", fontSize: 16, fontWeight: "bold", color: "#12141E" }}>Pemesanan</Typography>
              <Typography sx={{ fontFamily: "nunito", fontSize: 11, color: "#6D6F75" }}>Kecap Elang Dua</Typography>
            </Box>
            <MobileNavRight />
          </Box>
        )}

        {/* Category bar */}
        <Box
          sx={{
            backgroundColor: isMobile ? "#fff" : "transparent",
            display: "flex",
            gap: isMobile ? 1 : 1.5,
            overflowX: "auto",
            px: isMobile ? 2 : 0,
            py: isMobile ? 1.5 : 0,
            mt: isMobile ? 0 : 3,
            flexShrink: 0,
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <ButtonCategory id={null} value={category} img={semuaProduk} label={"Semua Produk"} setCategory={setCategory} />
          <ButtonCategory id={"C1"} value={category} img={kecapAsin} label={"Kecap Asin"} setCategory={setCategory} />
          <ButtonCategory id={"C2"} value={category} img={kecapManis} label={"Kecap Manis"} setCategory={setCategory} />
          <ButtonCategory id={"C3"} value={category} img={cuka} label={"Cuka"} setCategory={setCategory} />
          <ButtonCategory id={"C4"} value={category} img={kecapIkan} label={"Kecap Ikan"} setCategory={setCategory} />
          <ButtonCategory id={"C5"} value={category} img={spritus} label={"Spritus"} setCategory={setCategory} />
          <ButtonCategory id={"C6"} value={category} img={jerigen} label={"Jerigen"} setCategory={setCategory} />
        </Box>

        {/* Section header */}
        <Box
          sx={{
            px: isMobile ? 2 : 0,
            py: isMobile ? 1 : 0,
            mt: isMobile ? 0 : 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Typography sx={{ fontFamily: "poppins", fontSize: isMobile ? 14 : 28, fontWeight: "bold", color: "#12141E" }}>{PRODUCT_CATEGORY[category]}</Typography>
          <Typography sx={{ fontFamily: "nunito", fontSize: isMobile ? 12 : 18, fontWeight: "semibold", color: "#6D6F75" }}>{total} jenis produk</Typography>
        </Box>

        {/* Product grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(2, minmax(0, 1fr))",
            alignContent: "start",
            gap: isMobile ? "10px" : "20px",
            px: isMobile ? 2 : 0,
            mt: isMobile ? 1 : 3,
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
            flex: "1 1 0",
            minHeight: 0,
            pb: isMobile ? "80px" : 0,
            ...style.scroll,
          }}
        >
          {product.map((prod, idx) => (
            <ProductCard
              key={prod?.id}
              label={prod?.label}
              img={prod?.img}
              price={prod?.price}
              qty={prod?.qty}
              cartQty={cart[prod?.id]?.productQty ?? 0}
              bonusQty={listCart[`B${prod?.id}`]?.productQty ?? 0}
              add={() => add(idx, prod?.id)}
              write={(qty) => edit(qty, prod?.id)}
              subtract={() => subtract(prod?.id)}
            />
          ))}
        </Box>
      </Grid>

      {/* ── RIGHT / CART PANEL ── */}
      {isMobile ? (
        <>
          {mobileFAB}
          <Drawer anchor="bottom" open={openDrawer} onClose={() => setOpenDrawer(false)} PaperProps={{ sx: { borderRadius: "20px 20px 0 0" } }}>
            {mobileBottomSheet}
          </Drawer>
        </>
      ) : (
        drawerCheckout
      )}

      <DialogTambahan open={openTambahan} handleToggle={() => setOpenTambahan((prev) => !prev)} />
      <DialogSelectCustomer open={openCustomer} handleToggle={() => setOpenCustomer((prev) => !prev)} />
      <DialogSuccess open={transactionSuccess} handleToggle={() => dispatch(setOpenSuccess(false))} />
      <DialogFailed open={transactionFailed?.isOpen} message={transactionFailed?.message} handleToggle={() => dispatch(setOpenFailed({ isOpen: false, message: "" }))} />
      <DialogConfirmation open={openCheckout} handleToggle={() => setOpenCheckout((prev) => !prev)} label={"Yakin Ingin Memproses Pesanan"} save={() => checkOut()}>
        <Grid sx={{ display: "flex", alignItems: "center", flexDirection: "column", marginTop: -2, marginBottom: 2 }}>
          <Typography sx={{ fontFamily: "poppins", fontSize: isMobile ? 18 : 22, fontWeight: "medium", color: "#12141E" }}>
            {defaultCustomer?.ownerName !== "-" ? defaultCustomer?.ownerName : ""}
            {defaultCustomer?.ownerName !== "-" && defaultCustomer?.merchantName !== "-" ? ", " : ""}
            {defaultCustomer?.merchantName !== "-" ? defaultCustomer?.merchantName : ""}
          </Typography>
          <Typography align="center" sx={{ fontFamily: "poppins", fontSize: isMobile ? 16 : 20, color: "#12141E" }}>
            Diskon {Label_Size?.besar}: {discount?.besar} Diskon {Label_Size?.kecil}: {discount?.kecil} Diskon {Label_Size?.meja}: {discount?.meja}
          </Typography>
        </Grid>
      </DialogConfirmation>
    </Grid>
  );
}

// ─── Helper: mobile nav right (admin info) ────────────────────────────────────
function MobileNavRight() {
  const name = useSelector((state) => state.sidenav.name);
  const role = useSelector((state) => state.sidenav.role);
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ textAlign: "right" }}>
        <Typography sx={{ fontFamily: "poppins", fontSize: 12, fontWeight: "bold", color: "#12141E" }}>{name}</Typography>
        <Typography sx={{ fontFamily: "poppins", fontSize: 10, color: "#6D6F75" }}>{role}</Typography>
      </Box>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: "#FFF6F0",
          border: "1.5px solid #E06F2C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontFamily: "poppins", fontSize: 14, fontWeight: "bold", color: "#E06F2C" }}>{name?.charAt(0)?.toUpperCase() ?? "A"}</Typography>
      </Box>
    </Box>
  );
}
