import React, { useEffect, useRef, useState } from "react";
import { Box, Button, DialogActions, DialogContent, Grid, Typography, useMediaQuery } from "@mui/material";
import StyledDialog from "./StyledDialog";
import StyledTable from "./StyledTable";
import { convertTimestampDate, formattedNumber } from "../utils/stingFormatted";
import { useDispatch, useSelector } from "react-redux";
import { deleteReturan } from "../redux/action/returanAction";
import { setLoading } from "../redux/sidenavReducer";
import DialogConfirmation from "./DialogConfirmation";
import { ReturanInvoice } from "../utils/PrintReturanInvoice";
import { RETUR_TYPE_SELECT } from "../constant/Returan";

const center = {
  headerAlign: "center",
  align: "center",
};

const DETAIL_HEADER = [
  { field: "no", headerName: "No", ...center, flex: 0.5 },
  { field: "label", headerName: "Nama Barang", ...center, flex: 3 },
  { field: "qty", headerName: "Qty", ...center, flex: 1 },
  { field: "type", headerName: "Satuan", ...center, flex: 1 },
  {
    field: "unitPrice",
    headerName: "Harga (Rp)",
    ...center,
    flex: 1.5,
    renderCell: (params) => `Rp ${formattedNumber(Math.round(params?.value || 0))}`,
  },
  {
    field: "returnValue",
    headerName: "Nilai Retur (Rp)",
    ...center,
    flex: 1.5,
    renderCell: (params) => `Rp ${formattedNumber(Math.round(params?.value || 0))}`,
  },
  { field: "remark", headerName: "Keterangan", ...center, flex: 2 },
];

