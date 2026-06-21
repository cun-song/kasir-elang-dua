import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, MenuItem, Button, IconButton, Tooltip, useMediaQuery, DialogContent } from "@mui/material";
import NavBar from "../component/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/sidenavReducer";
import StyledSearch from "../component/StyledSearch";
import { fetchTitipBonList, deleteTitipBon } from "../redux/action/titipBonAction";
import { fetchCustomerData } from "../redux/action/customerAction";
import { TITIPBON_HEADER, TITIPBON_SEARCH_ITEM, TITIPBON_DATE_LIST } from "../constant/TitipBon";
import StyledTableTransaction from "../component/StyledTableTransaction";
import DialogSuccess from "../component/DialogSuccess";
import DialogFailed from "../component/DialogFailed";
import DialogConfirmation from "../component/DialogConfirmation";
import CreateTitipBon from "../component/CreateTitipBon";
import TitipBonDetailDialog from "../component/TitipBonDetailDialog";
import StyledDialog from "../component/StyledDialog";
import { setOpenSuccessTitipBon, setOpenFailedTitipBon } from "../redux/titipBonReducer";
import { TitipBonInvoice } from "../utils/PrintTitipBon";

// Action column icons
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function TitipBon() {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [page, setPage] = useState(0);
  const [currRowsPerPage, setCurrRowsPerPage] = useState(10);
  const [searchData, setSearchData] = useState(null);
  const [sortData, setSortData] = useState([]);
  const [titipBonData, setTitipBonData] = useState([]);
  const [lastDate, setLastDate] = useState(7);
  const [isResetSearch, setIsResetSearch] = useState(false);

  // Dialog states
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [confirmationLabel, setConfirmationLabel] = useState("");
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [openPrint, setOpenPrint] = useState(false);
  const [printData, setPrintData] = useState(null);

  // Redux selectors
  const titipBonList = useSelector((state) => state?.titipBon?.titipBonList);
  const success = useSelector((state) => state?.titipBon?.openSuccessTitipBon);
  const failed = useSelector((state) => state?.titipBon?.openFailedTitipBon);
  const refresh = useSelector((state) => state?.titipBon?.resetTitipBon);
  const role = useSelector((state) => state?.sidenav?.role);

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchTitipBonList(lastDate));
    dispatch(fetchCustomerData());
  }, []);

  // Refresh after successful action
  useEffect(() => {
    if (success) {
      dispatch(fetchTitipBonList(lastDate));
      setOpenForm(false);
      setOpenDetail(false);
      setDetailData(null);
    }
  }, [refresh]);

  // Process & filter data
  useEffect(() => {
    let tempData = [...(Array.isArray(titipBonList) ? titipBonList : Object.values(titipBonList))];

    // Sort
    const field = sortData[0]?.field ?? "id";
    const sort = sortData[0]?.sort ?? "desc";

    if (field === "id") {
      tempData.sort((a, b) => {
        return sort === "asc" ? a?.id?.localeCompare(b?.id) : b?.id?.localeCompare(a?.id);
      });
    } else if (field === "ownerName" || field === "merchantName" || field === "area" || field === "createdBy" || field === "status") {
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
        tempData = tempData.filter((tb) =>
          Object.keys(tb).some((key) => key !== "timestamp" && key !== "invoices" && String(tb[key])?.toLowerCase().includes(searchData?.text?.toLowerCase()))
        );
      } else {
        tempData = tempData.filter((tb) => String(tb[searchData?.column])?.toLowerCase().includes(searchData?.text?.toLowerCase()));
      }
    }

    setTitipBonData(tempData);
  }, [titipBonList, searchData, sortData]);

  function onLastDateChange(time) {
    setLastDate(time);
    dispatch(fetchTitipBonList(time));
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
    flex: 1,
    minWidth: 140,
    sortable: false,
    renderCell: (params) => {
      const row = params?.row;

      return (
        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", justifyContent: "center" }}>
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

          {/* Delete — only for Super Admin */}
          {role === "Super Admin" && (
            <Tooltip title="Hapus">
              <span>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmationLabel(`Yakin ingin menghapus Titip Bon ${row?.id} ?`);
                    setConfirmationAction(() => () => {
                      dispatch(setLoading());
                      dispatch(deleteTitipBon(row?.id));
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
        </Box>
      );
    },
  };

  const allHeaders = [...TITIPBON_HEADER, actionColumn];

  // Row color based on status
  const getRowClassName = (params) => {
    return params?.row?.status === "sudah_bayar" ? "super-app-theme--rowColor-green" : "super-app-theme--rowColor-white";
  };

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ width: "100%", pr: isMobile ? 0 : 5, pl: isMobile ? 4 : 0 }}>
        <NavBar />
        <Box sx={{ backgroundColor: isMobile ? "transparent" : "white", borderRadius: "10px", p: isMobile ? 0 : 4, mt: 4, width: isMobile ? "96%" : "auto" }}>
          {/* Top Controls */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "left" : "center", flexDirection: isMobile ? "column-reverse" : "row", gap: isMobile ? 2 : 0 }}>
            <Box sx={{ display: "flex", gap: isMobile ? 2 : 3, flexDirection: isMobile ? "column" : "row", alignItems: "center" }}>
              <StyledSearch selectMenuItems={TITIPBON_SEARCH_ITEM} handleSearchClick={(e) => handleSearchClick(e)} isResetSearch={isResetSearch} setIsResetSearch={setIsResetSearch} />
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
              <Button
                onClick={() => setOpenForm(true)}
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
                + Tambah Titip Bon
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
                  {TITIPBON_DATE_LIST.map((option) => (
                    <MenuItem key={option?.value} value={option?.value}>
                      {option?.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>
          </Box>

          {/* Table */}
          <Box sx={{ mt: 3, mb: isMobile ? 20 : 0 }}>
            <StyledTableTransaction
              headers={allHeaders}
              rows={titipBonData}
              page={page}
              setPage={(e) => setPage(e)}
              pageSize={currRowsPerPage}
              setPageSizeChange={(e) => setCurrRowsPerPage(e)}
              rowCount={titipBonData?.length}
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
      <CreateTitipBon open={openForm} handleToggle={() => setOpenForm(false)} />
      <TitipBonDetailDialog open={openDetail} handleToggle={() => { setOpenDetail(false); setDetailData(null); }} data={detailData} />

      {/* Print Dialog */}
      <StyledDialog
        isOpen={openPrint && !!printData}
        handleToggle={() => { setOpenPrint(false); setPrintData(null); }}
        useCloseBtn
        width="450px"
        title="Print Nota Titip Bon"
      >
        <DialogContent sx={{ textAlign: "center", pt: 1, pb: 3 }}>
          <Box sx={{ mb: 3, p: 2, bgcolor: "#FFF5EF", borderRadius: "12px", border: "1.5px dashed #FFAC7B" }}>
            <Typography sx={{ fontFamily: "poppins", fontSize: "14px", color: "#555", mb: 0.5 }}>
              Nomor Titip Bon:
            </Typography>
            <Typography sx={{ fontFamily: "poppins", fontSize: "20px", fontWeight: "bold", color: "#E06F2C" }}>
              {printData?.id}
            </Typography>
          </Box>

          <Box sx={{ mt: 1, display: "flex", justifyContent: "center", width: "100%" }}>
            <Box sx={{ minWidth: 0 }}>
              <TitipBonInvoice
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

      <DialogSuccess message="Titip Bon Berhasil!!" open={success} handleToggle={() => dispatch(setOpenSuccessTitipBon(false))} />
      <DialogFailed open={failed?.isOpen} message={failed?.message} handleToggle={() => dispatch(setOpenFailedTitipBon({ isOpen: false, message: "" }))} />
      <DialogConfirmation
        open={openConfirmation}
        handleToggle={() => setOpenConfirmation(false)}
        label={confirmationLabel}
        save={() => confirmationAction && confirmationAction()}
      />
    </Box>
  );
}
