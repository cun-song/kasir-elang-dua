import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography, TextField, MenuItem, IconButton } from "@mui/material";
import NavBar from "../component/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/sidenavReducer";
import semuaProduk from "../img/semuaProduk.png";
import kecapAsin from "../img/kecapAsin.png";
import kecapManis from "../img/kecapManis.png";
import kecapIkan from "../img/kecapIkan.png";
import cuka from "../img/cuka.png";
import spritus from "../img/spritus.png";
import jerigen from "../img/jerigen.png";
import ButtonCategory from "../component/ButtonCategory";
import { PRODUCT_CATEGORY } from "../constant/Home";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { fetchProductData, pushProduct, updateProduct } from "../redux/action/productAction";
import ProductCardEdit from "../component/ProductCardEdit";
import { PRODUCT_CATEGORY_SELECT, PRODUCT_SIZE_SELECT, PRODUCT_TYPE_SELECT, TOTAL_LUSIN_SELECT } from "../constant/Product";
import DialogSuccess from "../component/DialogSuccess";
import DialogFailed from "../component/DialogFailed";
import { setOpenSuccessProduct, setOpenFailedProduct } from "../redux/productReducer";
import ProductReorderDialog from "../component/ProductReorderDialog";
import SwapVertIcon from "@mui/icons-material/SwapVert";

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
  title: { fontFamily: "poppins", fontSize: "28px", fontWeight: "bold", color: "#12141E" },
  labelBotol: { fontFamily: "nunito", fontSize: "16px", fontWeight: "medium", color: "#828282" },
};

