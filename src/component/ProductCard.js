import { Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { formattedNumber } from "../utils/stingFormatted";

export default function ProductCard({ label, img, price, cartQty, add = () => {}, subtract = () => {}, write = () => {} }) {
  const formattedValue = formattedNumber(price);
  const [tempQty, setTempQty] = useState(cartQty);
  const [refresh, setRefresh] = useState(true);
  const tempQtyRef = useRef(tempQty);
  const ref = useRef();
  useEffect(() => {
    // Update the ref with the latest tempQty whenever it changes
    tempQtyRef.current = tempQty;
  }, [tempQty]);
  useEffect(() => {
    const handleBlur = () => {
      setRefresh((p) => !p);
    };

    const inputElement = ref.current;

    if (inputElement) {
      inputElement.addEventListener("blur", handleBlur);
    }
    return () => {
      if (inputElement) {
        inputElement.removeEventListener("blur", handleBlur);
      }
    };
  }, [cartQty]);

  useEffect(() => {
    setTempQty(cartQty);
  }, [cartQty]);
  useEffect(() => {
    write(roundToNearestHalf(tempQtyRef.current));
  }, [refresh]);
  function roundToNearestHalf(value) {
    if (value === "") return 0;
    const num = parseFloat(value);

    const roundedNum = Math.round(num * 2) / 2;

    return roundedNum;
  }
  function writing(qty) {
    const regex = /^[0-9]*\.?[0-9]*$/; // Regular expression to match 0-9 and a single period
    if (regex.test(qty)) {
      setTempQty(qty);
    }
  }

  return (
    <Grid container alignItems={"center"} sx={{ backgroundColor: "#FFFFFF", p: 3, width: "48%", height: "15%", borderRadius: 4 }} gap={3}>
      <Grid item width={"40%"} height={"210px"}>
        <img src={img} alt={label} width={"100%"} height={"100%"} style={{ objectFit: "contain" }} />
      </Grid>
      <Grid item width={"55%"} height={"100%"}>
        <Grid item marginBottom={3}>
          <Typography sx={{ fontFamily: "poppins", fontSize: 20, fontWeight: "bold", color: "#12141E" }}>{label}</Typography>
          <Typography sx={{ fontFamily: "nunito", fontSize: 16, fontWeight: "semibold", color: "#6D6F75" }}>Rp {formattedValue}</Typography>
        </Grid>
        {cartQty === 0 ? (
          <Grid item container justifyContent={"center"}>
            <Button sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, width: "220px", height: "66px", borderRadius: "30px", textTransform: "none" }} variant="contained" onClick={add}>
              Tambah
            </Button>
          </Grid>
        ) : (
          <Grid item container alignItems={"center"} sx={{ width: "160px", height: "66px", justifyContent: "space-between" }}>
            <IconButton sx={{ width: "50px", height: "50px" }} onClick={subtract}>
              <RemoveCircleIcon sx={{ color: "#E06F2C", width: "50px", height: "50px" }} />
            </IconButton>
            <TextField
              sx={{ width: "60px" }}
              onChange={(e) => writing(e.target.value)}
              inputProps={{
                inputMode: "decimal",
                pattern: "[0-9]*\\.?[0-9]*",
                sx: {
                  fontFamily: "poppins",
                  fontWeight: "bold",
                  fontSize: "24px",
                  color: "#12141E",
                  textAlign: "center",
                },
              }}
              inputRef={ref}
              id="standard-basic"
              variant="standard"
              value={tempQty}
              size="small"
            />
            {/* <Typography >{cartQty}</Typography> */}
            <IconButton sx={{ width: "50px", height: "50px" }} onClick={add}>
              <AddCircleIcon sx={{ color: "#E06F2C", width: "50px", height: "50px" }} />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
