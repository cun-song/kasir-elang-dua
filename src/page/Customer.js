import React from "react";
import { Box, Typography, TextField, MenuItem, Button } from "@mui/material";
import NavBar from "../component/NavBar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { click } from "../redux/sidenavReducer";
import { setTitle } from "../redux/sidenavReducer";
import StyledSearch from "../component/StyledSearch";
import StyledTable from "../component/StyledTable";
import { useSelector } from "react-redux";
import { useState } from "react";
import { fetchCustomerData } from "../redux/action/customerAction";
import { CUSTOMER_HEADER, CUSTOMER_SEARCH_ITEM } from "../constant/Customer";
import DialogCustomer from "../component/DialogCustomer";
import DialogSuccess from "../component/DialogSuccess";
import DialogFailed from "../component/DialogFailed";
import { setOpenFailedCustomer, setOpenSuccessCustomer } from "../redux/customerReducer";

export default function Customer() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [currRowsPerPage, setCurrRowsPerPage] = useState(10);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [isResetSearch, setIsResetSearch] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [sortData, setSortData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [dataEdit, setDataEdit] = useState({});

  const customer = useSelector((state) => state?.customer?.allCustomer);
  const customerSuccess = useSelector((state) => state?.customer?.openSuccessCustomer);
  const customerFailed = useSelector((state) => state?.customer?.openFailedCustomer);
  const refresh = useSelector((state) => state?.customer?.resetCustomer);
  const role = useSelector((state) => state.sidenav.role);

  useEffect(() => {
    dispatch(click(2));
    dispatch(setTitle("Pelanggan"));
    dispatch(fetchCustomerData());
  }, []);

  useEffect(() => {
    if (customerSuccess) {
      setOpenAdd(false);
      setOpenEdit(false);
      dispatch(fetchCustomerData());
      setDataEdit({});
    }
  }, [refresh]);

  useEffect(() => {
    let tempData = Object.values(customer);
    const field = sortData[0]?.field ?? "id";
    const sort = sortData[0]?.sort ?? "desc";
    if (field === "id") {
      tempData.sort((a, b) => {
        const numA = parseInt(a.id.substring(2), 10);
        const numB = parseInt(b.id.substring(2), 10);
        return sort === "asc" ? numA - numB : numB - numA;
      });
    } else {
      tempData.sort((a, b) => {
        return sort === "asc" ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field]);
      });
    }

    if (searchData?.column === "all") {
      tempData = tempData.filter((customer) => {
        return Object.keys(customer).some((key) => key !== "timestamp" && String(customer[key]).toLowerCase().includes(searchData?.text.toLowerCase()));
      });
    } else {
      tempData = tempData.filter((customer) => {
        return String(customer[searchData?.column]).toLowerCase().includes(searchData?.text.toLowerCase());
      });
    }
    setCustomerData(tempData);
  }, [customer, searchData, sortData]);

  function handleSearchClick(data) {
    setSearchData(data);
  }

  function handleSortChange(data) {
    setSortData(data);
  }
  function handleRowClick(data, e) {
    if (data?.field === "__check__") {
      e.stopPropagation();
    } else {
      setDataEdit(data);
      setOpenEdit(true);
    }
  }

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ width: "100%", pr: 5 }}>
        <NavBar />
        <Box sx={{ backgroundColor: "white", borderRadius: "10px", p: 4, mt: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <StyledSearch selectMenuItems={CUSTOMER_SEARCH_ITEM} handleSearchClick={(e) => handleSearchClick(e)} isResetSearch={isResetSearch} setIsResetSearch={setIsResetSearch} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Button onClick={() => setOpenAdd(true)} variant="contained" sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, width: "145px", height: "49px", borderRadius: "7px", textTransform: "none" }}>
                Tambah
              </Button>
            </Box>
          </Box>
          <Box sx={{ mt: 3 }}>
            <StyledTable
              headers={CUSTOMER_HEADER}
              rows={customerData}
              page={page}
              setPage={(e) => setPage(e)}
              pageSize={currRowsPerPage}
              setPageSizeChange={(e) => setCurrRowsPerPage(e)}
              rowCount={customerData?.length}
              paginationMode="client"
              onCellClick={role === "Super Admin" ? (data, e) => handleRowClick(data, e) : false}
              onSortModelChange={(data) => handleSortChange(data)}
            />
          </Box>
        </Box>
      </Box>
      <DialogCustomer open={openAdd} handleToggle={() => setOpenAdd((prev) => !prev)} mode={"ADD"} />
      <DialogCustomer open={openEdit} handleToggle={() => setOpenEdit((prev) => !prev)} mode={"EDIT"} data={dataEdit?.row} />
      <DialogSuccess open={customerSuccess} handleToggle={() => dispatch(setOpenSuccessCustomer(false))} message="Data Pelanggan Berhasil Disimpan!!" />
      <DialogFailed open={customerFailed?.isOpen} handleToggle={() => dispatch(setOpenFailedCustomer({ isOpen: false, message: "" }))} message={customerFailed?.message} />
    </Box>
  );
}
