// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { click, setTitle } from "../redux/sidenavReducer";
// import { Box, MenuItem, TextField, Grid, Typography } from "@mui/material";
// import NavBar from "../component/NavBar";
// import { LineChart } from "@mui/x-charts/LineChart";
// import { fetchTransactionHistory } from "../redux/action/transactionAction";
// import { AREA_SELECT } from "../constant/Customer";
// import StyledTable from "../component/StyledTable";
// import { LUSIN_HEADER, LUSIN_PERBULAN_HEADER } from "../constant/Information";
// import { decimalToFraction, decimalToFraction2 } from "../utils/stingFormatted";
// import { fetchCustomerData } from "../redux/action/customerAction";
// import { fetchProductData } from "../redux/action/productAction";
// import { PrintBon, PrintLusin } from "../utils/PrintReport";

// export default function Information() {
//   const currDate = new Date();
//   currDate.setDate(1);
//   currDate.setHours(0, 0, 0, 0);

//   const [page, setPage] = useState(0);
//   const [currRowsPerPage, setCurrRowsPerPage] = useState(30);
//   const [pageTahun, setPageTahun] = useState(0);
//   const [currRowsPerPageTahun, setCurrRowsPerPageTahun] = useState(30);
//   const [omzet, setOmzet] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
//   const [lusinBulanan, setLusinBulanan] = useState([]);
//   const [areaOmzet, setAreaOmzet] = useState("All");
//   const [productID, setProductID] = useState("P1");
//   const [lusin, setLusin] = useState([]);
//   const [doc, setDoc] = useState([]);
//   const [bon, setBon] = useState([]);
//   const [sumLusin, setSumLusin] = useState(0);
//   const [areaLusin, setAreaLusin] = useState("All");
//   const [bulanLusin, setBulanLusin] = useState({ month: new Date(currDate).getMonth(), year: new Date(currDate).getFullYear() });

//   const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//   const dispatch = useDispatch();
//   const transaction = useSelector((state) => state?.transaction?.transactionHistory);
//   const customer = useSelector((state) => state?.customer?.allCustomer);
//   const product = useSelector((state) => state?.product?.allProduct);

//   const [totalProductGrafik, setTotalProductGrafik] = useState(() => {
//     const bulanLength = 14;
//     const initial = {};
//     Object.values(product).forEach((p) => {
//       initial[p?.id] = new Array(bulanLength).fill(0);
//     });
//     return initial;
//   });

//   function createXData(length) {
//     const array = [];

//     for (let i = length - 2; i >= 0; i--) {
//       const temp = new Date(currDate).setMonth(currDate.getMonth() - i);

//       array.push(new Date(temp)); // Example: Push the current index
//     }
//     const temp = new Date(currDate).setMonth(currDate.getMonth() + 1);

//     array.push(new Date(temp)); // Example: Push the current index
//     return array;
//   }
//   function findCustomer(id) {
//     return Object.values(customer).find((customer) => customer?.id === id);
//   }
//   function findProduct(id) {
//     return Object.values(product).find((product) => product?.id === id);
//   }
//   useEffect(() => {
//     setAreaOmzet("All");
//     dispatch(click(4));
//     dispatch(setTitle("Informasi"));
//     dispatch(fetchTransactionHistory(99999));
//     dispatch(fetchCustomerData());
//     dispatch(fetchProductData());
//   }, []);

//   useEffect(() => {
//     // Omzet
//     const tempDataOmzet = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
//     const tempDataLusin = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
//     let arr = createXData(14);
//     let trans = Object?.values(transaction);

//     if (areaOmzet !== "All") trans = trans?.filter((t) => findCustomer(t?.customerID)?.area === areaOmzet);
//     trans.forEach((t) => {
//       for (let i = 0; i < arr.length - 1; i++) {
//         if (arr[i].getTime() < t?.timestamp && t?.timestamp < arr[i + 1].getTime()) {
//           tempDataOmzet[i] = (tempDataOmzet[i] || 0) + (t?.total || 0);
//           break; // Hentikan loop setelah ketemu rentangnya
//         }
//       }

//       // tabel produk semua bulan
//       for (let i = 0; i < arr?.length - 1; i++) {
//         if (arr[i]?.getTime() < t?.timestamp && t?.timestamp < arr[i + 1]?.getTime()) {
//           const product = t?.product;
//           Object.entries(product).forEach(([p, value]) => {
//             const newId = p?.startsWith("P") ? p : p?.slice(1);
//             tempDataLusin[i] = {
//               ...tempDataLusin[i],
//               [newId]: (tempDataLusin[i]?.[newId] || 0) + (value?.productQty || 0),
//             };
//           });
//           break; // langsung break setelah nemu rentangnya
//         }
//       }
//     });
//     const totalPerBulan = [];
//     const totalPerBulanGrafik = {};
//     Object.values(product).forEach((p) => {
//       if (!totalPerBulanGrafik[p?.id]) {
//         totalPerBulanGrafik[p?.id] = [];
//       }
//       const tempObject = { label: p?.label, index: p?.index, type: p?.type, id: p?.id };
//       Object.keys(tempDataLusin).forEach((m, idx) => {
//         if (tempObject[`M${m}`] === undefined) tempObject[`M${m}`] = tempDataLusin[m][p?.id] || 0;
//         else tempObject[`M${m}`] += tempDataLusin[m][p?.id];
//         if (totalPerBulanGrafik[p?.id][idx] === undefined) {
//           totalPerBulanGrafik[p?.id][idx] = tempDataLusin[m][p?.id] || 0;
//         } else {
//           totalPerBulanGrafik[p?.id][idx] += tempDataLusin[m][p?.id] || 0;
//         }
//       });
//       totalPerBulan.push(tempObject);
//     });
//     setTotalProductGrafik(totalPerBulanGrafik);
//     setLusinBulanan(totalPerBulan);
//     setOmzet(tempDataOmzet);
//   }, [transaction, areaOmzet]);
//   useEffect(() => {
//     let tempLusin = {};
//     let trans = Object.values(transaction);
//     let tempDateYear = new Date(currDate).setFullYear(bulanLusin?.year);
//     let before = new Date(tempDateYear).setMonth(bulanLusin?.month);
//     let after = new Date(before).setMonth(bulanLusin?.month + 1);
//     let newtrans = [];
//     let tempBon = {};
//     // tabel produk semua bulan

//     if (areaLusin !== "All") trans = trans.filter((t) => findCustomer(t?.customerID)?.area === areaLusin);

//     trans.forEach((t) => {
//       //tabel produk per bulan
//       if (before < t?.timestamp && t?.timestamp < after && t?.isDelivered === 1) {
//         newtrans = [...newtrans, t];

