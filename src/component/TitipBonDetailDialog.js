import React, { useEffect, useState } from "react";
import { Box, Button, Checkbox, DialogActions, DialogContent, Grid, Typography, useMediaQuery } from "@mui/material";
import StyledDialog from "./StyledDialog";
import StyledTable from "./StyledTable";
import { convertTimestampDate, formattedNumber } from "../utils/stingFormatted";
import { useDispatch, useSelector } from "react-redux";
import { deleteTitipBon, markTitipBonPaid } from "../redux/action/titipBonAction";
import { setLoading } from "../redux/sidenavReducer";
import DialogConfirmation from "./DialogConfirmation";
import { TitipBonInvoice } from "../utils/PrintTitipBon";
import { TITIPBON_DETAIL_INVOICE_HEADER } from "../constant/TitipBon";

const center = {
  headerAlign: "center",
  align: "center",
};

export default function TitipBonDetailDialog({ open = false, handleToggle, data }) {
  const [page, setPage] = useState(0);
  const [currRowsPerPage, setCurrRowsPerPage] = useState(5);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openConfirmPay, setOpenConfirmPay] = useState(false);
  const [isPayMode, setIsPayMode] = useState(false);
  const [checkedInvoices, setCheckedInvoices] = useState({});
  const isMobile = useMediaQuery("(max-width: 600px)");
  const dispatch = useDispatch();
  const role = useSelector((state) => state?.sidenav?.role);
  const refresh = useSelector((state) => state?.titipBon?.resetTitipBon);
  const success = useSelector((state) => state?.titipBon?.openSuccessTitipBon);

  useEffect(() => {
    if (success) {
      setOpenConfirmDelete(false);
      setOpenConfirmPay(false);
      setIsPayMode(false);
    }
  }, [refresh]);

  // Reset pay mode when dialog opens
  useEffect(() => {
    if (open) {
      setIsPayMode(false);
      setCheckedInvoices({});
    }
  }, [open]);

  if (!data) return null;

  const isActive = data.status === "aktif";

  const invoices = (data.invoices || []).map((inv, index) => ({
    id: inv.invoiceId || `inv-${index}`,
    no: index + 1,
    ...inv,
  }));

  // Build headers with optional checkbox for pay mode
  const getHeaders = () => {
    if (!isPayMode) return TITIPBON_DETAIL_INVOICE_HEADER;

    const checkboxCol = {
      field: "check",
      headerName: "",
      ...center,
      flex: 0.5,
      minWidth: 60,
      sortable: false,
      renderCell: (params) => {
        const invoiceId = params?.row?.invoiceId;
        return (
          <Checkbox
            checked={checkedInvoices[invoiceId] !== false}
            onChange={(e) => {
              setCheckedInvoices((prev) => ({
                ...prev,
                [invoiceId]: e.target.checked,
              }));
            }}
            sx={{ color: "#E06F2C", "&.Mui-checked": { color: "#E06F2C" } }}
          />
        );
      },
    };

    return [checkboxCol, ...TITIPBON_DETAIL_INVOICE_HEADER];
  };

  function handleTandaiLunas() {
    // Auto-check all invoices
    const allChecked = {};
    invoices.forEach((inv) => {
      allChecked[inv.invoiceId] = true;
    });
    setCheckedInvoices(allChecked);
    setIsPayMode(true);
  }

  function handleConfirmPay() {
    const checked = [];
    const unchecked = [];
    invoices.forEach((inv) => {
      if (checkedInvoices[inv.invoiceId] !== false) {
        checked.push(inv.invoiceId);
      } else {
        unchecked.push(inv.invoiceId);
      }
    });

    if (checked.length === 0) return;

    dispatch(setLoading());
    dispatch(markTitipBonPaid(data.id, checked, unchecked));
  }

  function handleCancelPayMode() {
    setIsPayMode(false);
    setCheckedInvoices({});
  }

  const textStyle = { fontFamily: "poppins", fontSize: isMobile ? "14px" : "16px", fontWeight: "medium", color: "#12141E" };
  const grandTotalStyle = { fontFamily: "poppins", fontSize: isMobile ? "16px" : "20px", fontWeight: "bold", color: "#12141E" };

  // Count how many are checked
  const checkedCount = invoices.filter((inv) => checkedInvoices[inv.invoiceId] !== false).length;

  const currentGrandTotal = isPayMode
    ? invoices.reduce((sum, inv) => {
        if (checkedInvoices[inv.invoiceId] !== false) {
          return sum + (Number(inv.total) || 0);
        }
        return sum;
      }, 0)
    : data.grandTotal;

  const currentJumlahInvoice = isPayMode ? checkedCount : data.jumlahInvoice;

  return (
    <>
      <StyledDialog isOpen={open} handleToggle={handleToggle} useCloseBtn width="75%" title="Detail Titip Bon">
        <DialogContent sx={{ mt: 2 }}>
          {/* Header info */}
          <Box sx={{ display: isMobile ? "block" : "flex", justifyContent: "space-between", mb: 2 }}>
            <Box>
              <Typography sx={textStyle}>ID Titip Bon : {data.id}</Typography>
              <Typography sx={textStyle}>Tanggal Dibuat : {convertTimestampDate(data.timestamp)}</Typography>
              <Typography sx={textStyle}>Dibuat Oleh : {data.createdBy}</Typography>
            </Box>
            <Box sx={{ mt: isMobile ? 1 : 0 }}>
              <Typography sx={textStyle}>
                Customer : {data.ownerName !== "-" ? data.ownerName : ""}{data.ownerName !== "-" && data.merchantName !== "-" ? ", " : ""}{data.merchantName !== "-" ? data.merchantName : ""}
              </Typography>
              <Typography sx={textStyle}>Area : {data.area}</Typography>
              <Typography sx={textStyle}>
                Status :{" "}
                <span style={{ color: isActive ? "#E65100" : "#1b5e20", fontWeight: 600 }}>
                  {isActive ? "Aktif" : "Sudah Bayar"}
                </span>
              </Typography>
            </Box>
          </Box>

          {/* Pay mode info bar */}
          {isPayMode && (
            <Box sx={{ p: 1.5, mb: 2, bgcolor: "#FFF5EF", borderRadius: "8px", border: "1px solid #FFAC7B", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontFamily: "poppins", fontSize: "14px", color: "#E06F2C", fontWeight: 600 }}>
                Mode Tandai Lunas — Uncheck invoice yang belum dibayar ({checkedCount}/{invoices.length} dipilih)
              </Typography>
              <Button
                onClick={handleCancelPayMode}
                size="small"
                sx={{ color: "#E06F2C", textTransform: "none", fontWeight: 600 }}
              >
                Batal
              </Button>
            </Box>
          )}

          {/* Invoice table */}
          <StyledTable
            headers={getHeaders()}
            rows={invoices}
            page={page}
            setPage={(e) => setPage(e)}
            pageSize={currRowsPerPage}
            setPageSizeChange={(e) => setCurrRowsPerPage(e)}
            rowCount={invoices.length}
            paginationMode="client"
            disableRowClick={true}
          />

          {/* Summary */}
          <Grid sx={{ display: "flex", justifyContent: "flex-end", width: "100%", mt: 4, px: isMobile ? 0 : 2 }}>
            <Grid item xs={12} sm={6} md={4} width={isMobile ? "100%" : "40%"}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={textStyle}>Jumlah Invoice</Typography>
                <Typography sx={textStyle}>{currentJumlahInvoice}</Typography>
              </Box>
              <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between", gap: 5, borderTop: "2px solid #FFAC7B", pt: 1 }}>
                <Typography sx={grandTotalStyle}>Grand Total</Typography>
                <Typography sx={grandTotalStyle}>Rp {formattedNumber(Math.round(currentGrandTotal))}</Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Action buttons */}
          <Grid
            sx={{
              mt: 4,
              px: isMobile ? 0 : 2,
              position: isMobile ? "static" : "relative",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              justifyContent: isMobile ? "center" : "flex-end",
              gap: 2,
            }}
          >
            {/* Print button placed in the center on desktop, and standard flow on mobile */}
            <Box
              sx={{
                position: isMobile ? "static" : "absolute",
                left: isMobile ? "auto" : "50%",
                transform: isMobile ? "none" : "translateX(-50%)",
                width: "140px",
              }}
            >
              <TitipBonInvoice data={data} onBeforePrint={handleToggle} />
            </Box>

            {/* Other actions container */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: isMobile ? "column" : "row",
                width: isMobile ? "100%" : "auto",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isActive && !isPayMode && (
                <Button
                  onClick={handleTandaiLunas}
                  sx={{
                    backgroundColor: "#2e7d32",
                    ":hover": { backgroundColor: "#1b5e20" },
                    height: "40px",
                    borderRadius: "24px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    width: isMobile ? "100%" : "auto",
                  }}
                  variant="contained"
                >
                  Tandai Lunas
                </Button>
              )}
              {isPayMode && (
                <Button
                  onClick={() => setOpenConfirmPay(true)}
                  disabled={checkedCount === 0}
                  sx={{
                    backgroundColor: "#2e7d32",
                    ":hover": { backgroundColor: "#1b5e20" },
                    height: "40px",
                    borderRadius: "24px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    width: isMobile ? "100%" : "auto",
                    "&.Mui-disabled": { backgroundColor: "#ccc", color: "#888" },
                  }}
                  variant="contained"
                >
                  Konfirmasi Pembayaran ({checkedCount} Invoice)
                </Button>
              )}
              {role === "Super Admin" && !isPayMode && (
                <Button
                  onClick={() => setOpenConfirmDelete(true)}
                  sx={{
                    backgroundColor: "#FF0E0E",
                    ":hover": { backgroundColor: "#d40000" },
                    width: isMobile ? "100%" : "120px",
                    height: "40px",
                    borderRadius: "24px",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                  variant="contained"
                >
                  Hapus
                </Button>
              )}
            </Box>
          </Grid>
        </DialogContent>
        <DialogActions></DialogActions>
      </StyledDialog>

      {/* Delete confirmation */}
      <DialogConfirmation
        open={openConfirmDelete}
        handleToggle={() => setOpenConfirmDelete((prev) => !prev)}
        label={`Yakin ingin menghapus Titip Bon ${data.id} ?`}
        save={() => {
          dispatch(setLoading());
          dispatch(deleteTitipBon(data.id));
        }}
      />

      {/* Pay confirmation */}
      <DialogConfirmation
        open={openConfirmPay}
        handleToggle={() => setOpenConfirmPay((prev) => !prev)}
        label={
          <>
            Tandai {checkedCount} invoice sebagai Lunas?
            {invoices.length - checkedCount > 0 && (
              <span style={{ display: "block", fontSize: isMobile ? "12px" : "16px", fontWeight: "normal", color: "#666", marginTop: "8px" }}>
                ({invoices.length - checkedCount} invoice akan ditandai gagal bayar dan dilepas dari Titip Bon)
              </span>
            )}
          </>
        }
        save={handleConfirmPay}
      />
    </>
  );
}
