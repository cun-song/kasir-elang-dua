import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography, DialogActions, DialogContent, TextField, MenuItem, IconButton } from "@mui/material";
import NavBar from "../component/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { click, setLoading, setTitle } from "../redux/sidenavReducer";
import semuaProduk from "../img/semuaProduk.png";
import kecapAsin from "../img/kecapAsin.png";
import kecapManis from "../img/kecapManis.png";
import kecapIkan from "../img/kecapIkan.png";
import cuka from "../img/cuka.png";
import spritus from "../img/spritus.png";
import ButtonCategory from "../component/ButtonCategory";
import { PRODUCT_CATEGORY } from "../constant/Home";
import CloseIcon from "@mui/icons-material/Close";
import { fetchProductData, pushProduct, updateProduct } from "../redux/action/productAction";
import ProductCardEdit from "../component/ProductCardEdit";
import { PRODUCT_CATEGORY_SELECT, PRODUCT_SIZE_SELECT, PRODUCT_TYPE_SELECT, TOTAL_LUSIN_SELECT } from "../constant/Product";
import DialogSuccess from "../component/DialogSuccess";
import DialogFailed from "../component/DialogFailed";
import { setOpenSuccessProduct, setOpenFailedProduct } from "../redux/productReducer";

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
  textCheckout: { fontFamily: "poppins", fontSize: "16px", fontWeight: "medium", color: "#12141E" },
  title: { fontFamily: "poppins", fontSize: "28px", fontWeight: "bold", color: "#12141E" },
  labelBotol: { fontFamily: "nunito", fontSize: "16px", fontWeight: "medium", color: "#828282" },
};

