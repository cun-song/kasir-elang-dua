import React, { useEffect } from "react";
import { Box, DialogActions, DialogContent, Button, Grid, Typography, useMediaQuery } from "@mui/material";
import StyledDialog from "./StyledDialog";
import { useState } from "react";
import StyledTable from "./StyledTable";
import { convertTimestamp, decimalToFraction, formattedNumber } from "../utils/stingFormatted";
import Invoice from "./Invoice";
import { useDispatch } from "react-redux";
import { pushToPrintQueue } from "../redux/action/transactionAction";
import { setLoading } from "../redux/sidenavReducer";
import { Label_Size } from "../constant/Home";

const center = {
  headerAlign: "center",
  align: "center",
};
const HEADER = [
  {
    field: "id",
    headerName: "Id",
    ...center,
    flex: 1,
  },
  {
    field: "label",
    headerName: "Produk",
    ...center,
    flex: 3,
  },
  {
    field: "size",
    headerName: "Ukuran",
    ...center,
    flex: 2,
    renderCell: (size) => {
      return (
        <Box sx={{ width: "67px", height: "26px", borderRadius: "8px", backgroundColor: `#${size?.value === "Besar" ? "F5EFEF" : size?.value === "Kecil" ? "FFB3B3" : "bae1ff"}`, textAlign: "center", lineHeight: "26px" }}>
          {Label_Size?.[size?.value?.toLowerCase()]}
        </Box>
      );
    },
  },
  {
    field: "productQty",
    headerName: "Jumlah",
    ...center,
    renderCell: (num) => {
      return `${decimalToFraction(num?.value)}`;
    },
    flex: 2,
  },
  {
    field: "type",
    headerName: "Jenis",
    ...center,
    flex: 2,
  },
  {
    field: "price",
    headerName: "Harga",
    ...center,
    flex: 2,
    renderCell: (bonus) => {
      return bonus?.value === 0 ? <Box sx={{ width: "67px", height: "26px", borderRadius: "8px", backgroundColor: "#FFAC7B", textAlign: "center", lineHeight: "26px" }}>Bonus</Box> : <>{`Rp ${formattedNumber(bonus?.value)}`}</>;
    },
  },
  {
    field: "discount",
    headerName: "Diskon",
    ...center,
    flex: 2,
    renderCell: (disc) => {
      return <>{`Rp ${formattedNumber(disc?.value)}`}</>;
    },
  },
  {
    field: "subtotal",
    headerName: "Subtotal",
    ...center,
    flex: 3,
    renderCell: (subtotal) => {
      return <>{`Rp ${formattedNumber(subtotal?.value)}`}</>;
    },
  },
];