export default function Product() {
  const dispatch = useDispatch();

  // ── Category & list state ──────────────────────────────────────────────
  const [category, setCategory] = useState(null);
  const [product, setProduct] = useState([]);
  const [total, setTotal] = useState(0);

  // ── Form state ─────────────────────────────────────────────────────────
  const [editing, setEditing] = useState(false);
  const [sideTitle, setSideTitle] = useState("");
  const [productId, setProductId] = useState(null);
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState(null);
  const [productSize, setProductSize] = useState(null);
  const [productType, setProductType] = useState(null);
  const [productQty, setProductQty] = useState(0);
  const [productPrice, setProductPrice] = useState(0);
  const [productTotalLusin, setProductTotalLusin] = useState(0);
  const [openReorder, setOpenReorder] = useState(false);

  // ── Image state ────────────────────────────────────────────────────────
  // productImage      → File object (gambar baru yang dipilih user)
  // productImagePreview → URL sementara untuk preview di UI
  // productImageExisting → URL Firebase Storage yang sudah tersimpan (edit mode)
  const [productImage, setProductImage] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);
  const [productImageExisting, setProductImageExisting] = useState("");

  // ── Redux selectors ────────────────────────────────────────────────────
  const allProduct = useSelector((state) => state.product.allProduct);
  const productSuccess = useSelector((state) => state?.product?.openSuccessProduct);
  const productFailed = useSelector((state) => state?.product?.openFailedProduct);
  const refresh = useSelector((state) => state?.product?.resetProduct);

  // ── Helpers ────────────────────────────────────────────────────────────
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
    // reset image
    setProductImage(null);
    setProductImagePreview(null);
    setProductImageExisting("");
  }

  function edit(p) {
    setProductName(p?.label);
    setProductCategory(p?.categoryID);
    setProductSize(p?.size);
    setProductType(p?.type);
    setProductQty(p?.qty);
    setProductPrice(p?.price);
    setProductId(p?.id);
    setProductTotalLusin(p?.totalLusin);
    setSideTitle("Edit Produk");
    setEditing(true);
    // pre-fill gambar dari Firebase (jika ada)
    setProductImageExisting(p?.img ?? "");
    setProductImagePreview(p?.img ?? null);
    setProductImage(null);
  }

  function add() {
    setSideTitle("Tambah Produk");
    setEditing(true);
  }

  function cancel() {
    reset();
  }

  // Handler pilih file gambar
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setProductImage(file);
    // Buat URL preview lokal
    setProductImagePreview(URL.createObjectURL(file));
  }

  // Hapus gambar (preview & existing)
  function handleRemoveImage() {
    setProductImage(null);
    setProductImagePreview(null);
    setProductImageExisting("");
  }

  function save() {
    const isValid = productName !== "" && productCategory !== null && productSize !== null && productQty !== 0 && productPrice !== 0 && productType !== null && productTotalLusin !== null;

    if (isValid) {
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

      if (productId === null) {
        // TAMBAH — kirim File (bisa null jika tidak pilih gambar)
        dispatch(pushProduct(temp, productImage));
      } else {
        // UPDATE — kirim img existing + File baru (bisa null)
        dispatch(updateProduct({ ...temp, img: productImageExisting }, productImage));
      }
    }
  }

  // ── Effects ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (productSuccess) {
      reset();
      dispatch(fetchProductData());
    }
  }, [refresh]);

  useEffect(() => {
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
    } else if (category === "C6") {
      filteredProducts = allProduct.filter((product) => product.type === "Gen");
    } else {
      filteredProducts = allProduct.filter((product) => product.categoryID === category);
    }
    setProduct(filteredProducts);
    setTotal(filteredProducts.length);
  }, [category]);

  // ── Render ─────────────────────────────────────────────────────────────
  const iconBtnSx = {
    width: "50px",
    height: "50px",
    ":hover": { backgroundColor: "transparent" },
    ":active": { backgroundColor: "transparent" },
  };

  return (
    <Grid container sx={{ width: "100%", display: "flex", justifyContent: "space-between", height: "100vh" }}>
      {/* ── Left panel ── */}
      <Grid item sx={{ pr: 5, height: "100%" }} xs={9}>
        <NavBar />

        {/* Category buttons */}
        <Grid
          container
          mt={3}
          wrap="nowrap"
          sx={{
            gap: 1.5,
            overflowX: "auto",
            pb: 1,
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
        </Grid>

        {/* Title & count */}
        <Grid container justifyContent={"space-between"} alignItems={"center"} mt={3}>
          <Grid item>
            <Typography sx={{ fontFamily: "poppins", fontSize: 28, fontWeight: "bold", color: "#12141E" }}>{PRODUCT_CATEGORY[category]}</Typography>
          </Grid>
          <Grid item sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography sx={{ fontFamily: "nunito", fontSize: 18, fontWeight: "semibold", color: "#6D6F75" }}>{total} jenis produk</Typography>
            <Button
              startIcon={<SwapVertIcon />}
              onClick={() => setOpenReorder(true)}
              sx={{
                borderColor: "#E06F2C",
                color: "#E06F2C",
                ":hover": { backgroundColor: "#E06F2C", color: "white", borderColor: "#E06F2C" },
                height: "40px",
                borderRadius: "20px",
                textTransform: "none",
                fontFamily: "poppins",
                fontSize: 13,
              }}
              variant="outlined"
            >
              Atur Urutan
            </Button>
          </Grid>
        </Grid>

        {/* Product grid */}
        <Grid container justifyContent={"space-between"} alignItems={"center"} mt={3} rowGap={2} overflow={"auto"} sx={{ ...style.scroll, height: "calc(100vh - 260px)" }}>
          {product.map((p, idx) => (
            <Grid item key={product?.id} sx={{ width: "calc(50% - 10px)" }}>
              <ProductCardEdit key={idx} product={p} edit={(e) => edit(e)} disabled={editing} />
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* ── Right panel ── */}
      <Grid item sx={{ backgroundColor: "#FFFFFF", height: "100%", p: 3, overflowY: "auto" }} xs={3}>
        {editing === false ? (
          <Grid item container justifyContent={"center"} alignItems={"center"} sx={{ height: "100%" }}>
            <Button
              onClick={() => add()}
              sx={{
                backgroundColor: "#E06F2C",
                ":hover": { backgroundColor: "#E06F2C" },
                width: "80%",
                height: "66px",
                borderRadius: "30px",
                textTransform: "none",
              }}
              variant="contained"
            >
              Tambah Produk
            </Button>
          </Grid>
        ) : (
          <Grid>
            {/* Title */}
            <Grid item>
              <Typography sx={style.title}>{sideTitle}</Typography>
            </Grid>

            {/* ── Upload Foto ── */}
            <Grid item mt={2}>
              <Typography sx={style.labelBotol} mb={1}>
                Foto Produk
              </Typography>

              {/* Drop zone / preview */}
              <Box
                sx={{
                  width: "80%",
                  height: 210,
                  border: "2px dashed #D9D9D9",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  backgroundColor: "#FAFAFA",
                  transition: "border-color 0.2s",
                  "&:hover": { borderColor: "#E06F2C" },
                }}
                onClick={() => document.getElementById("uploadProductImage").click()}
              >
                {productImagePreview ? (
                  <>
                    <img src={productImagePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    {/* Tombol hapus gambar */}
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation(); // jangan trigger upload klik
                        handleRemoveImage();
                      }}
                      sx={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        backgroundColor: "rgba(0,0,0,0.45)",
                        ":hover": { backgroundColor: "rgba(0,0,0,0.65)" },
                        width: 28,
                        height: 28,
                      }}
                    >
                      <CloseIcon sx={{ color: "white", fontSize: 16 }} />
                    </IconButton>
                  </>
                ) : (
                  <Box textAlign="center" sx={{ pointerEvents: "none" }}>
                    <AddPhotoAlternateIcon sx={{ color: "#D9D9D9", fontSize: 44 }} />
                    <Typography sx={{ fontFamily: "nunito", fontSize: 13, color: "#AAAAAA", mt: 0.5 }}>Klik untuk upload foto</Typography>
                  </Box>
                )}
              </Box>

              {/* Label nama file yang dipilih */}
              {productImage && <Typography sx={{ fontFamily: "nunito", fontSize: 12, color: "#828282", mt: 0.5 }}>{productImage.name}</Typography>}

              {/* Hidden file input */}
              <input
                id="uploadProductImage"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
                // Reset value agar onChange tetap trigger jika file sama dipilih ulang
                onClick={(e) => {
                  e.target.value = null;
                }}
              />
            </Grid>

            {/* ── Nama ── */}
            <Grid item mt={2}>
              <Typography sx={style.labelBotol} mb={1}>
                Nama
              </Typography>
              <Grid item container gap={2}>
                <TextField id="productName" sx={{ width: "80%" }} value={productName} onChange={(e) => setProductName(e.target.value)} />
                <IconButton onClick={() => setProductName("")} sx={iconBtnSx}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>

            {/* ── Kategori ── */}
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
                <IconButton onClick={() => setProductCategory(null)} sx={iconBtnSx}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>

            {/* ── Ukuran ── */}
            <Grid item mt={2}>
              <Typography sx={style.labelBotol} mb={1}>
                Ukuran
              </Typography>
              <Grid item container gap={2}>
                <TextField id="select-size" select sx={{ width: "80%" }} value={productSize} onChange={(e) => setProductSize(e.target.value)}>
                  {PRODUCT_SIZE_SELECT.map((item, index) => (
                    <MenuItem value={item?.value} key={index}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
                <IconButton onClick={() => setProductSize(null)} sx={iconBtnSx}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>

            {/* ── Jenis ── */}
            <Grid item mt={2}>
              <Typography sx={style.labelBotol} mb={1}>
                Jenis
              </Typography>
              <Grid item container gap={2}>
                <TextField id="select-type" select sx={{ width: "80%" }} value={productType} onChange={(e) => setProductType(e.target.value)}>
                  {PRODUCT_TYPE_SELECT.map((item, index) => (
                    <MenuItem value={item?.value} key={index}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
                <IconButton onClick={() => setProductType(null)} sx={iconBtnSx}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>

            {/* ── Jumlah Lusin ── */}
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
                <IconButton onClick={() => setProductTotalLusin(null)} sx={iconBtnSx}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>

            {/* ── Jumlah (Qty) ── */}
            <Grid item mt={2}>
              <Typography sx={style.labelBotol} mb={1}>
                Jumlah
              </Typography>
              <Grid item container gap={2}>
                <TextField InputProps={{ inputProps: { min: 0 } }} type="number" id="productQty" sx={{ width: "80%" }} value={productQty} onChange={(e) => setProductQty(e.target.value)} />
                <IconButton onClick={() => setProductQty(0)} sx={iconBtnSx}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>

            {/* ── Harga ── */}
            <Grid item mt={2}>
              <Typography sx={style.labelBotol} mb={1}>
                Harga
              </Typography>
              <Grid item container gap={2}>
                <TextField InputProps={{ inputProps: { min: 0 } }} type="number" id="productPrice" sx={{ width: "80%" }} value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
                <IconButton onClick={() => setProductPrice(0)} sx={iconBtnSx}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>

            {/* ── Action buttons ── */}
            <Grid item container justifyContent={"space-between"} sx={{ mt: 4, mb: 2 }}>
              <Button
                onClick={() => cancel()}
                sx={{
                  borderColor: "#E06F2C",
                  color: "#E06F2C",
                  ":hover": { backgroundColor: "#E06F2C", color: "white", borderColor: "white" },
                  width: "45%",
                  height: "56px",
                  borderRadius: "30px",
                  textTransform: "none",
                }}
                variant="outlined"
              >
                Batal
              </Button>
              <Button
                onClick={() => save()}
                sx={{
                  backgroundColor: "#E06F2C",
                  ":hover": { backgroundColor: "#E06F2C" },
                  width: "45%",
                  height: "56px",
                  borderRadius: "30px",
                  textTransform: "none",
                }}
                variant="contained"
              >
                Simpan
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>

      {/* ── Dialogs ── */}
      <DialogSuccess open={productSuccess} handleToggle={() => dispatch(setOpenSuccessProduct(false))} message="Data Product Berhasil Disimpan!!" />
      <DialogFailed open={productFailed?.isOpen} handleToggle={() => dispatch(setOpenFailedProduct({ isOpen: false, message: "" }))} message={productFailed?.message} />
      <ProductReorderDialog open={openReorder} handleToggle={() => setOpenReorder(false)} products={allProduct} />
    </Grid>
  );
}
