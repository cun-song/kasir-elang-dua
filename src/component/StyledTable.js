import { LinearProgress, TablePagination } from "@mui/material";
import { DataGrid, gridPageSelector, useGridApiContext, useGridSelector } from "@mui/x-data-grid";
import React, { useState } from "react";
import ArrowDown from "../svg/ArrowDropDown";
import ArrowUp from "../svg/ArrowUp";
import EmptyTableMessage from "./EmptyTable";
import { Height } from "@mui/icons-material";

const ROW_COLOR = {
  border: "none",
  // borderRadius: 2,
  cursor: "pointer",
};

const styles = {
  dataGrid: (useGrayTheme, usePagination, disableRowClick) => ({
    boxShadow: "0px 0px 3px rgb(0 0 0 / 7%)",
    textAlign: "center",
    border: "none",
    overflow: "hidden",
    ".css-y2qhgf": {
      background: "none !important",
    },
    ".MuiDataGrid-root": {
      overflow: "hidden",
      border: "none",
    },
    ".MuiDataGrid-cellContent": {
      fontSize: "14px",
      color: useGrayTheme ? "#65748B" : "black",
      whiteSpace: "normal",
      paddingX: 1,
      paddingY: 2,
    },
    ".MuiDataGrid-selectedRowCount": {
      visibility: "visible!important",
    },
    ".MuiDataGrid-footerContainer": {
      borderBottom: "1px solid rgba(224, 224, 224, 1)",
      borderLeft: "1px solid rgba(224, 224, 224, 1)",
      borderRight: "1px solid rgba(224, 224, 224, 1)",
      "&:first-of-type": {
        display: "flex",
        padding: usePagination ? "4px" : "0px",
      },
      visibility: usePagination ? "visible" : "hidden",
      minHeight: usePagination ? "auto" : "0px",
    },
    ".MuiDataGrid-cell:focus": {
      outline: "none",
    },
    ".MuiDataGrid-columnHeader:focus": {
      outline: "none",
    },
    ".MuiDataGrid-columnHeaders": {
      backgroundColor: "#FFAC7B",
      opacity: "none",
      fontSize: "14px",
      fontWeight: 900,
      border: "none",
      borderRadiusTopLeft: 2,
      borderRadiusTopRight: 2,
    },
    ".css-yrdy0g-MuiDataGrid-columnHeaderRow": {
      background: "none !important",
    },
    ".MuiDataGrid-row.Mui-odd": {
      backgroundColor: "#E2E2EB",
    },
    ".MuiDataGrid-row": {
      minHeight: "56px !important",
    },
    ".super-app-theme--rowColor": {
      ...ROW_COLOR,
      backgroundColor: "#E2E2EB",
    },
    ".super-app-theme--rowColor-blue": {
      ...ROW_COLOR,
      backgroundColor: "#CDE8FF",
    },
    ".super-app-theme--rowColor-blue-2": {
      ...ROW_COLOR,
      backgroundColor: "#CDE8FF",
    },
    ".super-app-theme--rowColor-gray": {
      ...ROW_COLOR,
      backgroundColor: "#E2E2EB",
      "&:hover": {
        fontWeight: disableRowClick ? "normal" : "bold",
        backgroundColor: disableRowClick ? "#E2E2EB" : "#CDE8FF",
      },
    },
    ".super-app-theme--rowColor-white": {
      ...ROW_COLOR,
      backgroundColor: "white",
      "&:hover": {
        fontWeight: disableRowClick ? "normal" : "bold",
        backgroundColor: disableRowClick ? "white" : "#CDE8FF",
      },
    },
    "& > .MuiDataGrid-columnSeparator": {
      visibility: "hidden",
    },
    ".MuiDataGrid-cell": {
      border: "none",
      outline: "none !important",
      padding: 0,
      display: "flex",
      alignItems: "center",
    },
    ".MuiDataGrid-columnHeaderTitle": {
      fontSize: "14px",
      color: "black",
      fontWeight: 600,
      overflow: "visible",
      lineHeight: "1.43rem",
      whiteSpace: "normal",
    },
    ".MuiDataGrid-columnSeparator": {
      display: "none",
    },
    "& .MuiDataGrid-iconButtonContainer": {
      marginLeft: "10px",
      visibility: "visible !important",
      width: "auto !important",
    },
  }),
};

