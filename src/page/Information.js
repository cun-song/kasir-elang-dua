import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { click, setTitle } from "../redux/sidenavReducer";
import { Box, MenuItem, TextField, Grid } from "@mui/material";
import NavBar from "../component/NavBar";
import { LineChart } from "@mui/x-charts/LineChart";
import { fetchTransactionHistory } from "../redux/action/transactionAction";
import { AREA_SELECT } from "../constant/Customer";

export default function Information() {
  const [data, setData] = useState([0, 0, 0, 0, 0, 0]);
  const [area, setArea] = useState("All");
  const dispatch = useDispatch();
  const transaction = useSelector((state) => state.transaction.transactionHistory);
  const customer = useSelector((state) => state?.customer?.allCustomer);
  const currDate = new Date();
  currDate.setDate(1);
  currDate.setHours(0, 0, 0, 0);

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
  useEffect(() => {
    setArea("All");
    dispatch(click(4));
    dispatch(setTitle("Pengaturan"));
    dispatch(fetchTransactionHistory(99999));
  }, []);

  useEffect(() => {
    const tempData = [0, 0, 0, 0, 0, 0];
    let arr = createXData(6);
    let trans = Object.values(transaction);

    if (area !== "All") trans = trans.filter((t) => findCustomer(t?.customerID)?.area === area);
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
    });
    setData(tempData);
  }, [transaction, area]);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ width: "100%", pr: 5 }}>
        <NavBar />
        <Box sx={{ backgroundColor: "white", borderRadius: "10px", p: 4, mt: 4 }}>
          <Grid container>
            <Grid item>
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
                    data: data,
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
            <Grid item>
              <TextField id="select-area" select sx={{ width: "200px" }} value={area} onChange={(e) => setArea(e.target.value)}>
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
