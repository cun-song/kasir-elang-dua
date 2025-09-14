import React, { useEffect } from "react";
import { Box, Button, DialogActions, DialogContent, Grid, Typography, TextField, MenuItem, IconButton, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DISCOUNT_LIST, Label_Size, QTY_LIST } from "../constant/Home";
import StyledDialog from "./StyledDialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBonusData as setbonusD, setDiskon as setDiskonD } from "../redux/cartReducer";
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
export default function DialogTambahan({ open = false, handleToggle }) {
  const [bonusData, setBonusData] = useState([{ productID: null, label: null, qty: null }]);
  const [diskon, setDiskon] = useState({ besar: 0, kecil: 0, meja: 0 });
  const [listProduct, setListProduct] = useState([]);
  const dispatch = useDispatch();

  const product = useSelector((state) => state.product.allProduct);
  const savedBonusData = useSelector((state) => state.cart.bonusData);
  const savedDiskon = useSelector((state) => state.cart.diskon);
  const isMobile = useMediaQuery("(max-width: 600px)");

  function addBonus() {
    const updatedBonusData = [...bonusData, { productID: null, label: null, qty: null }];
    setBonusData(updatedBonusData);
  }
  function removeBonus(indexToRemove) {
    let updatedBonusData = bonusData.filter((_, index) => index !== indexToRemove);

    if (bonusData.length === 1) {
      updatedBonusData = [{ productID: null, label: null, qty: null }];
    } else {
      updatedBonusData = bonusData.filter((_, index) => index !== indexToRemove);
    }
    setBonusData(updatedBonusData);
  }
  function onChangeProductBonus(index, id) {
    const label = listProduct.find((product) => product.value === id)?.label;
    const updatedArray = [...bonusData];
    updatedArray[index] = {
      ...updatedArray[index],
      productID: id,
      label: label,
    };
    setBonusData(updatedArray);
  }
  function onChangeQtyBonus(index, data) {
    const updatedArray = [...bonusData];
    updatedArray[index] = {
      ...updatedArray[index],
      qty: data,
    };
    setBonusData(updatedArray);
  }
  function onChangeBesar(data) {
    const temp = { ...diskon, besar: data };
    setDiskon(temp);
  }
  function onChangeKecil(data) {
    const temp = { ...diskon, kecil: data };
    setDiskon(temp);
  }
  function onChangeMeja(data) {
    const temp = { ...diskon, meja: data };
    setDiskon(temp);
  }
  function save() {
    const filteredArray = bonusData.filter((item) => {
      return Object.values(item).every((value) => value !== null);
    });
    dispatch(setbonusD(filteredArray));
    dispatch(setDiskonD(diskon));
    handleToggle();
  }

  useEffect(() => {
    const productList = product.map((p) => ({
      value: p.id,
      label: p.label,
    }));
    setListProduct(productList);
  }, [product]);

  useEffect(() => {
    if (open) {
      setBonusData(savedBonusData?.length === 0 ? [{ productID: null, label: null, qty: null }] : savedBonusData);
      setDiskon(savedDiskon);
    }
  }, [open]);

  return (
    <StyledDialog isOpen={open} handleToggle={handleToggle} useCloseBtn width="30%" title="Diskon">
      <DialogContent>
        <Grid>
          <Grid item display={"flex"} gap={3}>
            <Grid item>
              <Typography sx={style.labelBotol} mb={1}>
                Botol {Label_Size?.besar}
              </Typography>

              <TextField id="select-besar" select sx={{ width: isMobile ? "120px" : "180px" }} value={diskon?.besar} onChange={(e) => onChangeBesar(e.target.value)}>
                {DISCOUNT_LIST.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item>
              <Typography sx={style.labelBotol} mb={1}>
                Botol {Label_Size?.kecil}
              </Typography>
              <TextField id="select-kecil" select sx={{ width: isMobile ? "120px" : "180px" }} value={diskon?.kecil} onChange={(e) => onChangeKecil(e.target.value)}>
                {DISCOUNT_LIST.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid item mt={2}>
            <Grid item>
              <Typography sx={style.labelBotol} mb={1}>
                Botol {Label_Size?.meja}
              </Typography>
              <TextField id="select-meja" select sx={{ width: isMobile ? "120px" : "180px" }} value={diskon?.meja} onChange={(e) => onChangeMeja(e.target.value)}>
                {DISCOUNT_LIST.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid item mt={2}>
            <Typography sx={style.title}>Bonus</Typography>
          </Grid>
          {bonusData.map((data, index) => (
            <Grid item container gap={2} mt={2}>
              <TextField
                id="select-product"
                SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: "340px" } } } }}
                select
                sx={{ width: isMobile ? "45%" : "60%" }}
                value={data?.productID}
                onChange={(e) => onChangeProductBonus(index, e.target.value)}
              >
                {listProduct.map((item, index) => {
                  return bonusData.filter((bd) => bd?.productID === item.value).length < 1 ? (
                    <MenuItem value={item?.value} key={index}>
                      {item.label}
                    </MenuItem>
                  ) : data?.productID !== item?.value ? (
                    <></>
                  ) : (
                    <MenuItem value={data?.productID} key={index}>
                      {data?.label}
                    </MenuItem>
                  );
                })}
              </TextField>
              <TextField id="select-qty" select sx={{ width: isMobile ? "25%" : "13%" }} value={data?.qty} onChange={(e) => onChangeQtyBonus(index, e.target.value)}>
                {QTY_LIST.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <IconButton onClick={() => removeBonus(index)} sx={{ width: "50px", height: "50px", ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}>
                <CloseIcon />
              </IconButton>
            </Grid>
          ))}

          <Button
            onClick={() => addBonus()}
            disableElevation
            disableRipple
            sx={{ mt: 2, color: "#707278", textTransform: "none", fontSize: "16px", fontFamily: "poppins", ":hover": { backgroundColor: "transparent", color: "#12141E" }, padding: 0, textAlign: "start" }}
          >
            + tambah
          </Button>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid item container justifyContent={"center"} mb={2}>
          <Button onClick={() => save()} sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, width: "40%", height: "66px", borderRadius: "30px", textTransform: "none" }} variant="contained">
            Simpan
          </Button>
        </Grid>
      </DialogActions>
    </StyledDialog>
  );
}