//         if (tempBon?.hasOwnProperty(t?.customerID)) {
//           tempBon = {
//             ...tempBon,
//             [t?.customerID]: {
//               ...tempBon[t?.customerID],
//               allPaid: tempBon[t?.customerID]?.allPaid === 0 ? 0 : t?.isPaid,
//               invoice: [...tempBon[t?.customerID]?.invoice, { invoice: t?.id, time: t?.timestamp, product: t?.product, discount: t?.discount, total: t?.total, isPaid: t?.isPaid }],
//               rowSpan: tempBon[t?.customerID]?.rowSpan + Object.keys(t?.product)?.length,
//             },
//           };
//         } else {
//           tempBon = {
//             ...tempBon,
//             [t?.customerID]: {
//               id: t?.customerID,
//               name: `${t?.ownerName !== "-" ? t?.ownerName : ""}${t?.ownerName !== "-" && t?.merchantName !== "-" ? ", " : ""}${t?.merchantName !== "-" ? t?.merchantName : ""}`,
//               area: findCustomer(t?.customerID)?.area,
//               allPaid: t?.isPaid,
//               invoice: [{ invoice: t?.id, time: t?.timestamp, product: t?.product, discount: t?.discount, total: t?.total, isPaid: t?.isPaid }],
//               rowSpan: Object.keys(t?.product)?.length,
//             },
//           };
//         }
//         const product = t?.product;
//         Object.keys(product).forEach((p) => {
//           const newId = p[0] === "P" ? p : p?.slice(1);
//           if (tempLusin?.hasOwnProperty(newId)) {
//             tempLusin = {
//               ...tempLusin,
//               [newId]: tempLusin[newId] + product[p]?.productQty,
//             };
//           } else {
//             tempLusin = {
//               ...tempLusin,
//               [newId]: product[p]?.productQty,
//             };
//           }
//         });
//       }
//     });

//     let tempSumLusin = 0;
//     const newer = Object.keys(tempLusin).map((tem) => {
//       const product = findProduct(tem);
//       tempSumLusin += tempLusin[tem] * product?.totalLusin;
//       return { value: tempLusin[tem], label: product?.label, index: product?.index, type: product?.type, totalLusin: product?.totalLusin, id: product?.id };
//     });

//     const newerBon = Object.keys(tempBon).map((bon) => {
//       return { ...tempBon[bon] };
//     });

//     const existingIds = new Set(newer.map((item) => item.id));
//     Object.values(product).forEach((newItem) => {
//       if (!existingIds.has(newItem?.id)) {
//         newer.push({ value: 0, label: newItem?.label, index: newItem?.index, type: newItem?.type, totalLusin: newItem?.totalLusin, id: newItem?.id });
//       }
//     });

//     newer.sort((a, b) => {
//       return a?.index - b?.index;
//     });
//     newerBon
//       .sort((a, b) => {
//         return a?.name.localeCompare(b?.name);
//       })
//       .sort((a, b) => {
//         return a?.allPaid - b?.allPaid;
//       });

//     const doc = newer.filter((item) => !(item?.type === "Gen" && item?.value === 0));
//     setDoc(doc);
//     setBon(newerBon);
//     setSumLusin(tempSumLusin);
//     setLusin(newer);
//   }, [transaction, bulanLusin, areaLusin]);

//   let selectMonth = createXData(14);
//   selectMonth = selectMonth.map((a) => {
//     return { value: { month: a?.getMonth(), year: a?.getFullYear() }, label: `${monthNames[a?.getMonth()]} ${a?.getFullYear()}` };
//   });
//   let selectProduct = Object.values(product).map((a) => {
//     return { value: a?.id, label: a?.label };
//   });
//   return (
//     <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between" }}>
//       <Box sx={{ width: "100%", pr: 5 }}>
//         <NavBar />
//         <Box sx={{ backgroundColor: "white", borderRadius: "10px", p: 4, mt: 4, width: "96%" }}>
//           <Grid container>
//             <Grid item sx={{ width: "50%" }}>
//               <Typography sx={{ fontFamily: "poppins", fontSize: 28, fontWeight: "bold", color: "#12141E" }}>Data Lusin Bulanan</Typography>

//               <StyledTable headers={LUSIN_HEADER} rows={lusin} page={page} setPage={(e) => setPage(e)} pageSize={currRowsPerPage} setPageSizeChange={(e) => setCurrRowsPerPage(e)} rowCount={lusin?.length} paginationMode="client" />
//             </Grid>
//             <Grid item sx={{ display: "flex", flexDirection: "column", gap: 5, marginLeft: 10, marginTop: 5 }}>
//               <Grid item>
//                 <Typography sx={{ fontFamily: "poppins", fontSize: 18, fontWeight: "bold", color: "#12141E" }}>Input Daerah</Typography>

//                 <TextField id="select-area" select sx={{ width: "200px" }} value={areaLusin} onChange={(e) => setAreaLusin(e?.target?.value)}>
//                   {[{ value: "All", label: "Semua" }, ...AREA_SELECT].map((item, index) => (
//                     <MenuItem value={item?.value} key={index}>
//                       {item?.label}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
//               <Grid item>
//                 <Typography sx={{ fontFamily: "poppins", fontSize: 18, fontWeight: "bold", color: "#12141E" }}>Input Bulan</Typography>

//                 <TextField id="select-bulan-lusin" select sx={{ width: "200px" }} value={JSON.stringify(bulanLusin)} onChange={(e) => setBulanLusin(JSON.parse(e?.target?.value))}>
//                   {selectMonth?.map((item, index) => (
//                     <MenuItem value={JSON.stringify(item?.value)} key={index}>
//                       {item?.label}
//                     </MenuItem>
//                   ))}
//                 </TextField>
//               </Grid>
//               <Grid item sx={{ display: "flex", gap: 2 }}>
//                 <Typography sx={{ fontFamily: "poppins", fontSize: 24, fontWeight: "bold", color: "#12141E" }}>Total Lusin : </Typography>
//                 <Typography sx={{ fontFamily: "poppins", fontSize: 24, fontWeight: "normal", color: "#12141E" }}>{decimalToFraction(sumLusin)}</Typography>
//                 <Typography sx={{ fontFamily: "poppins", fontSize: 24, fontWeight: "bold", color: "#12141E" }}>Lusin</Typography>
//               </Grid>
//               <Grid item container alignItems={"center"} gap={2}>
//                 <Typography sx={{ fontFamily: "poppins", fontSize: 24, fontWeight: "bold", color: "#12141E" }}>Laporan Penjualan:</Typography>
//                 <PrintLusin doc={doc} sumLusin={sumLusin} date={bulanLusin} area={areaLusin} />
//               </Grid>
//               <Grid item container alignItems={"center"} gap={2}>
//                 <Typography sx={{ fontFamily: "poppins", fontSize: 24, fontWeight: "bold", color: "#12141E" }}>Laporan Nota Bon:</Typography>
//                 <PrintBon doc={bon} date={bulanLusin} area={areaLusin} />
//               </Grid>
//             </Grid>
//           </Grid>
//         </Box>

//         <Box sx={{ backgroundColor: "white", borderRadius: "10px", p: 4, mt: 4 }}>
//           <Grid container>
//             <Grid item>
//               <Typography sx={{ fontFamily: "poppins", fontSize: 28, fontWeight: "bold", color: "#12141E" }}>Omset Bulanan</Typography>

