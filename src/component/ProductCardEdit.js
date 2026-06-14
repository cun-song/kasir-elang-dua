import { Button, Grid, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { formattedNumber } from "../utils/stingFormatted";

export default function ProductCardEdit({ product, disabled = false, edit = () => {} }) {
  const formattedValue = formattedNumber(product?.price);
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <Grid
      container
      wrap="nowrap"
      sx={{
        backgroundColor: "#FFFFFF",
        p: isMobile ? 1.25 : 1.5,
        width: "100%",
        height: isMobile ? "160px" : "180px",
        borderRadius: 3,
        gap: 1.25,
        flexShrink: 0,
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: "0px 4px 16px rgba(18, 20, 30, 0.06)",
        },
      }}
    >
      {/* Left: image fills card height */}
      <Grid
        item
        sx={{
          height: "100%",
          width: isMobile ? "110px" : "135px",
          flexShrink: 0,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img src={product?.img} alt={product?.label} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8px" }} />
      </Grid>

      {/* Right: label on top, price/stok + button below */}
      <Grid item container direction="column" justifyContent="space-around" sx={{ flex: 1, minWidth: 0, height: "100%", py: 0.5 }}>
        <Grid item>
          <Typography
            sx={{
              fontFamily: "poppins",
              fontSize: isMobile ? 14 : 24,
              fontWeight: "bold",
              color: "#12141E",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.35,
            }}
          >
            {product?.label}
          </Typography>
        </Grid>

        <Grid item container alignItems={"center"} justifyContent={"space-between"} wrap="nowrap" sx={{ gap: 1 }}>
          <Grid item sx={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 0.25 }}>
            <Typography noWrap sx={{ fontFamily: "nunito", fontSize: isMobile ? 13 : 18, fontWeight: "semibold", color: "#6D6F75" }}>
              Rp {formattedValue}
            </Typography>
            <Typography noWrap sx={{ fontFamily: "nunito", fontSize: isMobile ? 12 : 16, fontWeight: "semibold", color: "#9A9B9F" }}>
              Stok: {product?.qty}
            </Typography>
          </Grid>

          <Grid item sx={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
            <Button
              disabled={disabled}
              sx={{
                backgroundColor: "#E06F2C",
                ":hover": { backgroundColor: "#c95f1f" },
                minWidth: isMobile ? "64px" : "160px",
                height: isMobile ? "36px" : "50px",
                borderRadius: "24px",
                textTransform: "none",
                fontFamily: "poppins",
                fontSize: isMobile ? 12 : 13,
                fontWeight: "medium",
                px: 1.5,
              }}
              variant="contained"
              onClick={() => edit(product)}
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
