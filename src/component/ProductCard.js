import { Button, Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { formattedNumber } from "../utils/stingFormatted";

export default function ProductCard({ label, img, price, cartQty, add = () => {}, subtract = () => {} }) {
  const formattedValue = formattedNumber(price);
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
            <Typography sx={{ fontFamily: "poppins", fontWeight: "bold", fontSize: "24px", color: "#12141E" }}>{cartQty}</Typography>
            <IconButton sx={{ width: "50px", height: "50px" }} onClick={add}>
              <AddCircleIcon sx={{ color: "#E06F2C", width: "50px", height: "50px" }} />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
