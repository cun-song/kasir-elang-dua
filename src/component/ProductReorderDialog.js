import React, { useEffect, useState } from "react";
import { Button, DialogActions, DialogContent, Grid, IconButton, Typography } from "@mui/material";
import StyledDialog from "./StyledDialog";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useDispatch } from "react-redux";
import { updateProductOrder } from "../redux/action/productAction";
import { setLoading } from "../redux/sidenavReducer";

export default function ProductReorderDialog({ open, handleToggle, products = [] }) {
  const dispatch = useDispatch();
  const [order, setOrder] = useState([]);

  // Inisialisasi urutan setiap kali dialog dibuka, berdasarkan index ascending
  useEffect(() => {
    if (open) {
      const sorted = [...products].sort((a, b) => (a?.index ?? 0) - (b?.index ?? 0));
      setOrder(sorted);
    }
  }, [open, products]);

  function moveUp(idx) {
    if (idx === 0) return;
    setOrder((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }

  function moveDown(idx) {
    if (idx === order.length - 1) return;
    setOrder((prev) => {
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }

  function save() {
    dispatch(setLoading());
    dispatch(updateProductOrder(order));
    handleToggle();
  }

  return (
    <StyledDialog isOpen={open} handleToggle={handleToggle} useCloseBtn width="500px" title="Atur Urutan Produk">
      <DialogContent sx={{ mt: 2 }}>
        <Grid container direction="row" gap={1} sx={{ maxHeight: "60vh", overflowX: "auto" }}>
          {order.map((p, idx) => (
            <Grid
              key={p?.id ?? idx}
              container
              alignItems="center"
              justifyContent="space-between"
              wrap="nowrap"
              sx={{
                backgroundColor: "#F8F8F8",
                borderRadius: "12px",
                p: 1.25,
                gap: 1,
              }}
            >
              <Grid item sx={{ width: "32px", textAlign: "center" }}>
                <Typography sx={{ fontFamily: "nunito", fontSize: 14, fontWeight: "bold", color: "#828282" }}>{idx + 1}</Typography>
              </Grid>

              <Grid
                item
                sx={{
                  width: "44px",
                  height: "44px",
                  flexShrink: 0,
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {p?.img ? <img src={p.img} alt={p?.label} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : null}
              </Grid>

              <Grid item sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ fontFamily: "poppins", fontSize: 14, fontWeight: "medium", color: "#12141E" }}>
                  {p?.label}
                </Typography>
              </Grid>

              <Grid item sx={{ display: "flex", gap: 0.5 }}>
                <IconButton size="small" onClick={() => moveUp(idx)} disabled={idx === 0}>
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => moveDown(idx)} disabled={idx === order.length - 1}>
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={() => handleToggle()}
          sx={{
            borderColor: "#E06F2C",
            color: "#E06F2C",
            ":hover": { backgroundColor: "#E06F2C", color: "white", borderColor: "white" },
            width: "120px",
            height: "44px",
            borderRadius: "24px",
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
            width: "120px",
            height: "44px",
            borderRadius: "24px",
            textTransform: "none",
          }}
          variant="contained"
        >
          Simpan
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
