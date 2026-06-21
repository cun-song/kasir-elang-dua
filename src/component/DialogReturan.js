import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Autocomplete,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import StyledDialog from "./StyledDialog";
import { useDispatch, useSelector } from "react-redux";
import { AREA_SELECT } from "../constant/Customer";
import { RETUR_TYPE_SELECT } from "../constant/Returan";
import { formattedNumber } from "../utils/stingFormatted";
import { pushReturan, updateReturan } from "../redux/action/returanAction";
import { setLoading } from "../redux/sidenavReducer";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/id";

const style = {
  label: { fontFamily: "poppins", fontSize: "14px", fontWeight: "500", color: "#555", mb: 0.5 },
  value: { fontFamily: "poppins", fontSize: "14px", color: "#12141E" },
};

const emptyItem = { productId: "", label: "", size: "", type: "", qty: 0, unitPrice: 0, returnValue: 0, remark: "" };

export default function DialogReturan({ open = false, handleToggle, editData = null }) {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width: 600px)");

  const customers = useSelector((state) => state?.customer?.allCustomer);
  const products = useSelector((state) => state?.product?.allProduct);
  const adminName = useSelector((state) => state?.sidenav?.name);

  const [customerID, setCustomerID] = useState("");
  const [area, setArea] = useState("Singkawang");
  const [returnDate, setReturnDate] = useState(dayjs());
  const [returnReason, setReturnReason] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [statusRetur, setStatusRetur] = useState("tukar-barang");
  const [ownerList, setOwnerList] = useState([]);

  // Get customer discount
  const selectedCustomer = customers.find((c) => c?.id === customerID);
  const customerDiscount = selectedCustomer?.discount || { besar: 0, kecil: 0, meja: 0 };

  // Populate form when editing
  useEffect(() => {
    if (open && editData) {
      setCustomerID(editData.customerID || "");
      setArea(selectedCustomer?.area || "Singkawang");
      setReturnDate(editData.returnDate ? dayjs(editData.returnDate) : dayjs());
      setReturnReason(editData.returnReason || "");
      setNotes(editData.notes || "");
      setItems(editData.items?.length > 0 ? editData.items.map((i) => ({ ...i })) : [{ ...emptyItem }]);
    } else if (open && !editData) {
      // Reset form for new returan
      setCustomerID("");
      setArea("Singkawang");
      setReturnDate(dayjs());
      setReturnReason("");
      setNotes("");
      setItems([{ ...emptyItem }]);
    }
  }, [open, editData]);

  // Build customer list filtered by area
  useEffect(() => {
    const list = customers
      .filter((c) => !(c?.ownerName === "-" && c?.merchantName === "-") && c?.area === area)
      .map((c) => ({
        value: c.id,
        label: `${c?.ownerName !== "-" ? c?.ownerName : ""}${c?.ownerName !== "-" && c?.merchantName !== "-" ? ", " : ""}${c?.merchantName !== "-" ? c?.merchantName : ""}`,
      }))
      .sort((a, b) => a?.label.localeCompare(b?.label));
    setOwnerList(list);
  }, [customers, area]);

  // Calculate return value for each item based on discount logic from Home.js
  function calculateReturnValue(product, qty) {
    if (!product || !qty || qty <= 0) return { unitPrice: 0, returnValue: 0 };

    const productPrice = product?.price || 0;
    const totalLusin = product?.totalLusin || 1;
    const size = product?.size;

    // Same discount logic as Home.js L280-283
    const discountPerDozen =
      productPrice === 0
        ? 0
        : size === "Besar"
          ? customerDiscount?.besar || 0
          : size === "Kecil"
            ? customerDiscount?.kecil || 0
            : size === "meja"
              ? customerDiscount?.meja || 0
              : 0;

    // Formula: ((Product Price - Customer Product Discount) / (Dozen Qty * 12)) * Return Qty
    const unitPrice = (productPrice - discountPerDozen * totalLusin) / (totalLusin * 12);
    const returnValue = unitPrice * qty;

    return { unitPrice, returnValue };
  }

  function handleItemProductChange(index, productId) {
    const product = products.find((p) => p?.id === productId);
    if (!product) return;

    const newItems = [...items];
    const { unitPrice, returnValue } = calculateReturnValue(product, newItems[index].qty);
    newItems[index] = {
      ...newItems[index],
      productId: product.id,
      label: product.label,
      size: product.size,
      type: product.type,
      unitPrice,
      returnValue,
    };
    setItems(newItems);
  }

  function handleItemQtyChange(index, qty) {
    const parsedQty = parseInt(qty, 10) || 0;
    const newItems = [...items];
    const product = products.find((p) => p?.id === newItems[index].productId);
    const { unitPrice, returnValue } = calculateReturnValue(product, parsedQty);
    newItems[index] = {
      ...newItems[index],
      qty: parsedQty,
      unitPrice,
      returnValue,
    };
    setItems(newItems);
  }

  function handleItemRemarkChange(index, remark) {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], remark };
    setItems(newItems);
  }

  function addItem() {
    if (items.length >= 7) return;
    setItems([...items, { ...emptyItem }]);
  }

  function removeItem(index) {
    if (items.length <= 1) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  }

  // Recalculate all items when customer changes (discount may change)
  useEffect(() => {
    if (items.some((item) => item.productId)) {
      const newItems = items.map((item) => {
        if (!item.productId) return item;
        const product = products.find((p) => p?.id === item.productId);
        const { unitPrice, returnValue } = calculateReturnValue(product, item.qty);
        return { ...item, unitPrice, returnValue };
      });
      setItems(newItems);
    }
  }, [customerID]);

  // Summary calculations
  const validItems = items.filter((i) => i.productId && i.qty > 0);
  const totalItemTypes = new Set(validItems.map((i) => i.productId)).size;
  const totalQty = validItems.reduce((sum, i) => sum + i.qty, 0);
  const totalReturnValue = validItems.reduce((sum, i) => sum + i.returnValue, 0);

  function handleSave() {
    if (!customerID) return;
    if (validItems.length === 0) return;

    const ownerName = selectedCustomer?.ownerName || "";
    const merchantName = selectedCustomer?.merchantName || "";
    const customerAddress = selectedCustomer?.address || "";

    const payload = {
      customerID,
      ownerName,
      merchantName,
      customerAddress,
      returnDate: returnDate.valueOf(),
      returnReason,
      notes,
      items: validItems.map((i) => ({
        productId: i.productId,
        label: i.label,
        size: i.size,
        type: "Botol",
        qty: i.qty,
        unitPrice: i.unitPrice,
        returnValue: i.returnValue,
        remark: i.remark,
      })),
      totalItemTypes,
      totalQty,
      totalReturnValue,
      statusRetur,
      adminName,
    };

    dispatch(setLoading());
    if (editData?.id) {
      dispatch(updateReturan(editData.id, payload));
    } else {
      dispatch(pushReturan(payload));
    }
  }

  // Build product options for autocomplete
  const productOptions = products
    .filter((p) => p?.price > 0)
    .map((p) => ({
      value: p.id,
      label: `${p.label} (${p.size})`,
    }));

  return (
    <StyledDialog isOpen={open} handleToggle={handleToggle} useCloseBtn width="75%" title={editData ? "Edit Returan" : "Tambah Returan"}>
      <DialogContent sx={{ mt: 1, overflow: "hidden" }}>
        {/* Customer & Date Section */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Typography sx={style.label}>Daerah</Typography>
            <TextField select fullWidth size="small" value={area} onChange={(e) => setArea(e.target.value)} SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: "400px" } } } }}>
              {AREA_SELECT.map((item, index) => (
                <MenuItem value={item?.value} key={index}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography sx={style.label}>Customer</Typography>
            <Autocomplete
              options={ownerList}
              getOptionLabel={(option) => option.label}
              value={ownerList.find((item) => item.value === customerID) || null}
              onChange={(_, newValue) => setCustomerID(newValue ? newValue.value : "")}
              renderInput={(params) => <TextField {...params} size="small" placeholder="Cari Customer..." />}
              isOptionEqualToValue={(option, value) => option.value === value.value}
              noOptionsText="Tidak ada hasil"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography sx={style.label}>Tanggal Retur</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
              <DatePicker value={returnDate} onChange={(newDate) => setReturnDate(newDate)} format="DD MMMM YYYY" slotProps={{ textField: { size: "small", fullWidth: true } }} />
            </LocalizationProvider>
          </Grid>
        </Grid>

        <Grid container spacing={2} mt={0.5}>
          <Grid item xs={12} md={6}>
            <Typography sx={style.label}>Alasan Returan</Typography>
            <TextField fullWidth size="small" value={returnReason} onChange={(e) => setReturnReason(e.target.value)} placeholder="Contoh: Barang Rusak / Bocor" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography sx={style.label}>Catatan</Typography>
            <TextField fullWidth size="small" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan tambahan..." />
          </Grid>
        </Grid>

        {/* Items Section */}
        <Box sx={{ mt: 3, mb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ fontFamily: "poppins", fontSize: "16px", fontWeight: "bold", color: "#12141E" }}>Detail Produk Returan</Typography>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={addItem}
            disabled={items.length >= 7}
            sx={{
              textTransform: "none",
              color: "#E06F2C",
              fontWeight: 600,
              "&.Mui-disabled": { color: "#ccc" }
            }}
          >
            Tambah Produk
          </Button>
        </Box>

        {items.length >= 7 && (
          <Alert severity="warning" sx={{ mb: 2, fontFamily: "poppins", borderRadius: "8px" }}>
            Maksimal hanya 7 jenis produk per transaksi.
          </Alert>
        )}

        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "8px" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#FFAC7B" }}>
                <TableCell sx={{ fontWeight: 600, width: "5%" }}>No</TableCell>
                <TableCell sx={{ fontWeight: 600, width: isMobile ? "30%" : "30%" }}>Produk</TableCell>
                <TableCell sx={{ fontWeight: 600, width: "10%", textAlign: "center" }}>Qty</TableCell>
                <TableCell sx={{ fontWeight: 600, width: "10%", textAlign: "center" }}>Satuan</TableCell>
                <TableCell sx={{ fontWeight: 600, width: "15%", textAlign: "right" }}>Harga (Rp)</TableCell>
                <TableCell sx={{ fontWeight: 600, width: "15%", textAlign: "right" }}>Nilai Retur (Rp)</TableCell>
                <TableCell sx={{ fontWeight: 600, width: "15%" }}>Keterangan</TableCell>
                <TableCell sx={{ fontWeight: 600, width: "5%", textAlign: "center" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Autocomplete
                      options={productOptions}
                      getOptionLabel={(option) => option.label}
                      value={productOptions.find((p) => p.value === item.productId) || null}
                      onChange={(_, newValue) => handleItemProductChange(index, newValue?.value || "")}
                      renderInput={(params) => <TextField {...params} size="small" placeholder="Pilih produk..." variant="standard" />}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      noOptionsText="Tidak ada produk"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      variant="standard"
                      value={item.qty || ""}
                      onChange={(e) => handleItemQtyChange(index, e.target.value)}
                      inputProps={{ min: 0, style: { textAlign: "center" } }}
                      sx={{ width: "80px" }}
                    />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Botol</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>{item.unitPrice ? formattedNumber(Math.round(item.unitPrice)) : "-"}</TableCell>
                  <TableCell sx={{ textAlign: "right" }}>{item.returnValue ? formattedNumber(Math.round(item.returnValue)) : "-"}</TableCell>
                  <TableCell>
                    <TextField size="small" variant="standard" value={item.remark} onChange={(e) => handleItemRemarkChange(index, e.target.value)} placeholder="Keterangan" fullWidth />
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <IconButton size="small" onClick={() => removeItem(index)} disabled={items.length <= 1} sx={{ color: "#FF0E0E" }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Summary */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between", px: 4 }}>
          <Box sx={{ minWidth: "300px" }}>
            <Typography sx={style.label}>Status Retur</Typography>
            <TextField select fullWidth size="small" value={statusRetur} onChange={(e) => setStatusRetur(e.target.value)} SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: "400px" } } } }}>
              {RETUR_TYPE_SELECT.map((item, index) => (
                <MenuItem value={item?.value} key={index}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ minWidth: "300px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography sx={style.value}>Total Jenis Produk</Typography>
              <Typography sx={{ ...style.value, fontWeight: "bold" }}>{totalItemTypes}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography sx={style.value}>Total Qty</Typography>
              <Typography sx={{ ...style.value, fontWeight: "bold" }}>{totalQty}</Typography>
            </Box>
            <Box sx={{ height: "2px", backgroundColor: "#FFAC7B", my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontFamily: "poppins", fontSize: "16px", fontWeight: "bold", color: "#12141E" }}>Total Nilai Returan</Typography>
              <Typography sx={{ fontFamily: "poppins", fontSize: "16px", fontWeight: "bold", color: "#12141E" }}>Rp {formattedNumber(Math.round(totalReturnValue))}</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Grid container gap={3} justifyContent="center">
          <Button
            onClick={handleToggle}
            sx={{
              border: "1px solid #E06F2C",
              fontWeight: "600",
              color: "#E06F2C",
              ":hover": { border: "1px solid #E06F2C" },
              width: isMobile ? "120px" : "160px",
              height: "50px",
              borderRadius: "26px",
              textTransform: "none",
            }}
            variant="outlined"
          >
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={!customerID || validItems.length === 0 || validItems.length > 7}
            sx={{
              backgroundColor: "#E06F2C",
              ":hover": { backgroundColor: "#c95f1f" },
              width: isMobile ? "120px" : "160px",
              height: "50px",
              borderRadius: "26px",
              textTransform: "none",
              "&.Mui-disabled": { backgroundColor: "#ccc", color: "#fff" },
            }}
            variant="contained"
          >
            {editData ? "Simpan" : "Buat Returan"}
          </Button>
        </Grid>
      </DialogActions>
    </StyledDialog>
  );
}
