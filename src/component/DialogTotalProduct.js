import React, { useEffect } from "react";
import { Box, DialogActions, DialogContent, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import StyledDialog from "./StyledDialog";
import { useState } from "react";
import StyledTable from "./StyledTable";
import { convertTimestamp, decimalToFraction, formattedNumber } from "../utils/stingFormatted";
const center = {
  headerAlign: "center",
  align: "center",
};
const HEADER = [
  {
    field: "label",
    headerName: "Produk",
    ...center,
    flex: 3,
  },
  {
    field: "total",
    headerName: "Jumlah",
    ...center,
    flex: 1,
    renderCell: (num) => {
      return `${decimalToFraction(num?.value)}`;
    },
  },
  {
    field: "type",
    headerName: "Jenis",
    ...center,
    flex: 1,
  },
];

export default function DialogTotalProduct({ open = false, handleToggle, data, children }) {
  const [page, setPage] = useState(0);
  const [currRowsPerPage, setCurrRowsPerPage] = useState(20);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const style = {
    textCheckout: { fontFamily: "poppins", fontSize: isMobile ? "14px" : "20px", fontWeight: "medium", color: "#12141E" },
    grandTotal: { fontFamily: "poppins", fontSize: isMobile ? "14px" : "20px", fontWeight: "bold", color: "#12141E" },
  };
  return (
    <StyledDialog isOpen={open} handleToggle={handleToggle} useCloseBtn width="40%" title="Total Pesanan">
      <DialogContent sx={{ mt: 2 }}>
        <StyledTable headers={HEADER} rows={data?.data} page={page} setPage={(e) => setPage(e)} pageSize={currRowsPerPage} setPageSizeChange={(e) => setCurrRowsPerPage(e)} rowCount={data?.length} paginationMode="client" />
        <Grid sx={{ display: "flex", width: "100%", mt: 3, justifyContent: "space-between" }}>
          <Grid sx={{ display: "flex", gap: isMobile ? 0 : 2 }}>
            <Typography sx={style.grandTotal}>Total Lusin:</Typography>
            <Typography sx={style.textCheckout}>{decimalToFraction(data?.totalLusin)} Lusin</Typography>
          </Grid>
          <Grid sx={{ display: "flex", gap: isMobile ? 0 : 2 }}>
            <Typography sx={style.grandTotal}>Total Gen:</Typography>
            <Typography sx={style.textCheckout}>{decimalToFraction(data?.totalGen)} Gen</Typography>
          </Grid>
          <Grid sx={{ display: "flex", gap: isMobile ? 0 : 2 }}>
            <Typography sx={style.grandTotal}>Total Dus:</Typography>
            <Typography sx={style.textCheckout}>{decimalToFraction(data?.totalDus)} Dus</Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center", mb: 2 }}>{children}</DialogActions>
    </StyledDialog>
  );
}