export default function DialogTable({ open = false, handleToggle, data, customer, time, idTransaction, adminName }) {
  const [page, setPage] = useState(0);
  const [currRowsPerPage, setCurrRowsPerPage] = useState(5);
  const totalQty = Object.values(data).reduce((acc, item) => acc + item?.totalLusin * item?.productQty, 0);
  const total = Object.values(data).reduce((acc, item) => acc + item?.productQty * item?.price, 0);
  const disc = Object.values(data).reduce((acc, item) => acc + item?.productQty * item?.discount, 0);
  const formattedTotal = formattedNumber(total);
  const formattedDiscount = formattedNumber(disc);
  const formattedGrandTotal = formattedNumber(total - disc);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const dispatch = useDispatch();

  const style = {
    textCheckout: { fontFamily: "poppins", fontSize: isMobile ? "14px" : "16px", fontWeight: "medium", color: "#12141E" },
    grandTotal: { fontFamily: "poppins", fontSize: isMobile ? "16px" : "20px", fontWeight: "bold", color: "#12141E" },
  };
  function printStruk() {
    const printData = {
      adminName: adminName,
      discount: customer?.discount,
      id: idTransaction,
      lusin: totalQty,
      merchantName: customer?.merchantName || "",
      ownerName: customer?.ownerName || "",
      product: data,
      subtotal: total,
      totalDisc: disc,
    };
    dispatch(setLoading());
    dispatch(pushToPrintQueue(printData));
  }
  return (
    <StyledDialog isOpen={open} handleToggle={handleToggle} useCloseBtn width="80%" title="Detail Transaksi">
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ display: isMobile ? "block" : "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography sx={style.textCheckout}>No Invoice : {idTransaction}</Typography>
            <Typography sx={style.textCheckout}>Admin : {adminName}</Typography>
          </Box>
          <Typography sx={style.textCheckout}>Waktu : {convertTimestamp(time)}</Typography>
        </Box>
        <StyledTable headers={HEADER} rows={data} page={page} setPage={(e) => setPage(e)} pageSize={currRowsPerPage} setPageSizeChange={(e) => setCurrRowsPerPage(e)} rowCount={data?.length} paginationMode="client" />
        <Grid sx={{ display: isMobile ? "block" : "flex", width: "100%", mt: 4, px: isMobile ? 0 : 2, alignItems: "flex-end" }}>
          <Grid item width={isMobile ? "100%" : "75%"} sx={{ display: "flex" }}>
            <Grid item>
              <Typography sx={style.textCheckout}>Nama Pelanggan</Typography>
              <Typography sx={style.textCheckout}>Nama Toko</Typography>
              <Typography sx={style.textCheckout}>Daerah</Typography>
              <Typography sx={style.textCheckout}>Alamat</Typography>
            </Grid>
            <Grid item sx={{ ml: isMobile ? 1 : 2 }}>
              <Typography sx={style.textCheckout}>:</Typography>
              <Typography sx={style.textCheckout}>:</Typography>
              <Typography sx={style.textCheckout}>:</Typography>
              <Typography sx={style.textCheckout}>:</Typography>
            </Grid>
            <Grid item sx={{ ml: isMobile ? 1 : 4 }}>
              <Typography sx={style.textCheckout}>{customer?.ownerName}</Typography>
              <Typography sx={style.textCheckout}>{customer?.merchantName}</Typography>
              <Typography sx={style.textCheckout}>{customer?.area}</Typography>
              <Typography sx={style.textCheckout}>{customer?.address}</Typography>
            </Grid>
          </Grid>
          <Grid item xs={6} width={isMobile ? "100%" : "25%"} mt={isMobile ? 2 : 0}>
            <Grid item sx={{ display: "flex", justifyContent: "space-between" }}>
              <Grid item>
                <Typography sx={style.textCheckout}>Total</Typography>
                <Typography sx={style.textCheckout}>Diskon</Typography>
              </Grid>
              <Grid item sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <Typography sx={style.textCheckout}>Rp {formattedTotal}</Typography>
                <Typography sx={style.textCheckout}>Rp {formattedDiscount}</Typography>
              </Grid>
            </Grid>
            <Grid item sx={{ mt: 1, display: "flex", justifyContent: "space-between", gap: 5, borderTop: "2px solid #FFAC7B" }}>
              <Typography sx={style.grandTotal}>Grand Total</Typography>
              <Typography sx={style.grandTotal}>Rp {formattedGrandTotal}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ mt: 4 }} container justifyContent={isMobile ? "center" : "flex-start"}>
          {isMobile ? (
            <Button
              onClick={() => printStruk()}
              sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, width: "120px", height: "36px", borderRadius: "24px", textTransform: "none", fontSize: "14px" }}
              variant="contained"
            >
              Print Struk
            </Button>
          ) : (
            <Invoice transaction={data} customer={customer} total={formattedTotal} grandTotal={formattedGrandTotal} discount={formattedDiscount} totalQty={totalQty} idTransaction={idTransaction} adminName={adminName} />
          )}
        </Grid>
      </DialogContent>
      <DialogActions></DialogActions>
    </StyledDialog>
  );
}
