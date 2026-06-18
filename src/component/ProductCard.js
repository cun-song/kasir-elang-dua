import { Button, Grid, IconButton, TextField, Typography, Box, useMediaQuery } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { formattedNumber } from "../utils/stingFormatted";

export default function ProductCard({ label, img, price, qty, cartQty, bonusQty, add = () => {}, subtract = () => {}, write = () => {} }) {
  const formattedValue = formattedNumber(price);
  const [tempQty, setTempQty] = useState(cartQty);
  const [refresh, setRefresh] = useState(true);
  const tempQtyRef = useRef(tempQty);
  const ref = useRef();
  const isMobile = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
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
    if (isNaN(num)) return 0;
    const roundedNum = Math.round(num * 2) / 2;
    return roundedNum > qty ? qty : roundedNum;
  }

  function writing(value) {
    const regex = /^[0-9]*\.?[0-9]*$/;
    if (regex.test(value)) {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        if (parsed + bonusQty > qty) {
          setTempQty(qty - bonusQty);
        } else {
          setTempQty(value);
        }
      } else {
        setTempQty(value);
      }
    }
  }

  // ─── PC layout (tidak diubah) ─────────────────────────────────────────────
  if (!isMobile) {
    return (
      <Grid
        container
        wrap="nowrap"
        sx={{
          backgroundColor: "#FFFFFF",
          p: 1.5,
          width: "100%",
          height: "180px",
          borderRadius: 3,
          gap: 1.25,
          flexShrink: 0,
          transition: "box-shadow 0.2s ease",
          "&:hover": { boxShadow: "0px 4px 16px rgba(18, 20, 30, 0.06)" },
        }}
      >
        <Grid
          item
          sx={{
            height: "100%",
            width: "135px",
            flexShrink: 0,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <img src={img} alt={label} style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8px" }} />
        </Grid>
        <Grid item container direction="column" justifyContent="space-around" sx={{ flex: 1, minWidth: 0, height: "100%", py: 0.5 }}>
          <Grid item>
            <Typography
              sx={{
                fontFamily: "poppins",
                fontSize: 24,
                fontWeight: "bold",
                color: "#12141E",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.35,
              }}
            >
              {label}
            </Typography>
          </Grid>
          <Grid item container alignItems={"center"} justifyContent={"space-between"} wrap="nowrap" sx={{ gap: 1 }}>
            <Grid item sx={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 0.25 }}>
              <Typography noWrap sx={{ fontFamily: "nunito", fontSize: 18, fontWeight: "semibold", color: "#6D6F75" }}>
                Rp {formattedValue}
              </Typography>
              <Typography noWrap sx={{ fontFamily: "nunito", fontSize: 16, fontWeight: "semibold", color: "#9A9B9F" }}>
                Stok: {qty}
              </Typography>
            </Grid>
            <Grid item sx={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              {cartQty === 0 ? (
                <Button
                  sx={{
                    backgroundColor: "#E06F2C",
                    ":hover": { backgroundColor: "#c95f1f" },
                    minWidth: "160px",
                    height: "50px",
                    borderRadius: "24px",
                    textTransform: "none",
                    fontFamily: "poppins",
                    fontSize: 13,
                    fontWeight: "medium",
                    px: 1.5,
                  }}
                  variant="contained"
                  onClick={add}
                >
                  Tambah
                </Button>
              ) : (
                <Grid
                  item
                  container
                  alignItems={"center"}
                  wrap="nowrap"
                  sx={{
                    width: "180px",
                    height: "50px",
                    justifyContent: "space-between",
                    backgroundColor: "#FFF6F0",
                    borderRadius: "10px",
                    px: 0.25,
                  }}
                >
                  <IconButton sx={{ width: "50px", height: "50px" }} onClick={subtract}>
                    <RemoveCircleIcon sx={{ color: "#E06F2C", fontSize: "36px" }} />
                  </IconButton>
                  <TextField
                    sx={{ width: "72px" }}
                    onChange={(e) => writing(e.target.value)}
                    inputProps={{
                      inputMode: "decimal",
                      pattern: "[0-9]*\\.?[0-9]*",
                      sx: { fontFamily: "poppins", fontWeight: "bold", fontSize: "24px", color: "#12141E", textAlign: "center", padding: "2px 0" },
                    }}
                    inputRef={ref}
                    id="standard-basic"
                    variant="standard"
                    value={tempQty}
                    size="small"
                  />
                  <IconButton
                    sx={{ width: "50px", height: "50px" }}
                    onClick={() => {
                      if (cartQty + bonusQty < qty) add();
                    }}
                  >
                    <AddCircleIcon sx={{ color: "#E06F2C", fontSize: "36px" }} />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  // ─── Mobile layout: vertikal, gambar atas, info bawah ────────────────────
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "14px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "240px",
        transition: "box-shadow 0.2s ease",
        "&:hover": { boxShadow: "0px 2px 12px rgba(18, 20, 30, 0.08)" },
      }}
    >
      {/* Gambar */}
      <Box
        sx={{
          width: "100%",
          height: "100px",
          backgroundColor: "#F7F7F9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img src={img} alt={label} style={{ width: "80%", height: "80%", objectFit: "contain" }} />
      </Box>

      {/* Info */}
      <Box sx={{ p: "10px", display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
        {/* Label */}
        <Typography
          sx={{
            fontFamily: "poppins",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#12141E",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.4,
            minHeight: "33px",
          }}
        >
          {label}
        </Typography>

        {/* Harga & stok */}
        <Box>
          <Typography sx={{ fontFamily: "nunito", fontSize: "11px", fontWeight: "700", color: "#6D6F75" }}>Rp {formattedValue}</Typography>
          <Typography sx={{ fontFamily: "nunito", fontSize: "10px", color: "#B0B1B5" }}>Stok: {qty}</Typography>
        </Box>

        {/* Tombol */}
        {cartQty === 0 ? (
          <Button
            onClick={add}
            variant="contained"
            disableElevation
            sx={{
              backgroundColor: "#E06F2C",
              ":hover": { backgroundColor: "#c95f1f" },
              borderRadius: "20px",
              height: "42px",
              textTransform: "none",
              fontFamily: "poppins",
              fontSize: "11px",
              fontWeight: "bold",
              mt: "auto",
            }}
          >
            Tambah
          </Button>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#FFF6F0",
              borderRadius: "10px",
              px: "4px",
              height: "42px",
              mt: "auto",
            }}
          >
            <IconButton sx={{ width: "38px", height: "38px", p: 0 }} onClick={subtract}>
              <RemoveCircleIcon sx={{ color: "#E06F2C", fontSize: "30px" }} />
            </IconButton>
            <TextField
              sx={{ width: "56px" }}
              onChange={(e) => writing(e.target.value)}
              inputProps={{
                inputMode: "decimal",
                pattern: "[0-9]*\\.?[0-9]*",
                sx: {
                  fontFamily: "poppins",
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: "#12141E",
                  textAlign: "center",
                  padding: "0px",
                },
              }}
              inputRef={ref}
              variant="standard"
              value={tempQty}
              size="small"
            />
            <IconButton
              sx={{ width: "38px", height: "38px", p: 0 }}
              onClick={() => {
                if (cartQty + bonusQty < qty) add();
              }}
            >
              <AddCircleIcon sx={{ color: "#E06F2C", fontSize: "30px" }} />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  );
}