//               <LineChart
//                 xAxis={[
//                   {
//                     scaleType: "time",
//                     data: createXData(14),
//                     valueFormatter: (value) => `${monthNames[value?.getMonth()]} ${value?.getFullYear()}`,
//                   },
//                 ]}
//                 series={[
//                   {
//                     data: omzet,
//                   },
//                 ]}
//                 yAxis={[
//                   {
//                     tickLabelStyle: {
//                       fontSize: 14,
//                     },
//                     valueFormatter: (value) => `${value / 1000000} Jt`,
//                   },
//                 ]}
//                 width={1000}
//                 height={500}
//                 margin={{ left: 100 }}
//               />
//             </Grid>
//             <Grid item sx={{ display: "flex", alignItems: "center" }}>
//               <TextField id="select-area" select sx={{ width: "200px" }} value={areaOmzet} onChange={(e) => setAreaOmzet(e?.target?.value)}>
//                 {[{ value: "All", label: "Semua" }, ...AREA_SELECT].map((item, index) => (
//                   <MenuItem value={item?.value} key={index}>
//                     {item?.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//           </Grid>
//           <Grid>
//             <StyledTable
//               headers={LUSIN_PERBULAN_HEADER(createXData(14), monthNames)}
//               rows={lusinBulanan}
//               page={pageTahun}
//               setPage={(e) => setPageTahun(e)}
//               pageSize={currRowsPerPageTahun}
//               setPageSizeChange={(e) => setCurrRowsPerPageTahun(e)}
//               rowCount={lusinBulanan?.length}
//               paginationMode="client"
//             />
//           </Grid>
//           <Grid container mt={4}>
//             <Grid item>
//               <Typography sx={{ fontFamily: "poppins", fontSize: 28, fontWeight: "bold", color: "#12141E" }}>Grafik Produk Terjual</Typography>

//               <LineChart
//                 xAxis={[
//                   {
//                     scaleType: "time",
//                     data: createXData(14),
//                     valueFormatter: (value) => `${monthNames[value?.getMonth()]} ${value?.getFullYear()}`,
//                   },
//                 ]}
//                 series={[
//                   {
//                     data: totalProductGrafik[productID],
//                   },
//                 ]}
//                 yAxis={[
//                   {
//                     tickLabelStyle: {
//                       fontSize: 14,
//                     },
//                     valueFormatter: (value) => `${value} ${findProduct(productID)?.type}`,
//                   },
//                 ]}
//                 width={1000}
//                 height={500}
//                 margin={{ left: 100 }}
//               />
//             </Grid>
//             <Grid item sx={{ display: "flex", alignItems: "center" }}>
//               <TextField id="select-area" select sx={{ width: "400px" }} value={productID} onChange={(e) => setProductID(e?.target?.value)}>
//                 {selectProduct?.map((item, index) => (
//                   <MenuItem value={item?.value} key={index}>
//                     {item?.label}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Grid>
//           </Grid>
//         </Box>
//       </Box>
//     </Box>
//   );
// }


import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { click, setTitle } from "../redux/sidenavReducer";
import {
  Box, MenuItem, TextField, Grid, Typography, Card, CardContent,
  Chip, ToggleButton, ToggleButtonGroup, Divider, Avatar, Stack,
  LinearProgress, Paper, alpha, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
  TablePagination,
} from "@mui/material";
import NavBar from "../component/NavBar";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { fetchTransactionHistory } from "../redux/action/transactionAction";
import { AREA_SELECT } from "../constant/Customer";
import StyledTable from "../component/StyledTable";
import { LUSIN_HEADER, LUSIN_PERBULAN_HEADER } from "../constant/Information";
import { decimalToFraction } from "../utils/stingFormatted";
import { fetchCustomerData } from "../redux/action/customerAction";
import { fetchProductData } from "../redux/action/productAction";
import { PrintBon, PrintLusin } from "../utils/PrintReport";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import PaidIcon from "@mui/icons-material/Paid";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

