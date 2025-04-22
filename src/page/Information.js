import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { click, setTitle } from "../redux/sidenavReducer";
import { Box, MenuItem, TextField, Grid, Typography } from "@mui/material";
import NavBar from "../component/NavBar";
import { LineChart } from "@mui/x-charts/LineChart";
import { fetchTransactionHistory } from "../redux/action/transactionAction";
import { AREA_SELECT } from "../constant/Customer";
import StyledTable from "../component/StyledTable";
import { LUSIN_HEADER, LUSIN_PERBULAN_HEADER } from "../constant/Information";
import { decimalToFraction, decimalToFraction2 } from "../utils/stingFormatted";
import { fetchCustomerData } from "../redux/action/customerAction";
import { fetchProductData } from "../redux/action/productAction";
import { PrintBon, PrintLusin } from "../utils/PrintReport";

export default function Information() {
  const currDate = new Date();
  currDate.setDate(1);
  currDate.setHours(0, 0, 0, 0);

  const [page, setPage] = useState(0);
  const [currRowsPerPage, setCurrRowsPerPage] = useState(30);
  const [pageTahun, setPageTahun] = useState(0);
  const [currRowsPerPageTahun, setCurrRowsPerPageTahun] = useState(30);
  const [omzet, setOmzet] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [lusinBulanan, setLusinBulanan] = useState([]);
  const [areaOmzet, setAreaOmzet] = useState("All");
  const [productID, setProductID] = useState("P1");
  const [lusin, setLusin] = useState([]);
  const [doc, setDoc] = useState([]);
  const [bon, setBon] = useState([]);
  const [sumLusin, setSumLusin] = useState(0);
  const [areaLusin, setAreaLusin] = useState("All");
  const [bulanLusin, setBulanLusin] = useState({ month: new Date(currDate).getMonth(), year: new Date(currDate).getFullYear() });

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const dispatch = useDispatch();
  const transaction = useSelector((state) => state.transaction.transactionHistory);
  const customer = useSelector((state) => state?.customer?.allCustomer);
  const product = useSelector((state) => state?.product?.allProduct);

  const [totalProductGrafik, setTotalProductGrafik] = useState(() => {
    const bulanLength = 12;
    const initial = {};
    Object.values(product).forEach((p) => {
      initial[p.id] = new Array(bulanLength).fill(0);
    });
    return initial;
  });

  function createXData(length) {
    const array = [];

    for (let i = length - 2; i >= 0; i--) {
      const temp = new Date(currDate).setMonth(currDate.getMonth() - i);

      array.push(new Date(temp)); // Example: Push the current index
    }
    const temp = new Date(currDate).setMonth(currDate.getMonth() + 1);

    array.push(new Date(temp)); // Example: Push the current index
    return array;
  }
  function findCustomer(id) {
    return Object.values(customer).find((customer) => customer?.id === id);
  }
  function findProduct(id) {
    return Object.values(product).find((product) => product?.id === id);
  }
  useEffect(() => {
    setAreaOmzet("All");
    dispatch(click(4));
    dispatch(setTitle("Informasi"));
    dispatch(fetchTransactionHistory(99999));
    dispatch(fetchCustomerData());
    dispatch(fetchProductData());
  }, []);

  useEffect(() => {
    // Omzet
    const tempDataOmzet = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const tempDataLusin = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    let arr = createXData(12);
    let trans = Object.values(transaction);

    if (areaOmzet !== "All") trans = trans.filter((t) => findCustomer(t?.customerID)?.area === areaOmzet);
    trans.forEach((t) => {
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i].getTime() < t?.timestamp && t?.timestamp < arr[i + 1].getTime()) {
          tempDataOmzet[i] = (tempDataOmzet[i] || 0) + (t?.total || 0);
          break; // Hentikan loop setelah ketemu rentangnya
        }
      }

      // tabel produk semua bulan
      for (let i = 0; i < arr?.length - 1; i++) {
        if (arr[i].getTime() < t?.timestamp && t?.timestamp < arr[i + 1].getTime()) {
          const product = t?.product;
          Object.entries(product).forEach(([p, value]) => {
            const newId = p.startsWith("P") ? p : p.slice(1);
            tempDataLusin[i] = {
              ...tempDataLusin[i],
              [newId]: (tempDataLusin[i]?.[newId] || 0) + (value?.productQty || 0),
            };
          });
          break; // langsung break setelah nemu rentangnya
        }
      }
    });
    const totalPerBulan = [];
    const totalPerBulanGrafik = {};
    Object.values(product).forEach((p) => {
      if (!totalPerBulanGrafik[p?.id]) {
        totalPerBulanGrafik[p?.id] = [];
      }
      const tempObject = { label: p?.label, index: p?.index, type: p?.type, id: p?.id };
      Object.keys(tempDataLusin).forEach((m, idx) => {
        if (tempObject[`M${m}`] === undefined) tempObject[`M${m}`] = tempDataLusin[m][p.id] || 0;
        else tempObject[`M${m}`] += tempDataLusin[m][p.id];
        if (totalPerBulanGrafik[p?.id][idx] === undefined) {
          totalPerBulanGrafik[p?.id][idx] = tempDataLusin[m][p.id] || 0;
        } else {
          totalPerBulanGrafik[p?.id][idx] += tempDataLusin[m][p.id] || 0;
        }
      });
      totalPerBulan.push(tempObject);
    });
    setTotalProductGrafik(totalPerBulanGrafik);
    setLusinBulanan(totalPerBulan);
    setOmzet(tempDataOmzet);
  }, [transaction, areaOmzet]);
  useEffect(() => {
    let tempLusin = {};
    let trans = Object.values(transaction);
    let tempDateYear = new Date(currDate).setFullYear(bulanLusin?.year);
    let before = new Date(tempDateYear).setMonth(bulanLusin?.month);
    let after = new Date(before).setMonth(bulanLusin?.month + 1);
    let newtrans = [];
    let tempBon = {};
    // tabel produk semua bulan

    if (areaLusin !== "All") trans = trans.filter((t) => findCustomer(t?.customerID)?.area === areaLusin);

    trans.forEach((t) => {
      //tabel produk per bulan
      if (before < t?.timestamp && t?.timestamp < after && t?.isDelivered === 1) {
        newtrans = [...newtrans, t];

        if (tempBon?.hasOwnProperty(t?.customerID)) {
          tempBon = {
            ...tempBon,
            [t?.customerID]: {
              ...tempBon[t?.customerID],
              allPaid: tempBon[t?.customerID]?.allPaid === 0 ? 0 : t?.isPaid,
              invoice: [...tempBon[t?.customerID]?.invoice, { invoice: t?.id, time: t?.timestamp, product: t?.product, discount: t?.discount, total: t?.total, isPaid: t?.isPaid }],
              rowSpan: tempBon[t?.customerID]?.rowSpan + Object.keys(t?.product)?.length,
            },
          };
        } else {
          tempBon = {
            ...tempBon,
            [t?.customerID]: {
              id: t?.customerID,
              name: `${t?.ownerName !== "-" ? t?.ownerName : ""}${t?.ownerName !== "-" && t?.merchantName !== "-" ? ", " : ""}${t?.merchantName !== "-" ? t?.merchantName : ""}`,
              area: findCustomer(t?.customerID)?.area,
              allPaid: t?.isPaid,
              invoice: [{ invoice: t?.id, time: t?.timestamp, product: t?.product, discount: t?.discount, total: t?.total, isPaid: t?.isPaid }],
              rowSpan: Object.keys(t?.product)?.length,
            },
          };
        }
        const product = t?.product;
        Object.keys(product).forEach((p) => {
          const newId = p[0] === "P" ? p : p?.slice(1);
          if (tempLusin?.hasOwnProperty(newId)) {
            tempLusin = {
              ...tempLusin,
              [newId]: tempLusin[newId] + product[p]?.productQty,
            };
          } else {
            tempLusin = {
              ...tempLusin,
              [newId]: product[p]?.productQty,
            };
          }
        });
      }
    });

    let tempSumLusin = 0;
    const newer = Object.keys(tempLusin).map((tem) => {
      const product = findProduct(tem);
      tempSumLusin += tempLusin[tem] * product?.totalLusin;
      return { value: tempLusin[tem], label: product?.label, index: product?.index, type: product?.type, totalLusin: product?.totalLusin, id: product?.id };
    });

    const newerBon = Object.keys(tempBon).map((bon) => {
      return { ...tempBon[bon] };
    });

    const existingIds = new Set(newer.map((item) => item.id));
    Object.values(product).forEach((newItem) => {
      if (!existingIds.has(newItem?.id)) {
        newer.push({ value: 0, label: newItem?.label, index: newItem?.index, type: newItem?.type, totalLusin: newItem?.totalLusin, id: newItem?.id });
      }
    });

    newer.sort((a, b) => {
      return a?.index - b?.index;
    });
    newerBon
      .sort((a, b) => {
        return a?.name.localeCompare(b?.name);
      })
      .sort((a, b) => {
        return a?.allPaid - b?.allPaid;
      });

    const doc = newer.filter((item) => !(item?.type === "Gen" && item?.value === 0));
    setDoc(doc);
    setBon(newerBon);
    setSumLusin(tempSumLusin);
    setLusin(newer);
  }, [transaction, bulanLusin, areaLusin]);

  let selectMonth = createXData(12);
  selectMonth = selectMonth.map((a) => {
    return { value: { month: a?.getMonth(), year: a?.getFullYear() }, label: `${monthNames[a?.getMonth()]} ${a?.getFullYear()}` };
  });
  let selectProduct = Object.values(product).map((a) => {
    return { value: a?.id, label: a?.label };
  });
  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ width: "100%", pr: 5 }}>
        <NavBar />
        <Box sx={{ backgroundColor: "white", borderRadius: "10px", p: 4, mt: 4, width: "96%" }}>
          <Grid container>
            <Grid item sx={{ width: "50%" }}>
              <Typography sx={{ fontFamily: "poppins", fontSize: 28, fontWeight: "bold", color: "#12141E" }}>Data Lusin Bulanan</Typography>

              <StyledTable headers={LUSIN_HEADER} rows={lusin} page={page} setPage={(e) => setPage(e)} pageSize={currRowsPerPage} setPageSizeChange={(e) => setCurrRowsPerPage(e)} rowCount={lusin?.length} paginationMode="client" />
            </Grid>
            <Grid item sx={{ display: "flex", flexDirection: "column", gap: 5, marginLeft: 10, marginTop: 5 }}>
              <Grid item>
                <Typography sx={{ fontFamily: "poppins", fontSize: 18, fontWeight: "bold", color: "#12141E" }}>Input Daerah</Typography>

                <TextField id="select-area" select sx={{ width: "200px" }} value={areaLusin} onChange={(e) => setAreaLusin(e.target.value)}>
                  {[{ value: "All", label: "Semua" }, ...AREA_SELECT].map((item, index) => (
                    <MenuItem value={item?.value} key={index}>
                      {item.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item>
                <Typography sx={{ fontFamily: "poppins", fontSize: 18, fontWeight: "bold", color: "#12141E" }}>Input Bulan</Typography>

                <TextField id="select-bulan-lusin" select sx={{ width: "200px" }} value={JSON.stringify(bulanLusin)} onChange={(e) => setBulanLusin(JSON.parse(e.target.value))}>
                  {selectMonth?.map((item, index) => (
                    <MenuItem value={JSON.stringify(item?.value)} key={index}>
                      {item?.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item sx={{ display: "flex", gap: 2 }}>
                <Typography sx={{ fontFamily: "poppins", fontSize: 24, fontWeight: "bold", color: "#12141E" }}>Total Lusin : </Typography>
                <Typography sx={{ fontFamily: "poppins", fontSize: 24, fontWeight: "normal", color: "#12141E" }}>{decimalToFraction(sumLusin)}</Typography>
                <Typography sx={{ fontFamily: "poppins", fontSize: 24, fontWeight: "bold", color: "#12141E" }}>Lusin</Typography>
              </Grid>
              <Grid item container alignItems={"center"} gap={2}>
                <Typography sx={{ fontFamily: "poppins", fontSize: 24, fontWeight: "bold", color: "#12141E" }}>Laporan Penjualan:</Typography>
                <PrintLusin doc={doc} sumLusin={sumLusin} date={bulanLusin} area={areaLusin} />
              </Grid>
              <Grid item container alignItems={"center"} gap={2}>
                <Typography sx={{ fontFamily: "poppins", fontSize: 24, fontWeight: "bold", color: "#12141E" }}>Laporan Nota Bon:</Typography>
                <PrintBon doc={bon} date={bulanLusin} area={areaLusin} />
              </Grid>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ backgroundColor: "white", borderRadius: "10px", p: 4, mt: 4 }}>
          <Grid container>
            <Grid item>
              <Typography sx={{ fontFamily: "poppins", fontSize: 28, fontWeight: "bold", color: "#12141E" }}>Omset Bulanan</Typography>

              <LineChart
                xAxis={[
                  {
                    scaleType: "time",
                    data: createXData(12),
                    valueFormatter: (value) => `${monthNames[value?.getMonth()]} ${value?.getFullYear()}`,
                  },
                ]}
                series={[
                  {
                    data: omzet,
                  },
                ]}
                yAxis={[
                  {
                    tickLabelStyle: {
                      fontSize: 14,
                    },
                    valueFormatter: (value) => `${value / 1000000} Jt`,
                  },
                ]}
                width={1000}
                height={500}
                margin={{ left: 100 }}
              />
            </Grid>
            <Grid item sx={{ display: "flex", alignItems: "center" }}>
              <TextField id="select-area" select sx={{ width: "200px" }} value={areaOmzet} onChange={(e) => setAreaOmzet(e.target.value)}>
                {[{ value: "All", label: "Semua" }, ...AREA_SELECT].map((item, index) => (
                  <MenuItem value={item?.value} key={index}>
                    {item?.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid>
            <StyledTable
              headers={LUSIN_PERBULAN_HEADER(createXData(12), monthNames)}
              rows={lusinBulanan}
              page={pageTahun}
              setPage={(e) => setPageTahun(e)}
              pageSize={currRowsPerPageTahun}
              setPageSizeChange={(e) => setCurrRowsPerPageTahun(e)}
              rowCount={lusinBulanan?.length}
              paginationMode="client"
            />
          </Grid>
          <Grid container mt={4}>
            <Grid item>
              <Typography sx={{ fontFamily: "poppins", fontSize: 28, fontWeight: "bold", color: "#12141E" }}>Grafik Produk Terjual</Typography>

              <LineChart
                xAxis={[
                  {
                    scaleType: "time",
                    data: createXData(12),
                    valueFormatter: (value) => `${monthNames[value?.getMonth()]} ${value?.getFullYear()}`,
                  },
                ]}
                series={[
                  {
                    data: totalProductGrafik[productID],
                  },
                ]}
                yAxis={[
                  {
                    tickLabelStyle: {
                      fontSize: 14,
                    },
                    valueFormatter: (value) => `${value} ${findProduct(productID)?.type}`,
                  },
                ]}
                width={1000}
                height={500}
                margin={{ left: 100 }}
              />
            </Grid>
            <Grid item sx={{ display: "flex", alignItems: "center" }}>
              <TextField id="select-area" select sx={{ width: "400px" }} value={productID} onChange={(e) => setProductID(e.target.value)}>
                {selectProduct?.map((item, index) => (
                  <MenuItem value={item?.value} key={index}>
                    {item?.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
