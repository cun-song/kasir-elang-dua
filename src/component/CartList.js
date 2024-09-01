import { Grid, Typography, Box, IconButton } from "@mui/material";
import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { formattedNumber } from "../utils/stingFormatted";

export default function CartList({ img, label, size, qty, price, remove = () => {} }) {
  const formattedValue = formattedNumber(qty * price);

  return (
    <Grid item sx={{ height: "100px", width: "100%", display: "flex", justifyContent: "space-between" }}>
      <Grid item width={"25%"} height={"100%"}>
        <img src={img} alt={label} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </Grid>
      <Grid item sx={{ width: "72%", display: "flex", flexDirection: "column", justifyContent: "start", gap: 1 }}>
        <Grid item sx={{ display: "flex", justifyContent: "end" }}>
          <IconButton sx={{ width: "20px", height: "20px" }} onClick={remove}>
            <CancelIcon fontSize="small" sx={{ color: "#F24E1E" }} />
          </IconButton>
        </Grid>

        <Typography sx={{ fontFamily: "poppins", fontSize: "16px", fontWeight: "semibold", color: "#12141E" }}>{label}</Typography>
        <Grid item sx={{ display: "flex", justifyContent: "space-between" }}>
          <Grid item sx={{ display: "flex", width: "50%", justifyContent: "space-between" }}>
            <Typography sx={{ fontFamily: "poppins", fontSize: "18px", fontWeight: "bold", color: "#12141E" }}>x {qty}</Typography>
            <Box
              sx={{
                width: "67px",
                height: "26px",
                borderRadius: "8px",
                backgroundColor: `#${size === "Besar" ? "F5EFEF" : size === "Kecil" ? "FFB3B3" : "bae1ff"}`,
                color: "#704332",
                textAlign: "center",
                fontSize: "10px",
                fontFamily: "poppins",
                lineHeight: "26px",
              }}
            >
              {size}
            </Box>
          </Grid>
          <Grid item>
            <Typography sx={{ fontFamily: "poppins", fontSize: "16px", fontWeight: "semibold", color: "#707278" }}>{price === 0 ? "Bonus" : `Rp ${formattedValue}`}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
