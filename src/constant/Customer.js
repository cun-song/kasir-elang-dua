import { convertTimestamp } from "../utils/stingFormatted";
import { Label_Size } from "./Home";

const center = {
  headerAlign: "center",
  align: "center",
  flex: 1,
};

export const CUSTOMER_HEADER = [
  {
    field: "id",
    headerName: "Customer Id",
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
    field: "address",
    headerName: "Alamat",
    ...center,
  },
  {
    field: "discount",
    headerName: "Diskon",
    ...center,
    renderCell: (diskon) => {
      return `${Label_Size?.besar}: ${diskon?.value?.besar ?? 0}, ${Label_Size?.kecil}: ${diskon?.value?.kecil ?? 0}, ${Label_Size?.meja}: ${diskon?.value?.meja ?? 0}`;
    },
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

export const CUSTOMER_SEARCH_ITEM = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "id",
    label: "Customer Id",
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
    value: "address",
    label: "Alamat",
  },
];

export const AREA_SELECT = [
  {
    value: "Singkawang",
    label: "Singkawang",
  },
  {
    value: "Bengkayang",
    label: "Bengkayang",
  },
  {
    value: "Jakarta",
    label: "Jakarta",
  },
  {
    value: "Pontianak",
    label: "Pontianak",
  },
  {
    value: "Sungai Pinyuh",
    label: "Sungai Pinyuh",
  },
  {
    value: "Bali",
    label: "Bali",
  },
  {
    value: "Sambas",
    label: "Sambas",
  },
  {
    value: "others",
    label: "Lain-lain",
  },
];
