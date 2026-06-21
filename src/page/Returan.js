import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, MenuItem, Button, Tabs, Tab, IconButton, Tooltip, useMediaQuery, DialogContent } from "@mui/material";
import NavBar from "../component/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/sidenavReducer";
import StyledSearch from "../component/StyledSearch";
import { fetchReturanList, sendReturan, deleteReturan } from "../redux/action/returanAction";
import { fetchCustomerData } from "../redux/action/customerAction";
import { fetchProductData } from "../redux/action/productAction";
import { RETURAN_HEADER, RETURAN_SEARCH_ITEM, RETURAN_FILTER, RETURAN_DATE_LIST } from "../constant/Returan";
import StyledTableTransaction from "../component/StyledTableTransaction";
import DialogSuccess from "../component/DialogSuccess";
import DialogFailed from "../component/DialogFailed";
import DialogConfirmation from "../component/DialogConfirmation";
import DialogReturan from "../component/DialogReturan";
import DialogReturanDetail from "../component/DialogReturanDetail";
import StyledDialog from "../component/StyledDialog";
import { setOpenSuccessReturan, setOpenFailedReturan } from "../redux/returanReducer";
import { ReturanInvoice } from "../utils/PrintReturanInvoice";

// Action column icons
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

export default function Returan() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [page, setPage] = useState(0);
  const [currRowsPerPage, setCurrRowsPerPage] = useState(10);
  const [searchData, setSearchData] = useState(null);
  const [sortData, setSortData] = useState([]);
  const [returanData, setReturanData] = useState([]);
  const [lastDate, setLastDate] = useState(7);
  const [filterTab, setFilterTab] = useState("all");
  const [isResetSearch, setIsResetSearch] = useState(false);

  // Dialog states
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [confirmationLabel, setConfirmationLabel] = useState("");
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [openPrint, setOpenPrint] = useState(false);
  const [printData, setPrintData] = useState(null);

  // Redux selectors
  const returanList = useSelector((state) => state?.returan?.returanList);
  const success = useSelector((state) => state?.returan?.openSuccessReturan);
  const failed = useSelector((state) => state?.returan?.openFailedReturan);
  const refresh = useSelector((state) => state?.returan?.resetReturan);
  const adminName = useSelector((state) => state?.sidenav?.name);
  const role = useSelector((state) => state?.sidenav?.role);

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchReturanList(lastDate));
    dispatch(fetchCustomerData());
    dispatch(fetchProductData());
  }, []);

  // Refresh after successful action
  useEffect(() => {
    if (success) {
      dispatch(fetchReturanList(lastDate));
      setOpenForm(false);
      setOpenDetail(false);
      setEditData(null);
    }
  }, [refresh]);

  // Process & filter data
  useEffect(() => {
    let tempData = [...(Array.isArray(returanList) ? returanList : Object.values(returanList))];

    // Sort
    const field = sortData[0]?.field ?? "id";
    const sort = sortData[0]?.sort ?? "desc";

    if (field === "id") {
      tempData.sort((a, b) => {
        return sort === "asc" ? a?.id?.localeCompare(b?.id) : b?.id?.localeCompare(a?.id);
      });
    } else if (field === "ownerName" || field === "returnReason") {
      tempData.sort((a, b) => {
        return sort === "asc" ? (a[field] || "").localeCompare(b[field] || "") : (b[field] || "").localeCompare(a[field] || "");
      });
    } else {
      tempData.sort((a, b) => {
        const numA = a[field] || 0;
        const numB = b[field] || 0;
        return sort === "asc" ? numA - numB : numB - numA;
      });
    }

    // Search filter
    if (searchData?.text) {
      if (searchData?.column === "all") {
        tempData = tempData.filter((r) =>
          Object.keys(r).some((key) => key !== "timestamp" && String(r[key])?.toLowerCase().includes(searchData?.text?.toLowerCase()))
        );
      } else {
        tempData = tempData.filter((r) => String(r[searchData?.column])?.toLowerCase().includes(searchData?.text?.toLowerCase()));
      }
    }

    // Tab filter
    if (filterTab === "unsent") {
      tempData = tempData.filter((r) => !r.isSent);
    } else if (filterTab === "sent") {
      tempData = tempData.filter((r) => r.isSent === true);
    }

    setReturanData(tempData);
  }, [returanList, searchData, sortData, filterTab]);

  function onLastDateChange(time) {
    setLastDate(time);
    dispatch(fetchReturanList(time));
  }

  function handleSearchClick(data) {
    setSearchData(data);
  }

  function handleSortChange(data) {
    setSortData(data);
  }

  function handleRowClick(data, e) {
    if (data?.field === "actions") {
      e.stopPropagation();
    } else {
      setDetailData(data?.row);
      setOpenDetail(true);
    }
  }

  // Build action column
  const actionColumn = {
    field: "actions",
    headerName: "Aksi",
    headerAlign: "center",
    align: "center",
    flex: 1.5,
    minWidth: 220,
    sortable: false,
    renderCell: (params) => {
      const row = params?.row;
      const isSent = row?.isSent === true;

      return (
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
          {/* Edit */}
          {role === "Super Admin" && (
            <Tooltip title={isSent ? "Sudah dikirim" : "Edit"}>
              <span>
                <IconButton
                  size="small"
                  disabled={isSent}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditData(row);
                    setOpenForm(true);
                  }}
                  sx={{ color: isSent ? "#ccc" : "#E06F2C" }}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}

          {/* Print */}
          <Tooltip title="Print">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setPrintData(row);
                setOpenPrint(true);
              }}
              sx={{ color: "#333" }}
            >
              <PrintOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* Delete */}
          {role === "Super Admin" && (
            <Tooltip title="Hapus">
              <span>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmationLabel(`Yakin ingin menghapus Returan ${row?.id} ?`);
                    setConfirmationAction(() => () => {
                      dispatch(setLoading());
                      dispatch(deleteReturan(row?.id));
                      setOpenConfirmation(false);
                    });
                    setOpenConfirmation(true);
                  }}
                  sx={{ color: "#FF0E0E" }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          )}

          {/* Kirim Returan */}
          {!isSent && (
            <Tooltip title="Kirim Returan">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmationLabel(`Yakin ingin mengirim Returan ${row?.id} ?`);
                  setConfirmationAction(() => () => {
                    dispatch(setLoading());
                    dispatch(sendReturan([row?.id], adminName));
                    setOpenConfirmation(false);
                  });
                  setOpenConfirmation(true);
                }}
                sx={{ color: "#2e7d32" }}
              >
                <SendOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      );
    },
  };

  const allHeaders = [...RETURAN_HEADER, actionColumn];

  // Row color: gray if unsent, white if sent (same as History/StyledTableTransaction)
  const getRowClassName = (params) => {
    return params?.row?.isSent ? "super-app-theme--rowColor-white" : "super-app-theme--rowColor-gray";
  };

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ width: "100%", pr: isMobile ? 0 : 5, pl: isMobile ? 4 : 0 }}>
        <NavBar />
        <Box sx={{ backgroundColor: isMobile ? "transparent" : "white", borderRadius: "10px", p: isMobile ? 0 : 4, mt: 4, width: isMobile ? "96%" : "auto" }}>
          {/* Top Controls */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "left" : "center", flexDirection: isMobile ? "column-reverse" : "row", gap: isMobile ? 2 : 0 }}>
            <Box sx={{ display: "flex", gap: isMobile ? 2 : 3, flexDirection: isMobile ? "column" : "row", alignItems: "center" }}>
              <StyledSearch selectMenuItems={RETURAN_SEARCH_ITEM} handleSearchClick={(e) => handleSearchClick(e)} isResetSearch={isResetSearch} setIsResetSearch={setIsResetSearch} />
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
              <Button
                onClick={() => {
                  setEditData(null);
                  setOpenForm(true);
                }}
                variant="contained"
                sx={{
                  backgroundColor: "#E06F2C",
                  ":hover": { backgroundColor: "#c95f1f" },
                  height: "48px",
                  borderRadius: "10px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                }}
              >
                + Tambah Returan
              </Button>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography sx={{ mr: 1, fontSize: "14px", whiteSpace: "nowrap" }}>Data dari:</Typography>
                <TextField
                  select
                  size="small"
                  sx={{ width: "180px" }}
                  value={lastDate}
                  onChange={(e) => onLastDateChange(e?.target?.value)}
                >
                  {RETURAN_DATE_LIST.map((option) => (
                    <MenuItem key={option?.value} value={option?.value}>
                      {option?.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>
          </Box>

          {/* Filter Tabs */}
          <Box sx={{ mt: 2, mb: 1 }}>
            <Tabs
              value={filterTab}
              onChange={(_, val) => setFilterTab(val)}
              sx={{
                minHeight: "36px",
                "& .MuiTab-root": { minHeight: "36px", textTransform: "none", fontWeight: 600, fontSize: "13px" },
                "& .Mui-selected": { color: "#E06F2C !important" },
                "& .MuiTabs-indicator": { backgroundColor: "#E06F2C" },
              }}
            >
              {RETURAN_FILTER.map((f) => (
                <Tab key={f.value} value={f.value} label={f.label} />
              ))}
            </Tabs>
          </Box>

          {/* Table */}
          <Box sx={{ mt: 1, mb: isMobile ? 20 : 0 }}>
            <StyledTableTransaction
              headers={allHeaders}
              rows={returanData}
              page={page}
              setPage={(e) => setPage(e)}
              pageSize={currRowsPerPage}
              setPageSizeChange={(e) => setCurrRowsPerPage(e)}
              rowCount={returanData?.length}
              paginationMode="client"
              onCellClick={(data, e) => handleRowClick(data, e)}
              onSortModelChange={(data) => handleSortChange(data)}
              disableRowClick={false}
              getRowClassName={getRowClassName}
              disableRowSelectionOnClick={true}
            />
          </Box>
        </Box>
      </Box>

      {/* Dialogs */}
      <DialogReturan open={openForm} handleToggle={() => { setOpenForm(false); setEditData(null); }} editData={editData} />
      <DialogReturanDetail open={openDetail} handleToggle={() => { setOpenDetail(false); setDetailData(null); }} data={detailData} />

      {/* Print Dialog */}
      <StyledDialog
        isOpen={openPrint && !!printData}
        handleToggle={() => { setOpenPrint(false); setEditData(null); setPrintData(null); }}
        useCloseBtn
        width="450px"
        title="Print Nota Retur"
      >
        <DialogContent sx={{ textAlign: "center", pt: 1, pb: 3 }}>
          <Box sx={{ mb: 3, p: 2, bgcolor: "#FFF5EF", borderRadius: "12px", border: "1.5px dashed #FFAC7B" }}>
            <Typography sx={{ fontFamily: "poppins", fontSize: "14px", color: "#555", mb: 0.5 }}>
              Nomor Retur:
            </Typography>
            <Typography sx={{ fontFamily: "poppins", fontSize: "20px", fontWeight: "bold", color: "#E06F2C" }}>
              {printData?.id}
            </Typography>
          </Box>

          <Box sx={{ mt: 1, display: "flex", justifyContent: "center", width: "100%" }}>
            <Box sx={{ minWidth: 0 }}>
              <ReturanInvoice
                data={printData}
                onBeforePrint={() => {
                  setOpenPrint(false);
                  setPrintData(null);
                }}
              />
            </Box>

          </Box>
        </DialogContent>
      </StyledDialog>

      <DialogSuccess message="Returan Berhasil!!" open={success} handleToggle={() => dispatch(setOpenSuccessReturan(false))} />
      <DialogFailed open={failed?.isOpen} message={failed?.message} handleToggle={() => dispatch(setOpenFailedReturan({ isOpen: false, message: "" }))} />
      <DialogConfirmation
        open={openConfirmation}
        handleToggle={() => setOpenConfirmation(false)}
        label={confirmationLabel}
        save={() => confirmationAction && confirmationAction()}
      />
    </Box>
  );
}