export default function Product() {
  const dispatch = useDispatch();
  const [category, setCategory] = useState(null);
  const [product, setProduct] = useState([]);
  const [total, setTotal] = useState(0);
  const [editing, setEditing] = useState(false);
  const [sideTitle, setSideTitle] = useState("");
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState(null);
  const [productSize, setProductSize] = useState(null);
  const [productType, setProductType] = useState(null);
  const [productQty, setProductQty] = useState(0);
  const [productPrice, setProductPrice] = useState(0);
  const [productTotalLusin, setProductTotalLusin] = useState(0);
  const [productId, setProductId] = useState(null);

  const allProduct = useSelector((state) => state.product.allProduct);
  const productSuccess = useSelector((state) => state?.product?.openSuccessProduct);
  const productFailed = useSelector((state) => state?.product?.openFailedProduct);
  const refresh = useSelector((state) => state?.product?.resetProduct);

  function edit(product) {
    setProductName(product?.label);
    setProductCategory(product?.categoryID);
    setProductSize(product?.size);
    setProductType(product?.type);
    setProductQty(product?.qty);
    setProductPrice(product?.price);
    setProductId(product?.id);
    setProductTotalLusin(product?.totalLusin);
    setSideTitle("Edit Produk");
    setEditing(true);
  }
  function add() {
    setSideTitle("Tambah Produk");
    setEditing(true);
  }
  function cancel() {
    reset();
  }
  function reset() {
    setSideTitle("");
    setEditing(false);
    setProductId(null);
    setProductName("");
    setProductSize(null);
    setProductType(null);
    setProductCategory(null);
    setProductTotalLusin(null);
    setProductPrice(0);
    setProductQty(0);
  }
  function save() {
    if (productName !== "" && productCategory !== null && productSize !== null && productQty !== 0 && productPrice !== 0 && productType !== null && productTotalLusin !== null) {
      const temp = {
        id: productId,
        categoryID: productCategory,
        label: productName,
        price: productPrice,
        qty: productQty,
        size: productSize,
        type: productType,
        totalLusin: productTotalLusin,
      };
      dispatch(setLoading());

      dispatch(productId === null ? pushProduct(temp) : updateProduct(temp));
    }
  }
  useEffect(() => {
    if (productSuccess) {
      reset();
      dispatch(fetchProductData());
    }
  }, [refresh]);

  useEffect(() => {
    dispatch(click(1));
    dispatch(setTitle("Produk"));
    dispatch(fetchProductData());
  }, []);
  useEffect(() => {
    setProduct(allProduct);
    setTotal(allProduct?.length);
  }, [allProduct]);

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

  return (
    <Grid container sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between", height: "100vh" }}>
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
            <ProductCardEdit product={product} edit={(e) => edit(e)} disabled={editing} />
          ))}
        </Grid>
      </Grid>
      <Grid item sx={{ backgroundColor: "#FFFFFF", height: "100%", p: 3 }} xs={3}>
        {editing === false ? (
          <Grid item container justifyContent={"center"} alignItems={"center"} sx={{ height: "100%" }}>
            <Button onClick={() => add()} sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, width: "80%", height: "66px", borderRadius: "30px", textTransform: "none" }} variant="contained">
              Tambah Produk
            </Button>
          </Grid>
        ) : (
          <Grid>
            <Grid item>
              <Typography sx={{ fontFamily: "poppins", fontSize: 28, fontWeight: "bold", color: "#12141E" }}>{sideTitle}</Typography>
            </Grid>
            <Grid item mt={2}>
              <Typography sx={style.labelBotol} mb={1}>
                Nama
              </Typography>
              <Grid item container gap={2}>
                <TextField id="productName" sx={{ width: "80%" }} value={productName} onChange={(e) => setProductName(e.target.value)} />
                <IconButton onClick={() => setProductName("")} sx={{ width: "50px", height: "50px", ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item mt={2}>
              <Typography sx={style.labelBotol} mb={1}>
                Kategori
              </Typography>
              <Grid item container gap={2}>
                <TextField id="select-category" select sx={{ width: "80%" }} value={productCategory} onChange={(e) => setProductCategory(e.target.value)}>
                  {PRODUCT_CATEGORY_SELECT.map((item, index) => (
                    <MenuItem value={item?.value} key={index}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
                <IconButton onClick={() => setProductCategory(null)} sx={{ width: "50px", height: "50px", ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item mt={2}>
              <Typography sx={style.labelBotol} mb={1}>
                Ukuran
              </Typography>
              <Grid item container gap={2}>
                <TextField id="select-category" select sx={{ width: "80%" }} value={productSize} onChange={(e) => setProductSize(e.target.value)}>
                  {PRODUCT_SIZE_SELECT.map((item, index) => (
                    <MenuItem value={item?.value} key={index}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
                <IconButton onClick={() => setProductSize(null)} sx={{ width: "50px", height: "50px", ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item mt={2}>
              <Typography sx={style.labelBotol} mb={1}>
                Jenis
              </Typography>
              <Grid item container gap={2}>
                <TextField id="select-category" select sx={{ width: "80%" }} value={productType} onChange={(e) => setProductType(e.target.value)}>
                  {PRODUCT_TYPE_SELECT.map((item, index) => (
                    <MenuItem value={item?.value} key={index}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
                <IconButton onClick={() => setProductType(null)} sx={{ width: "50px", height: "50px", ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item mt={2}>
              <Typography sx={style.labelBotol} mb={1}>
                Jumlah Lusin
              </Typography>
              <Grid item container gap={2}>
                <TextField id="select-total-lusin" select sx={{ width: "80%" }} value={productTotalLusin} onChange={(e) => setProductTotalLusin(e.target.value)}>
                  {TOTAL_LUSIN_SELECT.map((item, index) => (
                    <MenuItem value={item?.value} key={index}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
                <IconButton onClick={() => setProductTotalLusin(null)} sx={{ width: "50px", height: "50px", ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item mt={2}>
              <Typography sx={style.labelBotol} mb={1}>
                Jumlah
              </Typography>
              <Grid item container gap={2}>
                <TextField
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                  type="number"
                  id="productQty"
                  sx={{ width: "80%" }}
                  value={productQty}
                  onChange={(e) => setProductQty(e.target.value)}
                />
                <IconButton onClick={() => setProductQty(0)} sx={{ width: "50px", height: "50px", ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item mt={2}>
              <Typography sx={style.labelBotol} mb={1}>
                Harga
              </Typography>
              <Grid item container gap={2}>
                <TextField
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                  type="number"
                  id="productPrice"
                  sx={{ width: "80%" }}
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
                <IconButton onClick={() => setProductPrice(0)} sx={{ width: "50px", height: "50px", ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Grid item container justifyContent={"space-between"} sx={{ mt: 8 }}>
              <Button
                onClick={() => cancel()}
                sx={{ borderColor: "#E06F2C", color: "#E06F2C", ":hover": { backgroundColor: "#E06F2C", color: "white", borderColor: "white" }, width: "45%", height: "56px", borderRadius: "30px", textTransform: "none" }}
                variant="outlined"
              >
                Batal
              </Button>
              <Button onClick={() => save()} sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, width: "45%", height: "56px", borderRadius: "30px", textTransform: "none" }} variant="contained">
                Simpan
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
      <DialogSuccess open={productSuccess} handleToggle={() => dispatch(setOpenSuccessProduct(false))} message="Data Product Berhasil Disimpan!!" />
      <DialogFailed open={productFailed?.isOpen} handleToggle={() => dispatch(setOpenFailedProduct({ isOpen: false, message: "" }))} message={productFailed?.message} />
    </Grid>
  );
}
