import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { click, setTitle } from "../redux/sidenavReducer";
import { Box, MenuItem, TextField, Grid, Typography } from "@mui/material";
import NavBar from "../component/NavBar";
import { LineChart } from "@mui/x-charts/LineChart";
import { fetchTransactionHistory } from "../redux/action/transactionAction";
import { AREA_SELECT } from "../constant/Customer";
import StyledTable from "../component/StyledTable";
import { LUSIN_HEADER } from "../constant/Information";
import { decimalToFraction, decimalToFraction2 } from "../utils/stingFormatted";
import { fetchCustomerData } from "../redux/action/customerAction";
import { fetchProductData } from "../redux/action/productAction";
import { PrintLusin } from "../utils/PrintReport";

export default function Information() {
  const currDate = new Date();
  currDate.setDate(1);
  currDate.setHours(0, 0, 0, 0);

  const [page, setPage] = useState(0);
  const [currRowsPerPage, setCurrRowsPerPage] = useState(30);
  const [omzet, setOmzet] = useState([0, 0, 0, 0, 0, 0]);
  const [areaOmzet, setAreaOmzet] = useState("All");
  const [lusin, setLusin] = useState([]);
  const [doc, setDoc] = useState([]);
  const [sumLusin, setSumLusin] = useState(0);
  const [areaLusin, setAreaLusin] = useState("All");
  const [bulanLusin, setBulanLusin] = useState({ month: new Date(currDate).getMonth(), year: new Date(currDate).getFullYear() });

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const dispatch = useDispatch();
  const transaction = useSelector((state) => state.transaction.transactionHistory);
  const customer = useSelector((state) => state?.customer?.allCustomer);
  const product = useSelector((state) => state?.product?.allProduct);

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
    return Object.values(customer).find((customer) => customer.id === id);
  }
  function findProduct(id) {
    return Object.values(product).find((product) => product.id === id);
  }
  useEffect(() => {
    setAreaOmzet("All");
    dispatch(click(4));
    dispatch(setTitle("Pengaturan"));
    dispatch(fetchTransactionHistory(99999));
    dispatch(fetchCustomerData());
    dispatch(fetchProductData());
  }, []);

  useEffect(() => {
    // Omzet
    const tempData = [0, 0, 0, 0, 0, 0];
    let tempLusin = {};
    let arr = createXData(6);
    let trans = Object.values(transaction);

    if (areaOmzet !== "All") trans = trans.filter((t) => findCustomer(t?.customerID)?.area === areaOmzet);
    trans.forEach((t) => {
      if (arr[0].getTime() < t?.timestamp && t?.timestamp < arr[1].getTime()) {
        tempData[0] = tempData[0] + t?.total;
      } else if (arr[1].getTime() < t?.timestamp && t?.timestamp < arr[2].getTime()) {
        tempData[1] = tempData[1] + t?.total;
      } else if (arr[2].getTime() < t?.timestamp && t?.timestamp < arr[3].getTime()) {
        tempData[2] = tempData[2] + t?.total;
      } else if (arr[3].getTime() < t?.timestamp && t?.timestamp < arr[4].getTime()) {
        tempData[3] = tempData[3] + t?.total;
      } else if (arr[4].getTime() < t?.timestamp && t?.timestamp < arr[5].getTime()) {
        tempData[4] = tempData[4] + t?.total;
      } else if (arr[5].getTime() < t?.timestamp && t?.timestamp < arr[6].getTime()) {
        tempData[5] = tempData[5] + t?.total;
      }
      //Lusin
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
    });
    setOmzet(tempData);
  }, [transaction, areaOmzet]);
  useEffect(() => {
    let tempLusin = {};
    let trans = Object.values(transaction);

    let tempDateYear = new Date(currDate).setFullYear(bulanLusin?.year);
    let before = new Date(tempDateYear).setMonth(bulanLusin?.month);
    let after = new Date(before).setMonth(bulanLusin?.month + 1);

    if (areaLusin !== "All") trans = trans.filter((t) => findCustomer(t?.customerID)?.area === areaLusin);
    trans.forEach((t) => {
      if (before < t?.timestamp && t?.timestamp < after) {
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

    const existingIds = new Set(newer.map((item) => item.id));
    Object.values(product).forEach((newItem) => {
      if (!existingIds.has(newItem?.id)) {
        newer.push({ value: 0, label: newItem?.label, index: newItem?.index, type: newItem?.type, totalLusin: newItem?.totalLusin, id: newItem?.id });
      }
    });

    newer.sort((a, b) => {
      return a?.index - b?.index;
    });
    const doc = newer.filter((item) => item.type !== "Gen");
    setDoc(doc);
    setSumLusin(tempSumLusin);
    setLusin(newer);
  }, [transaction, bulanLusin, areaLusin]);

  let selectMonth = createXData(6);
  selectMonth = selectMonth.map((a) => {
    return { value: { month: a?.getMonth(), year: a?.getFullYear() }, label: `${monthNames[a?.getMonth()]} ${a?.getFullYear()}` };
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
                  {selectMonth.map((item, index) => (
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
              <PrintLusin doc={doc} sumLusin={sumLusin} date={bulanLusin} />
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
                    data: createXData(6),
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
                    valueFormatter: (value) => `${value / 1000000} Jt`,
                  },
                ]}
                width={600}
                height={500}
              />
            </Grid>
            <Grid item sx={{ display: "flex", alignItems: "center" }}>
              <TextField id="select-area" select sx={{ width: "200px" }} value={areaOmzet} onChange={(e) => setAreaOmzet(e.target.value)}>
                {[{ value: "All", label: "Semua" }, ...AREA_SELECT].map((item, index) => (
                  <MenuItem value={item?.value} key={index}>
                    {item.label}
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