// ─── Design tokens — crisp modern light ──────────────────────────────────────
const C = {
  bg: "#F0F2F8",
  surface: "#FFFFFF",
  surfaceAlt: "#F7F8FC",
  border: "#E3E7F0",
  borderLight: "#ECEEF6",

  primary: "#3A5BF0",
  primarySoft: "#EEF1FE",
  secondary: "#0BBFA0",
  secondarySoft: "#E5FAF7",
  warning: "#F59E0B",
  warningSoft: "#FEF3C7",
  danger: "#EF4444",
  dangerSoft: "#FEE2E2",
  purple: "#7C3AED",
  purpleSoft: "#F3EFFE",

  text: "#18213E",
  textSub: "#6B7280",
  textDim: "#B0B8CC",

  chartColors: [
    "#3A5BF0","#0BBFA0","#F59E0B","#EF4444",
    "#7C3AED","#EC4899","#06B6D4","#10B981","#F97316","#8B5CF6",
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtShort = (v) => {
  if (!v) return "Rp 0";
  if (v >= 1e9) return `Rp ${(v / 1e9).toFixed(1)}M`;
  if (v >= 1e6) return `Rp ${(v / 1e6).toFixed(1)}Jt`;
  return `Rp ${(v / 1e3).toFixed(0)}K`;
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, trend, color = C.primary, soft = C.primarySoft }) {
  const up = trend >= 0;
  return (
    <Card elevation={0} sx={{
      flex: 1, minWidth: 190,
      border: `1.5px solid ${C.border}`,
      borderRadius: "18px",
      bgcolor: C.surface,
      position: "relative", overflow: "hidden",
      transition: "box-shadow 0.2s, transform 0.2s",
      "&:hover": { boxShadow: `0 8px 28px ${alpha(color, 0.14)}`, transform: "translateY(-2px)" },
    }}>
      <Box sx={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, bgcolor: color, borderRadius: "18px 0 0 18px" }} />
      <CardContent sx={{ pl: 3.5, pr: 2.5, py: 2.5 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Avatar sx={{ bgcolor: soft, color, width: 40, height: 40, mb: 1.5 }}>{icon}</Avatar>
          {trend !== undefined && (
            <Chip size="small"
              icon={up ? <TrendingUpIcon sx={{ fontSize: "13px !important" }} /> : <TrendingDownIcon sx={{ fontSize: "13px !important" }} />}
              label={`${up ? "+" : ""}${trend?.toFixed(1)}%`}
              sx={{
                height: 22, fontSize: "0.68rem", fontWeight: 700, fontFamily: "Plus Jakarta Sans, sans-serif",
                bgcolor: up ? C.secondarySoft : C.dangerSoft,
                color: up ? C.secondary : C.danger,
                "& .MuiChip-icon": { color: "inherit" },
              }} />
          )}
        </Stack>
        <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.68rem", fontWeight: 700, color: C.textSub, textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.4 }}>
          {label}
        </Typography>
        <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "1.5rem", fontWeight: 800, color: C.text, lineHeight: 1.15 }}>
          {value}
        </Typography>
        {sub && <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.7rem", color: C.textDim, mt: 0.4 }}>{sub}</Typography>}
      </CardContent>
    </Card>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function Section({ title, icon, children, action }) {
  return (
    <Card elevation={0} sx={{ border: `1.5px solid ${C.border}`, borderRadius: "20px", bgcolor: C.surface, mb: 3, overflow: "visible" }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
          <Stack direction="row" alignItems="center" gap={1.2}>
            <Avatar sx={{ bgcolor: C.primarySoft, color: C.primary, width: 34, height: 34 }}>{icon}</Avatar>
            <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "1rem", fontWeight: 800, color: C.text }}>{title}</Typography>
          </Stack>
          {action}
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}

// ─── Filter bar ───────────────────────────────────────────────────────────────
function FilterBar({ children }) {
  return (
    <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2}
      sx={{ bgcolor: C.surfaceAlt, border: `1.5px solid ${C.borderLight}`, borderRadius: "12px", px: 2, py: 1.5, mb: 2.5 }}>
      <FilterAltIcon sx={{ color: C.textDim, fontSize: 16 }} />
      {children}
    </Stack>
  );
}

// ─── Styled select ────────────────────────────────────────────────────────────
function Sel({ label, value, onChange, items, width = 180 }) {
  return (
    <TextField select size="small" label={label} value={value} onChange={onChange}
      sx={{
        width,
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px", fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.84rem",
          bgcolor: C.surface, color: C.text,
          "& fieldset": { borderColor: C.border },
          "&:hover fieldset": { borderColor: C.primary },
          "&.Mui-focused fieldset": { borderColor: C.primary },
        },
        "& .MuiInputLabel-root": { fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.8rem", color: C.textSub },
        "& .MuiInputLabel-root.Mui-focused": { color: C.primary },
      }}>
      {items.map((it, i) => (
        <MenuItem key={i} value={typeof it.value === "object" ? JSON.stringify(it.value) : it.value}
          sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.84rem" }}>
          {it.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

const toggleSx = {
  "& .MuiToggleButton-root": {
    fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.75rem", fontWeight: 600,
    color: C.textSub, borderColor: C.border, px: 2, py: 0.6, textTransform: "none",
    "&.Mui-selected": { bgcolor: C.primarySoft, color: C.primary, borderColor: C.primary },
  },
};
const axisStyle = { tickLabelStyle: { fill: C.textSub, fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 11 } };
const chartSx = {
  "& .MuiChartsAxis-line": { stroke: C.border },
  "& .MuiChartsAxis-tick": { stroke: C.border },
  "& .MuiChartsGrid-line": { stroke: C.borderLight },
};
const headSx = {
  fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.69rem", fontWeight: 700,
  color: C.textSub, textTransform: "uppercase", letterSpacing: "0.06em",
  bgcolor: C.surfaceAlt, borderColor: C.borderLight, py: 1.2,
};
const cellSx = {
  fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.82rem",
  color: C.text, borderColor: C.borderLight, py: 1.1,
};

// ─── Omzet per Product table ──────────────────────────────────────────────────
function OmzetProductTable({ rows }) {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("omzet");
  const [pg, setPg] = useState(0);
  const [rpp, setRpp] = useState(10);

  const sorted = useMemo(() =>
    [...rows].sort((a, b) => {
      const diff = (a[orderBy] ?? 0) - (b[orderBy] ?? 0);
      return order === "asc" ? diff : -diff;
    }), [rows, order, orderBy]);

  const paged = sorted.slice(pg * rpp, pg * rpp + rpp);
  const grandTotal = rows.reduce((s, r) => s + r.omzet, 0);

  const handleSort = (col) => {
    if (orderBy === col) setOrder(order === "asc" ? "desc" : "asc");
    else { setOrderBy(col); setOrder("desc"); }
  };

  const cols = [
    { id: "label", label: "Produk", numeric: false },
    { id: "qty",   label: "Total Qty", numeric: true },
    { id: "omzet", label: "Omzet", numeric: true },
    { id: "pct",   label: "Kontribusi", numeric: true },
  ];

  return (
    <Box>
      <TableContainer sx={{ borderRadius: "14px", border: `1.5px solid ${C.border}`, overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {cols.map((col) => (
                <TableCell key={col.id} align={col.numeric ? "right" : "left"} sx={headSx}>
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : "asc"}
                    onClick={() => handleSort(col.id)}
                    sx={{
                      "& .MuiTableSortLabel-icon": { color: `${C.primary} !important` },
                      color: `${C.textSub} !important`,
                      "&.Mui-active": { color: `${C.primary} !important` },
                    }}>
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((row, i) => (
              <TableRow key={row.id}
                sx={{ "&:hover": { bgcolor: C.surfaceAlt }, "&:last-child td": { border: 0 } }}>
                <TableCell sx={cellSx}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: C.chartColors[i % C.chartColors.length], flexShrink: 0 }} />
                    <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.82rem", fontWeight: 600, color: C.text }}>
                      {row.label}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right" sx={cellSx}>
                  {row.qty.toLocaleString("id-ID")}
                </TableCell>
                <TableCell align="right" sx={{ ...cellSx, fontWeight: 700, color: C.primary }}>
                  {fmtShort(row.omzet)}
                </TableCell>
                <TableCell align="right" sx={cellSx}>
                  <Stack alignItems="flex-end" gap={0.5}>
                    <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.76rem", color: C.textSub }}>
                      {row.pct.toFixed(1)}%
                    </Typography>
                    <LinearProgress variant="determinate" value={row.pct}
                      sx={{ width: 64, height: 5, borderRadius: 3, bgcolor: C.borderLight,
                        "& .MuiLinearProgress-bar": { bgcolor: C.chartColors[i % C.chartColors.length], borderRadius: 3 } }} />
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {/* Total footer */}
            <TableRow sx={{ bgcolor: C.primarySoft }}>
              <TableCell sx={{ ...headSx, color: C.primary }}>TOTAL</TableCell>
              <TableCell align="right" sx={{ ...headSx, color: C.primary }}>
                {rows.reduce((s, r) => s + r.qty, 0).toLocaleString("id-ID")}
              </TableCell>
              <TableCell align="right" sx={{ ...headSx, color: C.primary, fontSize: "0.82rem" }}>
                {fmtShort(grandTotal)}
              </TableCell>
              <TableCell align="right" sx={{ ...headSx, color: C.primary }}>100%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div" count={rows.length} page={pg}
        onPageChange={(_, p) => setPg(p)}
        rowsPerPage={rpp}
        onRowsPerPageChange={(e) => { setRpp(+e.target.value); setPg(0); }}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.8rem", color: C.textSub }}
      />
    </Box>
  );
}

// ═══ MAIN COMPONENT ══════════════════════════════════════════════════════════
export default function Information() {
  const now = new Date();
  const currDate = new Date(now.getFullYear(), now.getMonth(), 1);

  const monthNames     = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  const monthNamesFull = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

  // ── state ──
  const [page, setPage]                             = useState(0);
  const [currRowsPerPage, setCurrRowsPerPage]       = useState(30);
  const [pageTahun, setPageTahun]                   = useState(0);
  const [currRowsPerPageTahun, setCurrRowsPerPageTahun] = useState(30);
  const [omzet14, setOmzet14]                       = useState(new Array(14).fill(0));
  const [lusinBulanan, setLusinBulanan]             = useState([]);
  const [areaOmzet, setAreaOmzet]                   = useState("All");
  const [productID, setProductID]                   = useState("");
  const [lusin, setLusin]                           = useState([]);
  const [doc, setDoc]                               = useState([]);
  const [bon, setBon]                               = useState([]);
  const [sumLusin, setSumLusin]                     = useState(0);
  const [areaLusin, setAreaLusin]                   = useState("All");
  const [bulanLusin, setBulanLusin]                 = useState({ month: currDate.getMonth(), year: currDate.getFullYear() });
  const [viewMode, setViewMode]                     = useState("monthly");
  const [selectedYear, setSelectedYear]             = useState(currDate.getFullYear());
  const [chartType, setChartType]                   = useState("line");
  const [totalProductGrafik, setTotalProductGrafik] = useState({});
  const [yearlyOmzet, setYearlyOmzet]               = useState([]);
  const [yearlyLabels, setYearlyLabels]             = useState([]);
  const [omzetPerProduct, setOmzetPerProduct]       = useState([]);
  const [areaOmzetProd, setAreaOmzetProd]           = useState("All");

  const dispatch   = useDispatch();
  const transaction = useSelector((s) => s?.transaction?.transactionHistory);
  const customer    = useSelector((s) => s?.customer?.allCustomer);
  const product     = useSelector((s) => s?.product?.allProduct);

  // ── helpers ──
  function createXData(length) {
    const arr = [];
    for (let i = length - 2; i >= 0; i--)
      arr.push(new Date(currDate.getFullYear(), currDate.getMonth() - i, 1));
    arr.push(new Date(currDate.getFullYear(), currDate.getMonth() + 1, 1));
    return arr;
  }
  const findCustomer = (id) => Object.values(customer).find((c) => c?.id === id);
  const findProduct  = (id) => Object.values(product).find((p) => p?.id === id);

  useEffect(() => {
    dispatch(click(4));
    dispatch(setTitle("Informasi"));
    dispatch(fetchTransactionHistory(99999));
    dispatch(fetchCustomerData());
    dispatch(fetchProductData());
  }, []);

  useEffect(() => {
    const prods = Object.values(product);
    if (prods.length && !productID) setProductID(prods[0]?.id);
  }, [product]);

  // ── omzet + lusin bulanan (14 bulan window) ──
  useEffect(() => {
    const arr       = createXData(14);
    const tempOmzet = new Array(14).fill(0);
    const tempLusin = Array.from({ length: 14 }, () => ({}));

    let trans = Object.values(transaction);
    if (areaOmzet !== "All") trans = trans.filter((t) => findCustomer(t?.customerID)?.area === areaOmzet);

    trans.forEach((t) => {
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i].getTime() <= t?.timestamp && t?.timestamp < arr[i + 1].getTime()) {
          tempOmzet[i] += t?.total || 0;
          Object.entries(t?.product || {}).forEach(([p, val]) => {
            const id = p.startsWith("P") ? p : p.slice(1);
            tempLusin[i][id] = (tempLusin[i][id] || 0) + (val?.productQty || 0);
          });
          break;
        }
      }
    });

    const perBulan = [];
    const grafik   = {};
    Object.values(product).forEach((p) => {
      grafik[p?.id] = new Array(14).fill(0);
      const obj = { label: p?.label, index: p?.index, type: p?.type, id: p?.id };
      tempLusin.forEach((m, idx) => {
        obj[`M${idx}`]    = (obj[`M${idx}`] || 0) + (m[p?.id] || 0);
        grafik[p?.id][idx] = m[p?.id] || 0;
      });
      perBulan.push(obj);
    });
    setTotalProductGrafik(grafik);
    setLusinBulanan(perBulan);
    setOmzet14(tempOmzet);

    // yearly aggregate
    const yearMap = {};
    let transAll = Object.values(transaction);
    if (areaOmzet !== "All") transAll = transAll.filter((t) => findCustomer(t?.customerID)?.area === areaOmzet);
    transAll.forEach((t) => {
      const y = new Date(t?.timestamp).getFullYear();
      yearMap[y] = (yearMap[y] || 0) + (t?.total || 0);
    });
    const ys = Object.keys(yearMap).sort();
    setYearlyLabels(ys);
    setYearlyOmzet(ys.map((y) => yearMap[y]));
  }, [transaction, areaOmzet]);

  // ── lusin bulan terpilih ──
  useEffect(() => {
    let tempLusin = {};
    let tempBon   = {};
    let trans     = Object.values(transaction);
    const before  = new Date(bulanLusin.year, bulanLusin.month, 1).getTime();
    const after   = new Date(bulanLusin.year, bulanLusin.month + 1, 1).getTime();
    if (areaLusin !== "All") trans = trans.filter((t) => findCustomer(t?.customerID)?.area === areaLusin);

    trans.forEach((t) => {
      if (before <= t?.timestamp && t?.timestamp < after && t?.isDelivered === 1) {
        if (tempBon[t?.customerID]) {
          tempBon[t?.customerID] = {
            ...tempBon[t?.customerID],
            allPaid: tempBon[t?.customerID].allPaid === 0 ? 0 : t?.isPaid,
            invoice: [...tempBon[t?.customerID].invoice, { invoice: t?.id, time: t?.timestamp, product: t?.product, discount: t?.discount, total: t?.total, isPaid: t?.isPaid }],
            rowSpan: tempBon[t?.customerID].rowSpan + Object.keys(t?.product).length,
          };
        } else {
          tempBon[t?.customerID] = {
            id: t?.customerID,
            name: `${t?.ownerName !== "-" ? t?.ownerName : ""}${t?.ownerName !== "-" && t?.merchantName !== "-" ? ", " : ""}${t?.merchantName !== "-" ? t?.merchantName : ""}`,
            area: findCustomer(t?.customerID)?.area,
            allPaid: t?.isPaid,
            invoice: [{ invoice: t?.id, time: t?.timestamp, product: t?.product, discount: t?.discount, total: t?.total, isPaid: t?.isPaid }],
            rowSpan: Object.keys(t?.product).length,
          };
        }
        Object.keys(t?.product).forEach((p) => {
          const id = p[0] === "P" ? p : p.slice(1);
          tempLusin[id] = (tempLusin[id] || 0) + t?.product[p]?.productQty;
        });
      }
    });

    let tempSum = 0;
    const newer = Object.keys(tempLusin).map((k) => {
      const p = findProduct(k);
      tempSum += tempLusin[k] * (p?.totalLusin || 0);
      return { value: tempLusin[k], label: p?.label, index: p?.index, type: p?.type, totalLusin: p?.totalLusin, id: p?.id };
    });
    const newerBon = Object.values(tempBon)
      .sort((a, b) => a?.name.localeCompare(b?.name))
      .sort((a, b) => a?.allPaid - b?.allPaid);

    const existIds = new Set(newer.map((i) => i.id));
    Object.values(product).forEach((p) => {
      if (!existIds.has(p?.id))
        newer.push({ value: 0, label: p?.label, index: p?.index, type: p?.type, totalLusin: p?.totalLusin, id: p?.id });
    });
    newer.sort((a, b) => a?.index - b?.index);

    setDoc(newer.filter((i) => !(i?.type === "Gen" && i?.value === 0)));
    setBon(newerBon);
    setSumLusin(tempSum);
    setLusin(newer);
  }, [transaction, bulanLusin, areaLusin]);

  // ── Omzet per produk — 12 bulan terakhir ──
  // Rumus per line produk: (price - discount_per_produk) * productQty
  useEffect(() => {
    // rentang 12 bulan terakhir
    const start12 = new Date(currDate.getFullYear(), currDate.getMonth() - 11, 1).getTime();
    const end12   = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 1).getTime();

    let trans = Object.values(transaction);
    if (areaOmzetProd !== "All") trans = trans.filter((t) => findCustomer(t?.customerID)?.area === areaOmzetProd);

    // prodMap: id -> { qty, omzet, hasPrice }
    const prodMap = {};

    trans.forEach((t) => {
      if (t?.timestamp < start12 || t?.timestamp >= end12) return;
      const prods = t?.product || {};

      // hitung total omzet dari price field per produk jika tersedia
      let lineHasPrice = false;
      Object.entries(prods).forEach(([pKey, pVal]) => {
        const id  = pKey.startsWith("P") ? pKey : pKey.slice(1);
        const qty = pVal?.productQty || 0;
        if (!prodMap[id]) prodMap[id] = { qty: 0, omzet: 0, hasPrice: false };
        prodMap[id].qty += qty;

        const price = pVal?.price ?? 0;

        // Discount: cek berbagai lokasi penyimpanan diskon
        let discount = 0;
        if (pVal?.discount !== undefined && pVal.discount !== null) {
          // diskon tersimpan di level produk transaksi
          discount = typeof pVal.discount === "number" ? pVal.discount : 0;
        } else if (t?.discount !== undefined && t?.discount !== null) {
          if (typeof t.discount === "number") {
            // flat discount dibagi rata ke semua qty produk
            discount = t.discount;
          } else if (typeof t.discount === "object") {
            // discount object: coba match by pKey, id, atau "default"
            const dv = t.discount[pKey] ?? t.discount[id] ?? t.discount["default"] ?? 0;
            discount = typeof dv === "number" ? dv : 0;
          }
        }

        if (price > 0) {
          prodMap[id].omzet   += Math.max(0, price - discount) * qty;
          prodMap[id].hasPrice = true;
          lineHasPrice         = true;
        }
      });

      // Fallback: jika tidak ada harga per produk, distribusikan t.total secara proporsional
      if (!lineHasPrice && t?.total > 0) {
        const totalQty = Object.values(prods).reduce((s, v) => s + (v?.productQty || 0), 0);
        if (totalQty > 0) {
          Object.entries(prods).forEach(([pKey, pVal]) => {
            const id  = pKey.startsWith("P") ? pKey : pKey.slice(1);
            const qty = pVal?.productQty || 0;
            if (!prodMap[id]) prodMap[id] = { qty: 0, omzet: 0, hasPrice: false };
            prodMap[id].omzet += (qty / totalQty) * (t?.total || 0);
          });
        }
      }
    });

    const grandTotal = Object.values(prodMap).reduce((s, v) => s + v.omzet, 0);

    const rows = Object.keys(prodMap).map((id) => {
      const p = findProduct(id);
      return {
        id,
        label : p?.label || id,
        index : p?.index ?? 999,
        qty   : prodMap[id].qty,
        omzet : prodMap[id].omzet,
        pct   : grandTotal ? (prodMap[id].omzet / grandTotal) * 100 : 0,
      };
    });

    // Tambahkan produk dengan 0 jika tidak ada transaksi
    const existIds = new Set(rows.map((r) => r.id));
    Object.values(product).forEach((p) => {
      if (!existIds.has(p?.id))
        rows.push({ id: p?.id, label: p?.label, index: p?.index ?? 999, qty: 0, omzet: 0, pct: 0 });
    });
    rows.sort((a, b) => a.index - b.index);
    setOmzetPerProduct(rows);
  }, [transaction, areaOmzetProd]);

  // ── derived ──
  const xData14 = createXData(14);
  // 12 bulan terakhir = index 1..12 dalam array 14-item
  // xData14[0]=13 bln lalu, xData14[1..12]=12 bln terakhir, xData14[13]=bln depan (sentinel)
  const xData12  = xData14.slice(1, 13);
  const omzet12  = omzet14.slice(1, 13);
  const total12  = omzet12.reduce((a, b) => a + b, 0);

  // bulan ini = index 12 (karena sentinel bln depan ada di index 13)
  const currentMonthOmzet = omzet14[12] || 0;
  const prevMonthOmzet    = omzet14[11] || 0;
  const omzetTrend        = prevMonthOmzet ? ((currentMonthOmzet - prevMonthOmzet) / prevMonthOmzet) * 100 : 0;

  const topProduct = useMemo(() => [...lusin].sort((a, b) => b.value - a.value)[0], [lusin]);

  const pieData = useMemo(() =>
    lusin.filter((l) => l.value > 0).slice(0, 8).map((l, i) => ({
      id: l.id, value: l.value, label: l.label, color: C.chartColors[i % C.chartColors.length],
    })), [lusin]);

  const omzetProdPieData = useMemo(() =>
    omzetPerProduct.filter((r) => r.omzet > 0).slice(0, 8).map((r, i) => ({
      id: r.id, value: Math.round(r.omzet), label: r.label, color: C.chartColors[i % C.chartColors.length],
    })), [omzetPerProduct]);

  const yearlyMonthlyOmzet = useMemo(() => {
    const monthly = new Array(12).fill(0);
    Object.values(transaction).forEach((t) => {
      const d = new Date(t?.timestamp);
      if (d.getFullYear() === selectedYear && (areaOmzet === "All" || findCustomer(t?.customerID)?.area === areaOmzet))
        monthly[d.getMonth()] += t?.total || 0;
    });
    return monthly;
  }, [transaction, selectedYear, areaOmzet]);

  const availableYears = useMemo(() => {
    const years = new Set(Object.values(transaction).map((t) => new Date(t?.timestamp).getFullYear()));
    return [...years].sort().reverse();
  }, [transaction]);

  const selectMonth   = xData14.map((a) => ({
    value: JSON.stringify({ month: a.getMonth(), year: a.getFullYear() }),
    label: `${monthNamesFull[a.getMonth()]} ${a.getFullYear()}`,
  }));
  const selectProduct = Object.values(product).map((a) => ({ value: a?.id, label: a?.label }));

  const rangeLabel12 = xData12.length === 12
    ? `${monthNamesFull[xData12[0].getMonth()]} ${xData12[0].getFullYear()} – ${monthNamesFull[xData12[11].getMonth()]} ${xData12[11].getFullYear()}`
    : "";

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: C.bg }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700;800&display=swap');`}</style>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>

      <NavBar />

      <Box sx={{ px: { xs: 2, md: 4 }, pb: 6, pt: 2, maxWidth: 1440, mx: "auto" }}>

        {/* ── Header ── */}
        <Stack direction="row" alignItems="flex-end" justifyContent="space-between" mb={3} mt={2}
          sx={{ animation: "fadeUp 0.35s ease both" }}>
          <Box>
            <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "1.7rem", fontWeight: 800, color: C.text, letterSpacing: "-0.02em" }}>
              Dashboard Informasi
            </Typography>
            <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.8rem", color: C.textSub, mt: 0.2 }}>
              Data penjualan & omzet real-time
            </Typography>
          </Box>
          <Chip label="● Live"
            sx={{ bgcolor: C.secondarySoft, color: C.secondary, fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 700, fontSize: "0.75rem" }} />
        </Stack>

        {/* ── KPI Row ── */}
        <Stack direction="row" flexWrap="wrap" gap={2} mb={3}
          sx={{ animation: "fadeUp 0.4s ease both" }}>
          <KpiCard
            icon={<PaidIcon sx={{ fontSize: 18 }} />}
            label="Omzet Bulan Ini"
            value={fmtShort(currentMonthOmzet)}
            sub={`vs ${fmtShort(prevMonthOmzet)} bulan lalu`}
            trend={omzetTrend}
            color={C.primary} soft={C.primarySoft} />
          <KpiCard
            icon={<BarChartIcon sx={{ fontSize: 18 }} />}
            label="Total Omzet 12 Bln Terakhir"
            value={fmtShort(total12)}
            sub={rangeLabel12}
            color={C.secondary} soft={C.secondarySoft} />
          <KpiCard
            icon={<Inventory2Icon sx={{ fontSize: 18 }} />}
            label="Total Lusin Bulan Ini"
            value={`${decimalToFraction(sumLusin)} Lsn`}
            color={C.warning} soft={C.warningSoft} />
          {topProduct && (
            <KpiCard
              icon={<DonutLargeIcon sx={{ fontSize: 18 }} />}
              label="Produk Terlaris Bulan Ini"
              value={topProduct.label}
              sub={`${topProduct.value} unit`}
              color={C.purple} soft={C.purpleSoft} />
          )}
        </Stack>

        {/* ══ 1. Data Lusin Bulanan ══ */}
        <Box sx={{ animation: "fadeUp 0.45s ease both" }}>
          <Section title="Data Lusin Bulanan" icon={<TableChartIcon sx={{ fontSize: 17 }} />}
            action={
              <Stack direction="row" gap={1} alignItems="center">
                <Chip label={`${decimalToFraction(sumLusin)} Lusin`}
                  sx={{ bgcolor: C.primarySoft, color: C.primary, fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 700, fontSize: "0.8rem" }} />
                <PrintLusin doc={doc} sumLusin={sumLusin} date={bulanLusin} area={areaLusin} />
                <PrintBon doc={bon} date={bulanLusin} area={areaLusin} />
              </Stack>
            }>
            <FilterBar>
              <Sel label="Daerah" value={areaLusin} onChange={(e) => setAreaLusin(e.target.value)}
                items={[{ value: "All", label: "Semua" }, ...AREA_SELECT]} />
              <Sel label="Bulan" value={JSON.stringify(bulanLusin)}
                onChange={(e) => setBulanLusin(JSON.parse(e.target.value))}
                items={selectMonth} width={220} />
            </FilterBar>

            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <StyledTable headers={LUSIN_HEADER} rows={lusin}
                  page={page} setPage={setPage}
                  pageSize={currRowsPerPage} setPageSizeChange={setCurrRowsPerPage}
                  rowCount={lusin?.length} paginationMode="client" />
              </Grid>
              <Grid item xs={12} md={5}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", pt: 1 }}>
                  <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: C.textSub, mb: 1.5, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    Komposisi Produk
                  </Typography>
                  {pieData.length > 0 ? (
                    <>
                      <PieChart
                        series={[{ data: pieData, innerRadius: 50, outerRadius: 100, paddingAngle: 2, cornerRadius: 5, cx: 130 }]}
                        width={290} height={230}
                        sx={{ ...chartSx, "& .MuiChartsLegend-root": { display: "none" } }}
                      />
                      <Stack spacing={0.6} sx={{ width: "100%", maxWidth: 250, mt: 1.5 }}>
                        {pieData.map((d) => (
                          <Stack key={d.id} direction="row" alignItems="center" justifyContent="space-between">
                            <Stack direction="row" alignItems="center" gap={0.8}>
                              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: d.color, flexShrink: 0 }} />
                              <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.74rem", color: C.textSub }}>{d.label}</Typography>
                            </Stack>
                            <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.74rem", color: C.text, fontWeight: 700 }}>{d.value}</Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </>
                  ) : (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 180 }}>
                      <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", color: C.textDim, fontSize: "0.84rem" }}>Tidak ada data</Typography>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Section>
        </Box>

        {/* ══ 2. Omzet Penjualan ══ */}
        <Box sx={{ animation: "fadeUp 0.5s ease both" }}>
          <Section title="Omzet Penjualan" icon={<ShowChartIcon sx={{ fontSize: 17 }} />}
            action={
              <ToggleButtonGroup value={viewMode} exclusive onChange={(_, v) => v && setViewMode(v)} size="small" sx={toggleSx}>
                <ToggleButton value="monthly"><CalendarMonthIcon sx={{ fontSize: 13, mr: 0.5 }} />Bulanan</ToggleButton>
                <ToggleButton value="yearly"><BarChartIcon sx={{ fontSize: 13, mr: 0.5 }} />Tahunan</ToggleButton>
              </ToggleButtonGroup>
            }>
            <FilterBar>
              <Sel label="Daerah" value={areaOmzet} onChange={(e) => setAreaOmzet(e.target.value)}
                items={[{ value: "All", label: "Semua" }, ...AREA_SELECT]} />
              {viewMode === "yearly" && (
                <Sel label="Tahun" value={String(selectedYear)}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  items={availableYears.map((y) => ({ value: String(y), label: String(y) }))} width={110} />
              )}
              <Box sx={{ ml: "auto" }}>
                <ToggleButtonGroup value={chartType} exclusive onChange={(_, v) => v && setChartType(v)} size="small" sx={toggleSx}>
                  <ToggleButton value="line"><ShowChartIcon sx={{ fontSize: 13 }} /></ToggleButton>
                  <ToggleButton value="bar"><StackedBarChartIcon sx={{ fontSize: 13 }} /></ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </FilterBar>

            {viewMode === "monthly" ? (
              chartType === "line" ? (
                <LineChart
                  xAxis={[{ scaleType: "time", data: xData12, valueFormatter: (v) => `${monthNames[v.getMonth()]} ${v.getFullYear()}`, ...axisStyle }]}
                  series={[{ data: omzet12, color: C.primary, area: true, showMark: true, valueFormatter: (v) => fmtShort(v) }]}
                  yAxis={[{ valueFormatter: (v) => fmtShort(v), ...axisStyle }]}
                  height={320} margin={{ left: 88, right: 20, top: 20, bottom: 50 }}
                  sx={{ ...chartSx, "& .MuiAreaElement-root": { fillOpacity: 0.08 } }}
                />
              ) : (
                <BarChart
                  xAxis={[{ scaleType: "band", data: xData12.map((d) => `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`), tickLabelStyle: { fill: C.textSub, fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 10 } }]}
                  series={[{ data: omzet12, color: C.primary, valueFormatter: (v) => fmtShort(v) }]}
                  yAxis={[{ valueFormatter: (v) => fmtShort(v), ...axisStyle }]}
                  height={320} margin={{ left: 88, right: 20, top: 20, bottom: 55 }}
                  sx={chartSx} borderRadius={6}
                />
              )
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: C.textSub, mb: 1, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    Per Bulan — {selectedYear}
                  </Typography>
                  <BarChart
                    xAxis={[{ scaleType: "band", data: monthNames, tickLabelStyle: { fill: C.textSub, fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 11 } }]}
                    series={[{ data: yearlyMonthlyOmzet, color: C.secondary, valueFormatter: (v) => fmtShort(v) }]}
                    yAxis={[{ valueFormatter: (v) => fmtShort(v), ...axisStyle }]}
                    height={270} margin={{ left: 80, right: 15, top: 10, bottom: 40 }}
                    sx={chartSx} borderRadius={5}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: C.textSub, mb: 1, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                    Perbandingan Antar Tahun
                  </Typography>
                  <BarChart
                    xAxis={[{ scaleType: "band", data: yearlyLabels, tickLabelStyle: { fill: C.textSub, fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 11 } }]}
                    series={[{ data: yearlyOmzet, color: C.warning, valueFormatter: (v) => fmtShort(v) }]}
                    yAxis={[{ valueFormatter: (v) => fmtShort(v), ...axisStyle }]}
                    height={270} margin={{ left: 80, right: 15, top: 10, bottom: 40 }}
                    sx={chartSx} borderRadius={5}
                  />
                </Grid>
              </Grid>
            )}

            <Divider sx={{ my: 3, borderColor: C.borderLight }} />
            <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.9rem", fontWeight: 800, color: C.text, mb: 2 }}>
              Tabel Lusin per Bulan
            </Typography>
            <StyledTable
              headers={LUSIN_PERBULAN_HEADER(xData14, monthNamesFull)}
              rows={lusinBulanan}
              page={pageTahun} setPage={setPageTahun}
              pageSize={currRowsPerPageTahun} setPageSizeChange={setCurrRowsPerPageTahun}
              rowCount={lusinBulanan?.length} paginationMode="client"
            />
          </Section>
        </Box>

        {/* ══ 3. Omzet per Produk ══ */}
        <Box sx={{ animation: "fadeUp 0.55s ease both" }}>
          <Section title="Omzet per Produk — 12 Bulan Terakhir" icon={<ShoppingBagIcon sx={{ fontSize: 17 }} />}
            action={
              <Chip label={rangeLabel12} size="small"
                sx={{ bgcolor: C.primarySoft, color: C.primary, fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600, fontSize: "0.71rem" }} />
            }>
            <FilterBar>
              <Sel label="Daerah" value={areaOmzetProd} onChange={(e) => setAreaOmzetProd(e.target.value)}
                items={[{ value: "All", label: "Semua" }, ...AREA_SELECT]} />
              <Typography sx={{ ml: "auto", fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.72rem", color: C.textDim, fontStyle: "italic" }}>
                Omzet = Σ (harga − diskon) × qty per transaksi, dikelompokkan per produk
              </Typography>
            </FilterBar>

            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <OmzetProductTable rows={omzetPerProduct} />
              </Grid>
              <Grid item xs={12} md={5}>
                <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.72rem", fontWeight: 700, color: C.textSub, mb: 1.5, textTransform: "uppercase", letterSpacing: "0.07em", textAlign: "center" }}>
                  Distribusi Omzet per Produk
                </Typography>
                {omzetProdPieData.length > 0 ? (
                  <>
                    <PieChart
                      series={[{
                        data: omzetProdPieData,
                        innerRadius: 50, outerRadius: 100, paddingAngle: 2, cornerRadius: 5, cx: 130,
                        valueFormatter: (v) => fmtShort(v.value),
                      }]}
                      width={290} height={230}
                      sx={{ ...chartSx, "& .MuiChartsLegend-root": { display: "none" } }}
                    />
                    <Stack spacing={0.6} sx={{ width: "100%", maxWidth: 250, mt: 1.5, mx: "auto" }}>
                      {omzetProdPieData.map((d) => (
                        <Stack key={d.id} direction="row" alignItems="center" justifyContent="space-between">
                          <Stack direction="row" alignItems="center" gap={0.8}>
                            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: d.color, flexShrink: 0 }} />
                            <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.74rem", color: C.textSub }}>{d.label}</Typography>
                          </Stack>
                          <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.74rem", color: C.text, fontWeight: 700 }}>{fmtShort(d.value)}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 180 }}>
                    <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", color: C.textDim, fontSize: "0.84rem" }}>Tidak ada data</Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Section>
        </Box>

        {/* ══ 4. Grafik Produk Terjual ══ */}
        <Box sx={{ animation: "fadeUp 0.6s ease both" }}>
          <Section title="Grafik Produk Terjual" icon={<ShowChartIcon sx={{ fontSize: 17 }} />}>
            <FilterBar>
              <Sel label="Produk" value={productID} onChange={(e) => setProductID(e.target.value)}
                items={selectProduct} width={320} />
            </FilterBar>

            <LineChart
              xAxis={[{ scaleType: "time", data: xData14, valueFormatter: (v) => `${monthNames[v.getMonth()]} ${v.getFullYear()}`, ...axisStyle }]}
              series={[{
                data: totalProductGrafik[productID] || new Array(14).fill(0),
                color: C.purple, area: true, showMark: true,
                valueFormatter: (v) => `${v} ${findProduct(productID)?.type || ""}`,
              }]}
              yAxis={[{ valueFormatter: (v) => `${v} ${findProduct(productID)?.type || ""}`, ...axisStyle }]}
              height={300} margin={{ left: 72, right: 20, top: 20, bottom: 50 }}
              sx={{ ...chartSx, "& .MuiAreaElement-root": { fillOpacity: 0.09 } }}
            />

            <Divider sx={{ my: 3, borderColor: C.borderLight }} />
            <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.9rem", fontWeight: 800, color: C.text, mb: 2 }}>
              Top 5 Produk — Bulan Ini
            </Typography>
            <Stack spacing={2}>
              {[...lusin].sort((a, b) => b.value - a.value).slice(0, 5).map((item, i) => {
                const max = lusin.reduce((m, l) => Math.max(m, l.value), 1);
                return (
                  <Box key={item.id}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.7}>
                      <Stack direction="row" alignItems="center" gap={1.2}>
                        <Avatar sx={{ width: 22, height: 22, bgcolor: alpha(C.chartColors[i], 0.15), color: C.chartColors[i], fontSize: "0.65rem", fontWeight: 800 }}>
                          {i + 1}
                        </Avatar>
                        <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.84rem", fontWeight: 600, color: C.text }}>{item.label}</Typography>
                      </Stack>
                      <Typography sx={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.84rem", fontWeight: 700, color: C.chartColors[i] }}>
                        {item.value} unit
                      </Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={(item.value / max) * 100}
                      sx={{ height: 7, borderRadius: 4, bgcolor: alpha(C.chartColors[i], 0.1),
                        "& .MuiLinearProgress-bar": { bgcolor: C.chartColors[i], borderRadius: 4 } }} />
                  </Box>
                );
              })}
            </Stack>
          </Section>
        </Box>

      </Box>
    </Box>
  );
}