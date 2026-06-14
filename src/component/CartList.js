import { Grid, Typography, Box, IconButton } from "@mui/material";
import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { formattedNumber } from "../utils/stingFormatted";
import { Label_Size } from "../constant/Home";

export default function CartList({ img, label, size, qty, price, remove = () => {} }) {
  const formattedValue = formattedNumber(qty * price);

  const sizeColor = size === "Besar" ? "#F5EFEF" : size === "Kecil" ? "#FFB3B3" : "#BAE1FF";

  return (
    <Grid
      item
      container
      alignItems={"flex-start"}
      wrap="nowrap"
      sx={{
        width: "100%",
        backgroundColor: "#FAFAFB",
        borderRadius: 3,
        p: 1.5,
        gap: 1.5,
        position: "relative",
      }}
    >
      {/* Image */}
      <Grid
        item
        sx={{
          width: "60px",
          height: "60px",
          flexShrink: 0,
          borderRadius: 2,
          backgroundColor: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img src={img} alt={label} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }} />
      </Grid>

      {/* Info */}
      <Grid item sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 0.75 }}>
        <Typography
          sx={{
            fontFamily: "poppins",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#12141E",
            pr: 3,
            lineHeight: 1.35,
            wordBreak: "break-word",
          }}
        >
          {label}
        </Typography>
        <Grid item container alignItems={"center"} justifyContent={"space-between"} wrap="nowrap" sx={{ gap: 1 }}>
          <Grid item sx={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
            <Typography sx={{ fontFamily: "poppins", fontSize: "18px", fontWeight: "bold", color: "#12141E" }}>x{qty}</Typography>
            <Box
              sx={{
                height: "24px",
                px: 1,
                borderRadius: "6px",
                backgroundColor: sizeColor,
                color: "#704332",
                textAlign: "center",
                fontSize: "11px",
                fontFamily: "poppins",
                fontWeight: "medium",
                lineHeight: "24px",
                whiteSpace: "nowrap",
              }}
            >
              {Label_Size?.[size?.toLowerCase()]}
            </Box>
          </Grid>

          <Grid item sx={{ flexShrink: 0, textAlign: "right" }}>
            <Typography
              sx={{
                fontFamily: "poppins",
                fontSize: "15px",
                fontWeight: "semibold",
                color: price === 0 ? "#E06F2C" : "#707278",
                whiteSpace: "nowrap",
              }}
            >
              {price === 0 ? "Bonus" : `Rp ${formattedValue}`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      {/* Remove button */}
      <IconButton sx={{ position: "absolute", top: 6, right: 6, width: "22px", height: "22px" }} onClick={remove}>
        <CancelIcon fontSize="small" sx={{ color: "#F24E1E", fontSize: "18px" }} />
      </IconButton>
    </Grid>
  );
}