function SortedDescendingIcon() {
  return (
    <ArrowDown
      sx={{
        opacity: 1,
        backgroundColor: "white",
        color: "#72371D",
        borderRadius: 1,
      }}
    />
  );
}

function SortedAscendingIcon() {
  return (
    <ArrowUp
      sx={{
        opacity: 1,
        backgroundColor: "white",
        color: "#72371D",
        borderRadius: 1,
      }}
    />
  );
}

export default function StyledTable({
  headers,
  rows,
  pageSize,
  loading,
  page,
  rowCount,
  setPage = () => {},
  setPageSizeChange = () => {},
  selectModelChange = () => {},
  paginationMode = "server",
  sortingMode = "server",
  useSort = true,
  usePagination = true,
  disableRowClick = false,
  useGray,
  checkboxSelection = false,
  onSortModelChange = () => {},
  onCellClick = () => {},
  hideFooter = false,
  initialTotalRows = 5,
  ...props
}) {
  headers = useSort
    ? headers
    : headers.map((item) => {
        return { ...item, sortable: false };
      });
  const [paginationModel, setPaginationModel] = useState({
    pageSize: pageSize,
    page: page,
  });
  function CustomPagination() {
    const apiRef = useGridApiContext();
    const page = useGridSelector(apiRef, gridPageSelector);

    return (
      <TablePagination
        component="div"
        page={page}
        rowsPerPage={pageSize}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setPageSizeChange(e.target.value)}
        count={rowCount}
        showFirstButton
        showLastButton
        rowsPerPageOptions={[5, 10, 20, 40, 100]}
      />
    );
  }

  return (
    <DataGrid
      sx={styles.dataGrid(useGray, usePagination, disableRowClick)}
      rows={rows}
      columns={headers}
      pageSize={pageSize}
      loading={loading}
      page={page}
      pagination
      autoHeight
      getRowHeight={() => "auto"}
      getRowSpacing={(params) => {
        if (params.indexRelativeToCurrentPage === 0) {
          return {
            top: 10,
            bottom: 0,
          };
        } else {
          return {
            top: 0,
            bottom: 0,
          };
        }
      }}
      hideFooterSelectedRowCount={true}
      paginationMode={paginationMode === "server" ? "server" : "client"}
      sortingMode={sortingMode === "server" ? "server" : "client"}
      disableColumnMenu
      isRowSelectable={(params) => (disableRowClick ? false : true)}
      checkboxSelection={checkboxSelection}
      disableRowSelectionOnClick={checkboxSelection}
      rowCount={rowCount}
      getRowClassName={(params) => {
        return params.indexRelativeToCurrentPage % 2 === 0 ? "super-app-theme--rowColor-gray" : "super-app-theme--rowColor-white";
      }}
      pageSizeOptions={[5, 10, 20, 40, 100]}
      // initialState={{
      //   pagination: { paginationModel: { pageSize: pageSize } },
      // }}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      components={{
        ColumnSortedDescendingIcon: SortedDescendingIcon,
        ColumnSortedAscendingIcon: SortedAscendingIcon,
        NoRowsOverlay: EmptyTableMessage,
        LoadingOverlay: LinearProgress,
        Pagination: CustomPagination,
      }}
      onRowSelectionModelChange={(e) => selectModelChange(e)}
      onPageChange={setPage}
      onPageSizeChange={setPageSizeChange}
      onSortModelChange={onSortModelChange}
      onCellClick={onCellClick}
      hideFooter={hideFooter}
      sortingOrder={["desc", "asc", null]}
      {...props}
    />
  );
}
