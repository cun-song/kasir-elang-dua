import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Typography,
  TextField,
  Autocomplete,
  Checkbox,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import StyledDialog from "./StyledDialog";
import StyledTable from "./StyledTable";
import { useDispatch, useSelector } from "react-redux";
import { formattedNumber } from "../utils/stingFormatted";
import { TITIPBON_INVOICE_HEADER } from "../constant/TitipBon";
import { fetchEligibleInvoices, pushTitipBon } from "../redux/action/titipBonAction";
import { setLoading } from "../redux/sidenavReducer";
import { AREA_SELECT } from "../constant/Customer";

const DATE_FILTER_OPTIONS = [
  { value: 7, label: "7 Hari" },
  { value: 30, label: "30 Hari" },
  { value: 60, label: "60 Hari" },
  { value: 90, label: "90 Hari" },
  { value: 99999, label: "Semua" },
];

export default function CreateTitipBon({ open = false, handleToggle }) {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width: 600px)");

  const customerList = useSelector((state) => state?.customer?.allCustomer);
  const adminName = useSelector((state) => state?.sidenav?.name);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [area, setArea] = useState("Singkawang");
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState([]);
  const [dateFilter, setDateFilter] = useState(30);
  const [loading, setLocalLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [currRowsPerPage, setCurrRowsPerPage] = useState(10);

  // Build customer options filtered by area
  const customerOptions = customerList
    .filter((c) => !(c?.ownerName === "-" && c?.merchantName === "-") && c?.area === area)
    .map((c) => ({
      value: c.id,
      label: `${c?.ownerName !== "-" ? c?.ownerName : ""}${c?.ownerName !== "-" && c?.merchantName !== "-" ? ", " : ""}${c?.merchantName !== "-" ? c?.merchantName : ""}`,
      ownerName: c?.ownerName,
      merchantName: c?.merchantName,
      area: c?.area,
      address: c?.address,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setSelectedCustomer(null);
      setArea("Singkawang");
      setInvoices([]);
      setFilteredInvoices([]);
      setSelectedInvoiceIds([]);
      setDateFilter(30);
    }
  }, [open]);

  // Fetch invoices when customer is selected
  useEffect(() => {
    if (selectedCustomer) {
      setLocalLoading(true);
      fetchEligibleInvoices(selectedCustomer.value)
        .then((data) => {
          // Enrich data for table display
          const enriched = data.map((t) => {
            const discountObj = t?.discount || {};
            const discountTotal = discountObj?.total || 0;
            const now = Date.now();
            const selisihMs = now - (t?.timestamp || now);
            const selisihHari = Math.floor(selisihMs / (1000 * 60 * 60 * 24));

            return {
              ...t,
              discountTotal: discountTotal,
              selisihHari: selisihHari,
              statusInvoice: t?.isPaid === 1 ? "lunas" : "belum_lunas",
            };
          });
          setInvoices(enriched);
        })
        .catch((err) => {
          console.error("Error fetching invoices:", err);
          setInvoices([]);
        })
        .finally(() => setLocalLoading(false));
    } else {
      setInvoices([]);
      setSelectedInvoiceIds([]);
    }
  }, [selectedCustomer]);

  // Apply date filter
  useEffect(() => {
    if (dateFilter === 99999) {
      setFilteredInvoices(invoices);
    } else {
      const now = new Date();
      const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dateFilter).getTime();
      setFilteredInvoices(invoices.filter((inv) => (inv?.timestamp || 0) >= cutoff));
    }
    setSelectedInvoiceIds([]);
  }, [invoices, dateFilter]);

  // Calculate summary
  const selectedInvoices = filteredInvoices.filter((inv) => selectedInvoiceIds.includes(inv.id));
  const totalAmount = selectedInvoices.reduce((acc, inv) => acc + (inv?.total || 0), 0);

  function handleSave() {
    if (!selectedCustomer) return;
    if (selectedInvoiceIds.length === 0) return;

    dispatch(setLoading());

    const invoiceData = selectedInvoices.map((inv) => ({
      invoiceId: inv.id,
      invoiceTimestamp: inv.timestamp,
      lusin: inv.lusin || 0,
      discount: inv?.discount?.total || 0,
      total: inv.total || 0,
      statusInvoice: "belum_lunas",
    }));

    const titipBonData = {
      customerID: selectedCustomer.value,
      ownerName: selectedCustomer.ownerName || "-",
      merchantName: selectedCustomer.merchantName || "-",
      area: selectedCustomer.area || "",
      customerAddress: selectedCustomer.address || "",
      invoices: invoiceData,
      jumlahInvoice: invoiceData.length,
      grandTotal: totalAmount,
      createdBy: adminName || "",
    };

    dispatch(pushTitipBon(titipBonData));
  }

  return (
    <StyledDialog
      isOpen={open}
      handleToggle={handleToggle}
      useCloseBtn
      width="75%"
      title="Buat Titip Bon"
    >
      <DialogContent sx={{ mt: 1 }}>
        {/* Area Dropdown + Customer Search */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end", flexDirection: isMobile ? "column" : "row", mb: 3 }}>
          <Box sx={{ width: isMobile ? "100%" : "220px", flexShrink: 0 }}>
            <Typography sx={{ fontFamily: "poppins", fontSize: "14px", fontWeight: "500", color: "#555", mb: 1 }}>
              Daerah
            </Typography>
            <TextField
              select
              size="small"
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                setSelectedCustomer(null);
              }}
              SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: "400px" } } } }}
              sx={{ width: "100%" }}
            >
              {AREA_SELECT.map((item, index) => (
                <MenuItem value={item?.value} key={index}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ flex: 1, width: "100%" }}>
            <Typography sx={{ fontFamily: "poppins", fontSize: "14px", fontWeight: "500", color: "#555", mb: 1 }}>
              Nama Pemesan & Toko
            </Typography>
            <Autocomplete
              options={customerOptions}
              getOptionLabel={(option) => option.label}
              value={selectedCustomer}
              onChange={(_, newValue) => setSelectedCustomer(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Cari nama owner atau toko..."
                  size="small"
                />
              )}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              noOptionsText="Tidak ada hasil"
              sx={{ width: "100%" }}
            />
          </Box>
        </Box>

        {/* Invoice section - shown after customer selected */}
        {selectedCustomer && (
          <>
            {/* Date filter */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography sx={{ fontFamily: "poppins", fontSize: "16px", fontWeight: "600", color: "#12141E" }}>
                Invoice yang tersedia ({filteredInvoices.length})
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{ fontSize: "14px", whiteSpace: "nowrap" }}>Filter:</Typography>
                <TextField
                  select
                  size="small"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  sx={{ width: "140px" }}
                >
                  {DATE_FILTER_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* Invoice Table with Checkboxes */}
            <Box sx={{ mb: 2 }}>
              <StyledTable
                headers={TITIPBON_INVOICE_HEADER}
                rows={filteredInvoices}
                page={page}
                setPage={(e) => setPage(e)}
                pageSize={currRowsPerPage}
                setPageSizeChange={(e) => setCurrRowsPerPage(e)}
                rowCount={filteredInvoices.length}
                paginationMode="client"
                checkboxSelection={true}
                selectModelChange={(ids) => setSelectedInvoiceIds(ids)}
                disableRowClick={false}
                loading={loading}
              />
            </Box>

            {/* Summary Preview */}
            {selectedInvoiceIds.length > 0 && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#FFF5EF",
                  borderRadius: "12px",
                  border: "1.5px dashed #FFAC7B",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography sx={{ fontFamily: "poppins", fontSize: "14px", color: "#555" }}>
                    Jumlah Invoice Dipilih
                  </Typography>
                  <Typography sx={{ fontFamily: "poppins", fontSize: "24px", fontWeight: "bold", color: "#E06F2C" }}>
                    {selectedInvoiceIds.length} Invoice
                  </Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontFamily: "poppins", fontSize: "14px", color: "#555" }}>
                    Total Keseluruhan
                  </Typography>
                  <Typography sx={{ fontFamily: "poppins", fontSize: "24px", fontWeight: "bold", color: "#12141E" }}>
                    Rp {formattedNumber(Math.round(totalAmount))}
                  </Typography>
                </Box>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleToggle}
          sx={{
            border: "1px solid #E06F2C",
            fontWeight: "600",
            color: "#E06F2C",
            ":hover": { border: "1px solid #E06F2C" },
            width: isMobile ? "120px" : "160px",
            height: "48px",
            borderRadius: "26px",
            textTransform: "none",
          }}
          variant="outlined"
        >
          Batal
        </Button>
        <Button
          onClick={handleSave}
          disabled={!selectedCustomer || selectedInvoiceIds.length === 0}
          sx={{
            backgroundColor: "#E06F2C",
            ":hover": { backgroundColor: "#c95f1f" },
            width: isMobile ? "140px" : "200px",
            height: "48px",
            borderRadius: "26px",
            textTransform: "none",
            fontWeight: 600,
            "&.Mui-disabled": { backgroundColor: "#ccc", color: "#888" },
          }}
          variant="contained"
        >
          Simpan Titip Bon
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
