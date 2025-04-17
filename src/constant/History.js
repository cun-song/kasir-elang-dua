import { convertTimestamp, decimalToFraction, formattedNumber } from "../utils/stingFormatted";
import React from "react";

const center = {
  headerAlign: "center",
  align: "center",
  flex: 1,
  minWidth: 120,
};

export const HISTORY_HEADER = [
  {
    field: "id",
    headerName: "Transaction Id",
    ...center,
  },
  {
    field: "ownerName",
    headerName: "Nama Pelanggan",
    ...center,
  },
  {
    field: "merchantName",
    headerName: "Nama Toko",
    ...center,
  },
  {
    field: "area",
    headerName: "Daerah",
    ...center,
  },
  {
    field: "lusin",
    headerName: "Lusin",
    renderCell: (num) => {
      return `${decimalToFraction(num?.value)}`;
    },
    ...center,
  },
  {
    field: "discount",
    headerName: "Diskon",
    ...center,
    renderCell: (number) => {
      return `Rp ${formattedNumber(number?.value?.total)}`;
    },
  },

  {
    field: "total",
    headerName: "Total",
    ...center,
    renderCell: (number) => {
      return `Rp ${formattedNumber(number?.value)}`;
    },
  },
  {
    field: "adminName",
    headerName: "Admin",
    ...center,
  },
  {
    field: "timestamp",
    headerName: "Waktu",
    ...center,
    renderCell: (time) => {
      return convertTimestamp(time?.value);
    },
  },
];

export const TRANSACTION_SEARCH_ITEM = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "id",
    label: "Transaction Id",
  },
  {
    value: "ownerName",
    label: "Nama Pelanggan",
  },
  {
    value: "merchantName",
    label: "Nama Toko",
  },
  {
    value: "area",
    label: "Daerah",
  },
  {
    value: "lusin",
    label: "Lusin",
  },
  {
    value: "discount",
    label: "Diskon",
  },
  {
    value: "total",
    label: "Total",
  },
];

export const LAST_DATE_LIST = [
  {
    value: 0,
    label: "Hari ini",
  },
  {
    value: 1,
    label: "Kemarin",
  },
  {
    value: 3,
    label: "3 Hari yang lalu",
  },
  {
    value: 7,
    label: "7 Hari yang lalu",
  },
  {
    value: 30,
    label: "30 Hari yang lalu",
  },
  {
    value: 90,
    label: "90 Hari yang lalu",
  },
  {
    value: 99999,
    label: "Semua Transaksi",
  },
];
