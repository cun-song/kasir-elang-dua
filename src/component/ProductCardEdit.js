import { Button, Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import { formattedNumber } from "../utils/stingFormatted";

export default function ProductCardEdit({ product, disabled = false, edit = () => {} }) {
  const formattedValue = formattedNumber(product?.price);
  return (
    <Grid container alignItems={"center"} sx={{ backgroundColor: "#FFFFFF", p: 3, width: "48%", height: "15%", borderRadius: 4 }} gap={3}>
      <Grid item width={"40%"} height={"210px"}>
        <img src={product?.img} alt={product?.label} width={"100%"} height={"100%"} style={{ objectFit: "contain" }} />
      </Grid>
      <Grid item width={"55%"} height={"100%"}>
        <Grid item marginBottom={3}>
          <Typography sx={{ fontFamily: "poppins", fontSize: 20, fontWeight: "bold", color: "#12141E" }}>{product?.label}</Typography>
          <Typography sx={{ fontFamily: "nunito", fontSize: 16, fontWeight: "semibold", color: "#6D6F75" }}>Rp {formattedValue}</Typography>
        </Grid>

        <Grid item container justifyContent={"center"}>
          <Button
            disabled={disabled}
            sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, width: "220px", height: "66px", borderRadius: "30px", textTransform: "none" }}
            variant="contained"
            onClick={() => edit(product)}
          >
            Edit
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