export default function DialogReturanDetail({ open = false, handleToggle, data }) {
  const [page, setPage] = useState(0);
  const [currRowsPerPage, setCurrRowsPerPage] = useState(5);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const dispatch = useDispatch();
  const role = useSelector((state) => state?.sidenav?.role);
  const refresh = useSelector((state) => state?.returan?.resetReturan);
  const success = useSelector((state) => state?.returan?.openSuccessReturan);

  useEffect(() => {
    if (success) {
      setOpenConfirmation(false);
    }
  }, [refresh]);

  if (!data) return null;

  const items = (data.items || []).map((item, index) => ({
    id: item.productId + "-" + index,
    no: index + 1,
    ...item,
  }));

  const customer = {
    ownerName: data.ownerName,
    merchantName: data.merchantName,
  };

  const textStyle = { fontFamily: "poppins", fontSize: isMobile ? "14px" : "16px", fontWeight: "medium", color: "#12141E" };
  const grandTotalStyle = { fontFamily: "poppins", fontSize: isMobile ? "16px" : "20px", fontWeight: "bold", color: "#12141E" };

  return (
    <>
      <StyledDialog isOpen={open} handleToggle={handleToggle} useCloseBtn width="75%" title="Detail Returan">
        <DialogContent sx={{ mt: 2 }}>
          {/* Header info */}
          <Box sx={{ display: isMobile ? "block" : "flex", justifyContent: "space-between", mb: 2 }}>
            <Box>
              <Typography sx={textStyle}>No Returan : {data.id}</Typography>
              <Typography sx={textStyle}>Tanggal Retur : {convertTimestampDate(data.returnDate)}</Typography>
              <Typography sx={textStyle}>Admin : {data.adminName}</Typography>
            </Box>
            <Box sx={{ mt: isMobile ? 1 : 0 }}>
              <Typography sx={textStyle}>Customer : {customer.ownerName !== "-" ? customer.ownerName : ""}{customer.ownerName !== "-" && customer.merchantName !== "-" ? ", " : ""}{customer.merchantName !== "-" ? customer.merchantName : ""}</Typography>
              <Typography sx={textStyle}>Alasan : {data.returnReason}</Typography>
              <Typography sx={textStyle}>Status : {data.isSent ? "Sudah Dikirim" : "Belum Dikirim"}</Typography>
            </Box>
          </Box>

          {/* Items table */}
          <StyledTable
            headers={DETAIL_HEADER}
            rows={items}
            page={page}
            setPage={(e) => setPage(e)}
            pageSize={currRowsPerPage}
            setPageSizeChange={(e) => setCurrRowsPerPage(e)}
            rowCount={items.length}
            paginationMode="client"
          />

          {/* Summary */}
          <Grid sx={{ display: isMobile ? "block" : "flex", width: "100%", mt: 4, px: isMobile ? 0 : 2, alignItems: "flex-start" }}>
            <Grid item width={isMobile ? "100%" : "60%"} sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 2, alignItems: "stretch" }}>
              {/* Status Retur Box */}
              <Box sx={{ p: 1.5, border: "1.5px solid #F0E4D4", borderRadius: "10px", bgcolor: "#FEF9F4", width: isMobile ? "100%" : "220px", flexShrink: 0 }}>
                <Typography sx={{ fontFamily: "poppins", fontSize: "12px", fontWeight: "bold", color: "#12141E", mb: 0.5 }}>
                  Status Retur
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.25 }}>
                  <Typography sx={{ fontSize: "15px", color: data.statusRetur === "tukar-barang" ? "#E06F2C" : "#9E9E9E", display: "flex" }}>
                    {data.statusRetur === "tukar-barang" ? "☑" : "☐"}
                  </Typography>
                  <Typography sx={{ fontFamily: "poppins", fontSize: "12px", color: data.statusRetur === "tukar-barang" ? "#12141E" : "#555", fontWeight: data.statusRetur === "tukar-barang" ? "600" : "normal" }}>
                    Tukar Barang
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 0.25 }}>
                  <Typography sx={{ fontSize: "15px", color: data.statusRetur === "potong-tagihan" ? "#E06F2C" : "#9E9E9E", display: "flex" }}>
                    {data.statusRetur === "potong-tagihan" ? "☑" : "☐"}
                  </Typography>
                  <Typography sx={{ fontFamily: "poppins", fontSize: "12px", color: data.statusRetur === "potong-tagihan" ? "#12141E" : "#555", fontWeight: data.statusRetur === "potong-tagihan" ? "600" : "normal" }}>
                    Potong Tagihan
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                  <Typography sx={{ fontSize: "15px", color: (data.statusRetur === "refund-dana" || data.statusRetur === "refund") ? "#E06F2C" : "#9E9E9E", display: "flex" }}>
                    {(data.statusRetur === "refund-dana" || data.statusRetur === "refund") ? "☑" : "☐"}
                  </Typography>
                  <Typography sx={{ fontFamily: "poppins", fontSize: "12px", color: (data.statusRetur === "refund-dana" || data.statusRetur === "refund") ? "#12141E" : "#555", fontWeight: (data.statusRetur === "refund-dana" || data.statusRetur === "refund") ? "600" : "normal" }}>
                    Refund Dana
                  </Typography>
                </Box>
              </Box>

              {data.notes && (
                <Box sx={{ p: 1.5, border: "1.5px solid #F0E4D4", borderRadius: "10px", bgcolor: "#FEF9F4", width: isMobile ? "100%" : "220px", flexShrink: 0 }}>
                  <Typography sx={{ fontFamily: "poppins", fontSize: "12px", fontWeight: "bold", color: "#12141E", mb: 0.5 }}>Catatan :</Typography>
                  <Typography sx={{ fontFamily: "poppins", fontSize: "12px", color: "#555", wordBreak: "break-word" }}>{data.notes}</Typography>
                </Box>
              )}
            </Grid>
            <Grid item xs={6} width={isMobile ? "100%" : "40%"} mt={isMobile ? 2 : 0}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={textStyle}>Total Qty</Typography>
                <Typography sx={textStyle}>{data.totalQty}</Typography>
              </Box>
              <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between", gap: 5, borderTop: "2px solid #FFAC7B", pt: 1 }}>
                <Typography sx={grandTotalStyle}>Total Nilai Returan</Typography>
                <Typography sx={grandTotalStyle}>Rp {formattedNumber(Math.round(data.totalReturnValue))}</Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Actions */}
          <Grid sx={{ mt: 4, px: isMobile ? 0 : 2 }} container justifyContent={isMobile ? "center" : "space-between"} gap={2}>
            <Grid width={isMobile ? "100%" : "55%"}>
              <ReturanInvoice data={data} onBeforePrint={handleToggle} />
            </Grid>
            {role === "Super Admin" && (
              <Button
                onClick={() => setOpenConfirmation(true)}
                sx={{ backgroundColor: "#FF0E0E", ":hover": { backgroundColor: "#d40000" }, width: "120px", height: "36px", borderRadius: "6px", textTransform: "none" }}
                variant="contained"
              >
                Hapus
              </Button>
            )}
          </Grid>
        </DialogContent>
        <DialogActions></DialogActions>
      </StyledDialog>

      <DialogConfirmation
        open={openConfirmation}
        handleToggle={() => setOpenConfirmation((prev) => !prev)}
        label={`Yakin ingin menghapus Returan ${data.id} ?`}
        save={() => {
          dispatch(setLoading());
          dispatch(deleteReturan(data.id));
        }}
      />
    </>
  );
}
