import { convertTimestampDate, formattedNumber } from "../utils/stingFormatted";
import React from "react";
import { Box, Chip } from "@mui/material";

const center = {
  headerAlign: "center",
  align: "center",
  flex: 1,
  minWidth: 120,
};

export const RETURAN_HEADER = [
  {
    field: "id",
    headerName: "No Returan",
    ...center,
    minWidth: 180,
  },
  {
    field: "returnDate",
    headerName: "Tanggal Returan",
    ...center,
    renderCell: (params) => {
      return convertTimestampDate(params?.value);
    },
  },
  {
    field: "ownerName",
    headerName: "Customer",
    ...center,
    minWidth: 160,
    renderCell: (params) => {
      const owner = params?.row?.ownerName;
      const merchant = params?.row?.merchantName;
      if (owner && owner !== "-" && merchant && merchant !== "-") return `${owner}, ${merchant}`;
      if (owner && owner !== "-") return owner;
      if (merchant && merchant !== "-") return merchant;
      return "-";
    },
  },
  {
    field: "totalQty",
    headerName: "Total Qty",
    ...center,
    minWidth: 100,
  },
  {
    field: "totalReturnValue",
    headerName: "Total Nilai Returan",
    ...center,
    minWidth: 160,
    renderCell: (params) => {
      return `Rp ${formattedNumber(params?.value)}`;
    },
  },
  {
    field: "returnReason",
    headerName: "Alasan Returan",
    ...center,
    minWidth: 160,
  },
  {
    field: "isSent",
    headerName: "Status Kirim",
    ...center,
    minWidth: 140,
    renderCell: (params) => {
      return (
        <Chip
          label={params?.value ? "Sudah Dikirim" : "Belum Dikirim"}
          size="small"
          sx={{
            backgroundColor: params?.value ? "#a9dcb1" : "#E2E2EB",
            color: params?.value ? "#1b5e20" : "#555",
            fontWeight: 600,
            fontSize: "12px",
          }}
        />
      );
    },
  },
];

export const RETURAN_SEARCH_ITEM = [
  { value: "all", label: "All" },
  { value: "id", label: "No Returan" },
  { value: "ownerName", label: "Customer" },
  { value: "returnReason", label: "Alasan Returan" },
];

export const RETURAN_FILTER = [
  { value: "all", label: "Semua" },
  { value: "unsent", label: "Belum Dikirim" },
  { value: "sent", label: "Sudah Dikirim" },
];

export const RETURAN_DATE_LIST = [
  { value: 0, label: "Hari ini" },
  { value: 1, label: "Kemarin" },
  { value: 3, label: "3 Hari yang lalu" },
  { value: 7, label: "7 Hari yang lalu" },
  { value: 30, label: "30 Hari yang lalu" },
  { value: 90, label: "90 Hari yang lalu" },
  { value: 99999, label: "Semua Returan" },
];

export const RETUR_TYPE_SELECT = [
  {
    value: "tukar-barang",
    label: "Tukar Barang",
  },
  {
    value: "potong-tagihan",
    label: "Potong Tagihan",
  },
  {
    value: "refund-dana",
    label: "Refund Dana",
  },
];
