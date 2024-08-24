import React from "react";
import { Box, Typography, TextField, MenuItem, Button, ButtonGroup } from "@mui/material";
import NavBar from "../component/NavBar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { click, setLoading } from "../redux/sidenavReducer";
import { setTitle } from "../redux/sidenavReducer";
import StyledSearch from "../component/StyledSearch";
import StyledTable from "../component/StyledTable";
import { fetchTransactionHistory, updatePaid, updateShipped } from "../redux/action/transactionAction";
import { useSelector } from "react-redux";
import { HISTORY_HEADER, LAST_DATE_LIST, TRANSACTION_SEARCH_ITEM } from "../constant/History";
import { useState } from "react";
import DialogTable from "../component/DialogTable";
import { fetchCustomerData } from "../redux/action/customerAction";
import { formattedNumber } from "../utils/stingFormatted";
import { BulkPrinting } from "../utils/PrintInvoice";
import DialogTotalProduct from "../component/DialogTotalProduct";
import StyledTableTransaction from "../component/StyledTableTransaction";
import DialogSuccess from "../component/DialogSuccess";
import DialogFailed from "../component/DialogFailed";
import { setOpenFailed, setOpenFailedUpdate, setOpenSuccess, setOpenSuccessUpdate } from "../redux/transactionReducer";
import DialogConfirmation from "../component/DialogConfirmation";

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
  const [adminName, setAdminName] = useState(null);
  const [lastDate, setLastDate] = useState(7);
  const [time, setTime] = useState(null);
  const [openRangkuman, setOpenRangkuman] = useState(false);
  const [dataRangkuman, setDataRangkuman] = useState({});
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [labelConfirmation, setLabelConfirmation] = useState("");
  const [printData, setPrintData] = useState(null);
  const [printDialog, setPrintDialog] = useState(false);

  const transaction = useSelector((state) => state.transaction.transactionHistory);
  const customer = useSelector((state) => state?.customer?.allCustomer);
  const transactionSuccess = useSelector((state) => state.transaction.openSuccessUpdate);
  const transactionFailed = useSelector((state) => state.transaction.openFailedUpdate);
  const refresh = useSelector((state) => state?.transaction?.reset);

  useEffect(() => {
    dispatch(click(3));
    dispatch(setTitle("Transaksi"));
    dispatch(fetchTransactionHistory(lastDate));
    dispatch(fetchCustomerData());
  }, []);
  useEffect(() => {
    if (transactionSuccess) {
      dispatch(fetchTransactionHistory(lastDate));
      setSelectionData([]);
    }
  }, [refresh]);

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
  function findTransaction(id) {
    return Object.values(historyData).find((transaction) => transaction.id === id);
  }

  function handleRowClick(data, e) {
    if (data?.field === "__check__") {
      e.stopPropagation();
    } else {
      const arr = sortProduct(data?.row);
      const custArr = findCustomer(data?.row?.customerID);
      setAdminName(data?.row?.adminName);
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
    const arr = [...selectionData];
    const temp = arr
      .sort((a, b) => {
        const numA = parseInt(a.slice(1), 10);
        const numB = parseInt(b.slice(1), 10);
        return numB - numA;
      })
      .map((key) => {
        const transaction1 = findTransaction(key);
        const sortedProduct = sortProduct(transaction1);
        const totalQty = Object.values(sortedProduct).reduce((acc, item) => acc + (item?.type === "Dus" ? 2 : 1) * item?.productQty, 0);
        const total = Object.values(sortedProduct).reduce((acc, item) => acc + item?.productQty * item?.price, 0);
        const disc = Object.values(sortedProduct).reduce((acc, item) => acc + item?.productQty * item?.discount, 0);
        const formattedTotal = formattedNumber(total);
        const formattedDiscount = formattedNumber(disc);
        const formattedGrandTotal = formattedNumber(total - disc);
        return {
          id: key,
          product: sortedProduct,
          customer: findCustomer(transaction1?.customerID),
          totalQty: totalQty,
          total: formattedTotal,
          discount: formattedDiscount,
          grandTotal: formattedGrandTotal,
          adminName: transaction1?.adminName,
        };
      });
    setPrintData(temp);
    setPrintDialog(true);
  }

  function rangkuman() {
    let temp = {};
    let totalLusin = 0;
    let totalDus = 0;
    selectionData.forEach((key) => {
      const sortedProduct = sortProduct(findTransaction(key));
      sortedProduct.forEach((p) => {
        const newId = p?.id[0] === "P" ? p?.id : p?.id?.slice(1);
        if (temp[newId]) {
          temp = { ...temp, [newId]: { ...temp[newId], total: temp[newId]?.total + p?.productQty } };
        } else {
          temp = { ...temp, [newId]: { label: p?.label, index: p?.index, total: p?.productQty, type: p?.type } };
        }
        if (p?.type === "Lusin") {
          totalLusin += p?.productQty;
        } else {
          totalDus += p?.productQty;
        }
      });
    });
    temp = Object.keys(temp)
      .sort((a, b) => {
        const numA = temp[a]?.index;
        const numB = temp[b]?.index;
        if (numA !== null && numB !== null && numA !== numB) {
          return numA - numB;
        }
        return a.localeCompare(b);
      })
      .map((key) => ({
        id: key,
        ...temp[key],
      }));
    setDataRangkuman({ data: temp, totalLusin: totalLusin, totalDus: totalDus });
    setOpenRangkuman(true);
    bulkPrint();
  }
  function ship() {
    setOpenConfirmation(true);
    setLabelConfirmation("Yakin ingin mengubah Data Pesanan sudah dikirim ?");
  }
  function paid() {
    setOpenConfirmation(true);
    setLabelConfirmation("Yakin ingin mengubah Data Transaksi Menjadi Lunas ?");
  }
  function updatePaidShip() {
    dispatch(setLoading());
    if (labelConfirmation === "Yakin ingin mengubah Data Pesanan sudah dikirim ?") {
      dispatch(updateShipped(selectionData));
    } else {
      dispatch(updatePaid(selectionData));
    }
    setOpenConfirmation(false);
    setLabelConfirmation("");
  }
  const buttons = [
    // <Button onClick={() => bulkPrint()} variant="contained" sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, height: "48px", borderRadius: "10px", textTransform: "none" }}>
    //   Print
    // </Button>,
    <Button sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, height: "48px", width: "110px", borderRadius: "10px", textTransform: "none" }} onClick={() => rangkuman()} variant="contained">
      Total
    </Button>,
    <Button onClick={() => ship()} variant="contained" sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, height: "48px", width: "110px", borderRadius: "10px", textTransform: "none" }}>
      Kirim
    </Button>,
    <Button onClick={() => paid()} variant="contained" sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, height: "48px", width: "110px", borderRadius: "10px", textTransform: "none" }}>
      Lunas
    </Button>,
  ];
  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ width: "100%", pr: 5 }}>
        <NavBar />
        <Box sx={{ backgroundColor: "white", borderRadius: "10px", p: 4, mt: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", gap: 5 }}>
              <StyledSearch selectMenuItems={TRANSACTION_SEARCH_ITEM} handleSearchClick={(e) => handleSearchClick(e)} isResetSearch={isResetSearch} setIsResetSearch={setIsResetSearch} />
              <ButtonGroup size="large" sx={{ display: selectionData.length === 0 ? "none" : "block" }}>
                {buttons}
              </ButtonGroup>
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
            <StyledTableTransaction
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
              rowSelectionModel={selectionData}
            />
          </Box>
        </Box>
      </Box>
      <DialogTotalProduct open={openRangkuman} data={dataRangkuman} handleToggle={() => setOpenRangkuman((p) => !p)}>
        <BulkPrinting data={printData} />
      </DialogTotalProduct>
      <DialogTable data={transactionDetail} open={openTd} handleToggle={() => setOpenTd((prev) => !prev)} customer={customerArr} time={time} idTransaction={idTransaction} adminName={adminName} />
      <DialogSuccess message="Data Berhasil diSunting !!" open={transactionSuccess} handleToggle={() => dispatch(setOpenSuccessUpdate(false))} />
      <DialogFailed open={transactionFailed?.isOpen} message={transactionFailed?.message} handleToggle={() => dispatch(setOpenFailedUpdate({ isOpen: false, message: "" }))} />
      <DialogConfirmation open={openConfirmation} handleToggle={() => setOpenConfirmation((prev) => !prev)} label={labelConfirmation} save={() => updatePaidShip()} />
    </Box>
  );
}
