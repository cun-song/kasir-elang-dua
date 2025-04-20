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

export const LUSIN_PERBULAN_HEADER = (arr, monthNames) => {
  const temp = [
    {
      field: "id",
      headerName: "ID",
      ...center,
    },
    {
      field: "label",
      headerName: "Label",
      ...center,
      flex: 2,
    },
  ];
  arr?.forEach((a, index) => {
    const month = new Date(a).getMonth();
    const year = new Date(a).getFullYear();
    const monthName = monthNames[month];
    const yearName = year;
    temp.push({
      field: `M${index}`,
      headerName: `${monthName} ${yearName}`,
      ...center,
      renderCell: (num) => {
        return `${decimalToFraction(num?.value)}`;
      },
    });
  });
  temp.push({
    field: "type",
    headerName: "Jenis",
    ...center,
  });

  return temp;
};
