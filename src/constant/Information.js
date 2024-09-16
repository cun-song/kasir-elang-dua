import { decimalToFraction, decimalToFraction2 } from "../utils/stingFormatted";

const center = {
  headerAlign: "center",
  align: "center",
  flex: 1,
};

export const LUSIN_HEADER = [
  {
    field: "label",
    headerName: "Label",
    ...center,
    flex: 3,
  },
  {
    field: "value",
    headerName: "Jumlah",
    ...center,
    renderCell: (num) => {
      return `${decimalToFraction(num?.value)}`;
    },
  },
  {
    field: "type",
    headerName: "Jenis",
    ...center,
  },
  {
    field: "totalLusin",
    headerName: "Total Lusin",
    ...center,
    renderCell: (num) => {
      return `${decimalToFraction(num?.value * num?.row?.value)}`;
    },
  },
];
