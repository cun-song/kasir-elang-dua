import { convertTimestampDate, formattedNumber } from "../utils/stingFormatted";
import React from "react";
import { Chip } from "@mui/material";

const center = {
  headerAlign: "center",
  align: "center",
  flex: 1,
  minWidth: 120,
};

export const TITIPBON_HEADER = [
  {
    field: "id",
    headerName: "ID Titip Bon",
    ...center,
    minWidth: 180,
  },
  {
    field: "ownerName",
    headerName: "Nama Owner",
    ...center,
    minWidth: 160,
  },
  {
    field: "merchantName",
    headerName: "Nama Merchant",
    ...center,
    minWidth: 160,
  },
  {
    field: "area",
    headerName: "Area",
    ...center,
    minWidth: 130,
  },
  {
    field: "jumlahInvoice",
    headerName: "Jumlah Invoice",
    ...center,
    minWidth: 130,
  },
  {
    field: "grandTotal",
    headerName: "Total Keseluruhan",
    ...center,
    minWidth: 170,
    renderCell: (params) => {
      return `Rp ${formattedNumber(params?.value)}`;
    },
  },
  {
    field: "timestamp",
    headerName: "Tanggal Dibuat",
    ...center,
    minWidth: 160,
    renderCell: (params) => {
      return convertTimestampDate(params?.value);
    },
  },
  {
    field: "createdBy",
    headerName: "Dibuat Oleh",
    ...center,
    minWidth: 130,
  },
  {
    field: "status",
    headerName: "Status",
    ...center,
    minWidth: 150,
    renderCell: (params) => {
      const isActive = params?.value === "aktif";
      return (
        <Chip
          label={isActive ? "Aktif" : "Sudah Bayar"}
          size="small"
          sx={{
            backgroundColor: isActive ? "#FFF3E0" : "#a9dcb1",
            color: isActive ? "#E65100" : "#1b5e20",
            fontWeight: 600,
            fontSize: "12px",
          }}
        />
      );
    },
  },
];

export const TITIPBON_SEARCH_ITEM = [
  { value: "all", label: "All" },
  { value: "id", label: "ID Titip Bon" },
  { value: "ownerName", label: "Nama Owner" },
  { value: "merchantName", label: "Nama Merchant" },
  { value: "area", label: "Area" },
];

export const TITIPBON_DATE_LIST = [
  { value: 7, label: "7 Hari yang lalu" },
  { value: 30, label: "30 Hari yang lalu" },
  { value: 60, label: "60 Hari yang lalu" },
  { value: 90, label: "90 Hari yang lalu" },
  { value: 99999, label: "Semua Titip Bon" },
];

export const TITIPBON_INVOICE_HEADER = [
  {
    field: "id",
    headerName: "ID Invoice",
    ...center,
    minWidth: 140,
  },
  {
    field: "timestamp",
    headerName: "Tanggal Invoice",
    ...center,
    minWidth: 160,
    renderCell: (params) => {
      return convertTimestampDate(params?.value);
    },
  },
  {
    field: "lusin",
    headerName: "Total Lusin",
    ...center,
    minWidth: 110,
  },
  {
    field: "discountTotal",
    headerName: "Diskon",
    ...center,
    minWidth: 130,
    renderCell: (params) => {
      return `Rp ${formattedNumber(params?.value || 0)}`;
    },
  },
  {
    field: "total",
    headerName: "Total",
    ...center,
    minWidth: 150,
    renderCell: (params) => {
      return `Rp ${formattedNumber(params?.value)}`;
    },
  },
  {
    field: "selisihHari",
    headerName: "Selisih Hari",
    ...center,
    minWidth: 110,
  },
  {
    field: "statusInvoice",
    headerName: "Status Invoice",
    ...center,
    minWidth: 150,
    renderCell: (params) => {
      const val = params?.value;
      let label = "Belum Lunas";
      let bg = "#FFF3E0";
      let color = "#E65100";
      if (val === "lunas" || val === 1) {
        label = "Lunas";
        bg = "#a9dcb1";
        color = "#1b5e20";
      }
      return (
        <Chip
          label={label}
          size="small"
          sx={{ backgroundColor: bg, color: color, fontWeight: 600, fontSize: "12px" }}
        />
      );
    },
  },
];

export const TITIPBON_DETAIL_INVOICE_HEADER = [
  {
    field: "invoiceId",
    headerName: "ID Invoice",
    ...center,
    minWidth: 140,
  },
  {
    field: "invoiceTimestamp",
    headerName: "Tanggal Invoice",
    ...center,
    minWidth: 160,
    renderCell: (params) => {
      return convertTimestampDate(params?.value);
    },
  },
  {
    field: "lusin",
    headerName: "Total Lusin",
    ...center,
    minWidth: 110,
  },
  {
    field: "discount",
    headerName: "Diskon",
    ...center,
    minWidth: 130,
    renderCell: (params) => {
      return `Rp ${formattedNumber(params?.value || 0)}`;
    },
  },
  {
    field: "total",
    headerName: "Total",
    ...center,
    minWidth: 150,
    renderCell: (params) => {
      return `Rp ${formattedNumber(params?.value)}`;
    },
  },
  {
    field: "statusInvoice",
    headerName: "Status Invoice",
    ...center,
    minWidth: 160,
    renderCell: (params) => {
      const val = params?.value;
      let label = "Belum Lunas";
      let bg = "#FFF3E0";
      let color = "#E65100";
      if (val === "lunas_via_titipbon") {
        label = "Lunas";
        bg = "#a9dcb1";
        color = "#1b5e20";
      } else if (val === "gagal_via_titipbon") {
        label = "Pembayaran Gagal";
        bg = "#FFCDD2";
        color = "#b71c1c";
      }
      return (
        <Chip
          label={label}
          size="small"
          sx={{ backgroundColor: bg, color: color, fontWeight: 600, fontSize: "12px" }}
        />
      );
    },
  },
];
