import React from "react";
import { Box, Typography, TextField, MenuItem, Button } from "@mui/material";
import NavBar from "../component/NavBar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { click, setLoading } from "../redux/sidenavReducer";
import { setTitle } from "../redux/sidenavReducer";
import StyledSearch from "../component/StyledSearch";
import StyledTable from "../component/StyledTable";
import { fetchTransactionHistory } from "../redux/action/transactionAction";
import { useSelector } from "react-redux";
import { HISTORY_HEADER, LAST_DATE_LIST, TRANSACTION_SEARCH_ITEM } from "../constant/History";
import { useState } from "react";
import DialogTable from "../component/DialogTable";
import { fetchCustomerData } from "../redux/action/customerAction";
import { formattedNumber } from "../utils/stingFormatted";
import { BulkPrinting } from "../utils/PrintInvoice";

export default function History() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [currRowsPerPage, setCurrRowsPerPage] = useState(10);
  const [transactionDetail, setTransactionDetail] = useState([]);
  const [openTd, setOpenTd] = useState(false);
  const [isResetSearch, setIsResetSearch] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [sortData, setSortData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [selectionData, setSelectionData] = useState([]);
  const [customerArr, setCustomerArr] = useState(null);
  const [idTransaction, setIdTransaction] = useState(null);
  const [lastDate, setLastDate] = useState(7);
  const [time, setTime] = useState(null);
  const transaction = useSelector((state) => state.transaction.transactionHistory);
  const customer = useSelector((state) => state?.customer?.allCustomer);
  const adminName = useSelector((state) => state.sidenav.name);

  useEffect(() => {
    dispatch(click(3));
    dispatch(setTitle("Transaksi"));
    dispatch(fetchTransactionHistory(lastDate));
    dispatch(fetchCustomerData());
  }, []);

  useEffect(() => {
    let tempData = Object.values(transaction);
    const field = sortData[0]?.field ?? "id";
    const sort = sortData[0]?.sort ?? "desc";
    if (field === "id") {
      tempData.sort((a, b) => {
        const numA = parseInt(a.id.substring(1), 10);
        const numB = parseInt(b.id.substring(1), 10);
        return sort === "asc" ? numA - numB : numB - numA;
      });
    } else if (field === "ownerName" || field === "merchantName") {
      tempData.sort((a, b) => {
        return sort === "asc" ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field]);
      });
    } else if (field === "discount") {
      tempData.sort((a, b) => {
        const numA = a[field]?.total ?? 0;
        const numB = b[field]?.total ?? 0;
        return sort === "asc" ? numA - numB : numB - numA;
      });
    } else {
      tempData.sort((a, b) => {
        const numA = a[field];
        const numB = b[field];
        return sort === "asc" ? numA - numB : numB - numA;
      });
    }

    if (searchData?.column === "all") {
      tempData = tempData.filter((transaction) => {
        return Object.keys(transaction).some((key) => key !== "timestamp" && String(transaction[key]).toLowerCase().includes(searchData?.text.toLowerCase()));
      });
    } else {
      tempData = tempData.filter((transaction) => {
        return String(transaction[searchData?.column]).toLowerCase().includes(searchData?.text.toLowerCase());
      });
    }
    setHistoryData(tempData);
  }, [transaction, searchData, sortData]);

  function onLastDateChange(time) {
    setLastDate(time);
    dispatch(fetchTransactionHistory(time));
  }
  function handleSearchClick(data) {
    setSearchData(data);
  }
  function handleSortChange(data) {
    setSortData(data);
  }
  function sortProduct(data) {
    const td = data?.product;
    return Object.keys(td)
      .sort((a, b) => {
        const numA = td[a]?.index;
        const numB = td[b]?.index;
        if (a.startsWith("P") && b.startsWith("B")) return -1;
        if (a.startsWith("B") && b.startsWith("P")) return 1;
        if (numA !== null && numB !== null && numA !== numB) {
          return numA - numB;
        }
        return a.localeCompare(b);
      })
      .map((key) => ({
        id: key,
        ...td[key],
        discount: (td[key]?.type === "Dus" ? 2 : 1) * (td[key]?.price === 0 ? 0 : td[key]?.size === "Besar" ? data?.discount?.besar : data?.discount?.kecil),
        subtotal:
          td[key]?.price === 0
            ? 0
            : td[key]?.size === "Besar"
            ? td[key]?.productQty * (td[key]?.price - (td[key]?.type === "Dus" ? 2 : 1) * data?.discount?.besar)
            : td[key]?.productQty * (td[key]?.price - (td[key]?.type === "Dus" ? 2 : 1) * data?.discount?.kecil),
      }));
  }
  function findCustomer(id) {
    return Object.values(customer).find((customer) => customer.id === id);
  }
  function findProduct(id) {
    return Object.values(historyData).find((product) => product.id === id);
  }

  function handleRowClick(data, e) {
    if (data?.field === "__check__") {
      e.stopPropagation();
    } else {
      const arr = sortProduct(data?.row);
      const custArr = findCustomer(data?.row?.customerID);
      setIdTransaction(data?.row?.id);
      setTime(data?.row?.timestamp);
      setCustomerArr(custArr);
      setTransactionDetail(arr);
      setOpenTd(true);
    }
  }
  const handleSelectionChange = (newSelection) => {
    setSelectionData(newSelection);
  };
  function bulkPrint() {
    dispatch(setLoading());
    const arr = [...selectionData];
    const temp = arr
      .sort((a, b) => {
        const numA = parseInt(a.slice(1), 10);
        const numB = parseInt(b.slice(1), 10);
        return numB - numA;
      })
      .map((key) => {
        const product = findProduct(key);
        const sortedProduct = sortProduct(findProduct(key));
        const totalQty = Object.values(sortedProduct).reduce((acc, item) => acc + (item?.type === "Dus" ? 2 : 1) * item?.productQty, 0);
        const total = Object.values(sortedProduct).reduce((acc, item) => acc + item?.productQty * item?.price, 0);
        const disc = Object.values(sortedProduct).reduce((acc, item) => acc + item?.productQty * item?.discount, 0);
        const formattedTotal = formattedNumber(total);
        const formattedDiscount = formattedNumber(disc);
        const formattedGrandTotal = formattedNumber(total - disc);
        return {
          id: key,
          product: sortedProduct,
          customer: findCustomer(product?.customerID),
          totalQty: totalQty,
          total: formattedTotal,
          discount: formattedDiscount,
          grandTotal: formattedGrandTotal,
        };
      });
    console.log(adminName);
    BulkPrinting(temp, adminName).then(() => {
      dispatch(setLoading());
    });
  }

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ width: "100%", pr: 5 }}>
        <NavBar />
        <Box sx={{ backgroundColor: "white", borderRadius: "10px", p: 4, mt: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", gap: 5 }}>
              <StyledSearch selectMenuItems={TRANSACTION_SEARCH_ITEM} handleSearchClick={(e) => handleSearchClick(e)} isResetSearch={isResetSearch} setIsResetSearch={setIsResetSearch} />
              <Button
                onClick={() => bulkPrint()}
                sx={{ display: selectionData.length === 0 ? "none" : "block", backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, width: "150px", height: "48px", borderRadius: "10px", textTransform: "none" }}
                variant="contained"
              >
                Print
              </Button>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ mr: 2 }}>Data Transaksi dari: </Typography>
              <TextField id="select-date" select sx={{ width: "200px" }} value={lastDate} onChange={(e) => onLastDateChange(e.target.value)}>
                {LAST_DATE_LIST.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
          <Box sx={{ mt: 3 }}>
            <StyledTable
              headers={HISTORY_HEADER}
              rows={historyData}
              page={page}
              setPage={(e) => setPage(e)}
              pageSize={currRowsPerPage}
              setPageSizeChange={(e) => setCurrRowsPerPage(e)}
              rowCount={transaction?.length}
              paginationMode="client"
              onCellClick={(data, e) => handleRowClick(data, e)}
              onSortModelChange={(data) => handleSortChange(data)}
              checkboxSelection={true}
              selectModelChange={handleSelectionChange}
            />
          </Box>
        </Box>
      </Box>
      <DialogTable data={transactionDetail} open={openTd} handleToggle={() => setOpenTd((prev) => !prev)} customer={customerArr} time={time} idTransaction={idTransaction} adminName={adminName} />
    </Box>
  );
}
