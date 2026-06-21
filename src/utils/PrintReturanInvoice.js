import React, { useRef } from "react";
import elangVector from "../img/ElangVector.png";
import { formattedNumber, convertTimestampDate } from "./stingFormatted";
import { useReactToPrint } from "react-to-print";
import { useDispatch } from "react-redux";
import { setLoading } from "../redux/sidenavReducer";
import { Box, Button } from "@mui/material";

const css = {
  titleHeader: {
    fontSize: "20px",
    marginBlock: "0",
    fontWeight: "bold",
  },
  smallHeader: {
    marginBlock: "0",
    fontSize: "12px",
  },
  headerBorder: {
    border: "1px solid black",
    textAlign: "center",
    fontSize: "13px",
    padding: "3px 5px",
    fontWeight: "bold",
  },
  tableBorder: {
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    textAlign: "center",
    fontSize: "16px",
    letterSpacing: "-2px",
    wordSpacing: "-3px",
    fontFamily: "Courier New",
    padding: "2px 4px",
  },
  tableBorderLast: {
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    textAlign: "center",
    fontSize: "14px",
    letterSpacing: "-1px",
    fontFamily: "Courier New",
    padding: "2px 4px",
  },
  infoLabel: {
    fontSize: "12px",
    marginBlock: "0",
    fontWeight: "500",
    whiteSpace: "nowrap",
    minWidth: "85px",
  },
  infoValue: {
    fontSize: "12px",
    marginBlock: "0",
    border: "1px solid black",
    padding: "2px 6px",
    minHeight: "18px",
    flex: 1,
  },
  boxTitle: {
    border: "2px solid black",
    textAlign: "center",
    padding: "4px 12px",
    fontWeight: "bold",
    fontSize: "14px",
  },
  boxId: {
    border: "1px solid black",
    textAlign: "center",
    padding: "3px 10px",
    fontSize: "13px",
  },
};

/**
 * NOTA RETUR BARANG — printable invoice matching the physical design.
 * Layout: 8in × 5.5in (half-letter landscape)
 */
const ReturanTable = ({ data }) => {
  const items = data?.items || [];
  const minimumRows = 7;
  const rowsToAdd = Math.max(0, minimumRows - items.length);

  // Build customer display
  const customerName = [
    data?.ownerName !== "-" ? data?.ownerName : "",
    data?.merchantName !== "-" ? data?.merchantName : "",
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      style={{
        padding: "18px 22px",
        width: "8in",
        height: "5.5in",
        boxSizing: "border-box",
        position: "relative",
        fontFamily: "serif",
      }}
    >
      {/* ═══════ HEADER ═══════ */}
      <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "8px", paddingBottom: "6px", borderBottom: "2px double black" }}>
        {/* Logo */}
        <div style={{ flexShrink: 0, marginRight: "10px", marginTop: "2px" }}>
          <img alt="logo" src={elangVector} style={{ height: "40px", width: "auto" }} />
        </div>

        {/* Company info */}
        <div style={{ flex: 1, textAlign: "center" }}>
          <h1 style={css.titleHeader}>PERUSAHAAN KECAP ELANG DUA</h1>
          <p style={css.smallHeader}>Jl K.S Tubun No.01 Singkawang - Kalimantan Barat - Indonesia</p>
          <p style={css.smallHeader}>Phone : (0562) 632867 - WhatsApp : +62 811-5748-73</p>
        </div>

        {/* NOTA RETUR BARANG box */}
        <div style={{ flexShrink: 0, textAlign: "center", marginLeft: "10px" }}>
          <div style={css.boxTitle}>NOTA RETUR BARANG</div>
          <div style={{ ...css.boxId, marginTop: "4px" }}>
            <span style={{ fontSize: "11px" }}>No. Retur </span>
            <span style={{ fontWeight: "bold", fontSize: "14px" }}>{data?.id}</span>
          </div>
        </div>
      </div>

      {/* ═══════ INFO SECTION ═══════ */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "6px" }}>
        {/* Left column */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "3px" }}>
            <p style={css.infoLabel}>Tanggal Retur</p>
            <p style={css.infoValue}>{data?.returnDate ? convertTimestampDate(data.returnDate) : ""}</p>
          </div>

          {/* Alasan Retur */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
            <p style={{ ...css.infoLabel, minWidth: "85px" }}>Alasan Retur</p>
            <p style={css.infoValue}>{data?.returnReason || ""}</p>
          </div>
        </div>

        {/* Right column — customer */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <p style={{ ...css.infoLabel, minWidth: "70px" }}>Kepada Yth.</p>
            <div style={{ border: "1px solid black", padding: "2px 6px", flex: 1, minHeight: "45px" }}>
              <p style={{ marginBlock: "0", fontSize: "18px", fontWeight: "600" }}>{customerName}</p>
              <p style={{ marginBlock: "0", fontSize: "12px" }}>
                {data?.customerAddress || ""}
              </p>
            </div>
          </div>
        </div>
      </div>


      {/* ═══════ ITEMS TABLE ═══════ */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...css.headerBorder, width: "4%" }}>No</th>
            <th style={{ ...css.headerBorder, width: "48%" }}>Nama Barang</th>
            <th style={{ ...css.headerBorder, width: "5%" }}>Qty</th>
            <th style={{ ...css.headerBorder, width: "8%" }}>Satuan</th>
            <th style={{ ...css.headerBorder, width: "8%" }}>Harga</th>
            <th style={{ ...css.headerBorder, width: "12%" }}>Subtotal</th>
            <th style={{ ...css.headerBorder, width: "15%" }}>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td style={css.tableBorder}>{index + 1}</td>
              <td style={{ ...css.tableBorder, textAlign: "left", paddingLeft: "5px" }}>{item.label}</td>
              <td style={css.tableBorder}>{item.qty}</td>
              <td style={css.tableBorder}>{item.type || "-"}</td>
              <td style={{ ...css.tableBorder }}>{formattedNumber(Math.round(item.unitPrice || 0))}</td>
              <td style={{ ...css.tableBorder }}>{formattedNumber(Math.round(item.returnValue || 0))}</td>
              <td style={{ ...css.tableBorder, textAlign: "left", paddingLeft: "5px" }}>{item.remark || ""}</td>
            </tr>
          ))}
          {/* Empty rows to fill minimum */}
          {Array.from({ length: rowsToAdd }, (_, index) => (
            <tr key={`blank-${index}`} style={{ height: "22px" }}>
              <td style={css.tableBorder}></td>
              <td style={css.tableBorder}></td>
              <td style={css.tableBorder}></td>
              <td style={css.tableBorder}></td>
              <td style={css.tableBorder}></td>
              <td style={css.tableBorder}></td>
              <td style={css.tableBorder}></td>
            </tr>
          ))}
          {/* Closing border row */}
          <tr style={{ height: "2px" }}>
            <td style={css.tableBorderLast}></td>
            <td style={css.tableBorderLast}></td>
            <td style={css.tableBorderLast}></td>
            <td style={css.tableBorderLast}></td>
            <td style={css.tableBorderLast}></td>
            <td style={css.tableBorderLast}></td>
            <td style={css.tableBorderLast}></td>
          </tr>
          {/* TOTAL QTY RETUR */}
          <tr>
            <td colSpan={4} rowSpan={4}>
              <div style={{ display: "flex", gap: "15px", marginTop: "6px" }}>
                {/* Status Retur */}
                <div style={{ border: "1px solid black", padding: "4px 8px", minWidth: "180px" }}>
                  <p style={{ marginBlock: "0", fontSize: "11px", fontWeight: "bold" }}>Status Retur <span style={{ fontWeight: "normal" }}>(pilih salah satu)</span></p>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "2px" }}>
                    <span style={{ fontSize: "14px" }}>{data?.statusRetur === "tukar-barang" ? "☑" : "☐"}</span>
                    <span style={{ fontSize: "11px" }}>Tukar Barang</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ fontSize: "14px" }}>{data?.statusRetur === "potong-tagihan" ? "☑" : "☐"}</span>
                    <span style={{ fontSize: "11px" }}>Potong Tagihan</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ fontSize: "14px" }}>{(data?.statusRetur === "refund-dana" || data?.statusRetur === "refund") ? "☑" : "☐"}</span>
                    <span style={{ fontSize: "11px" }}>Refund Dana</span>
                  </div>
                </div>

                {/* Catatan */}
                <div style={{ flex: 1 }}>
                  <p style={{ marginBlock: "0", fontSize: "11px", fontWeight: "bold" }}>Catatan :</p>
                  <p style={{ marginBlock: "2px", fontSize: "11px", borderBottom: "1px solid black", minHeight: "14px" }}>{data?.notes || "\u00A0"}</p>
                  <p style={{ marginBlock: "2px", fontSize: "11px", borderBottom: "1px solid black", minHeight: "14px" }}>{"\u00A0"}</p>
                  <p style={{ marginBlock: "2px", fontSize: "11px", borderBottom: "1px solid black", minHeight: "14px" }}>{"\u00A0"}</p>
                </div>
              </div>

            </td>

            <td colSpan={2} style={{ textAlign: "right", fontWeight: "bold", fontSize: "16px", paddingRight: "8px", fontFamily: "Courier New", letterSpacing: "0px", wordSpacing: "-3px" }}>TOTAL QTY</td>
            <td style={{ borderLeft: "1px solid black", borderRight: "1px solid black", textAlign: "right", paddingRight: "8px", fontWeight: "bold", fontSize: "16px", fontFamily: "Courier New", letterSpacing: "-2px", wordSpacing: "-3px" }}>
              {data?.totalQty}
            </td>
          </tr>
          {/* TOTAL NILAI RETUR */}
          <tr >
            <td colSpan={2} style={{ textAlign: "right", fontWeight: "bold", fontSize: "16px", paddingRight: "8px", fontFamily: "Courier New", letterSpacing: "0px", wordSpacing: "-3px" }}>TOTAL NILAI</td>
            <td style={{ borderLeft: "1px solid black", borderRight: "1px solid black", borderBottom: "1px solid black", textAlign: "right", paddingRight: "8px", fontWeight: "bold", fontSize: "16px", fontFamily: "Courier New", letterSpacing: "-2px", wordSpacing: "-3px" }}>
              {formattedNumber(Math.round(data?.totalReturnValue || 0))}
            </td>
          </tr>
          <tr style={{ height: "17px" }}></tr>
          <tr style={{ height: "17px" }}></tr>

        </tbody>
      </table>

      {/* ═══════ BOTTOM SECTION ═══════ */}

      {/* ═══════ SIGNATURE AREAS ═══════ */}
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "8px" }}>
        {/* Pelanggan */}
        <div style={{ width: "160px", textAlign: "center" }}>
          <p style={{ marginBlock: "0", fontSize: "12px" }}>Diterima Oleh,</p>
          <div style={{ height: "50px" }}></div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ borderBottom: "1px solid black", width: "130px", height: "1px" }}></div>
          </div>
          <p style={{ marginBlock: "2px", fontSize: "12px", fontWeight: "500" }}>Pelanggan</p>
        </div>

        {/* Sales */}
        <div style={{ width: "160px", textAlign: "center" }}>
          <p style={{ marginBlock: "0", fontSize: "12px" }}>Dibawa Oleh,</p>
          <div style={{ height: "50px" }}></div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ borderBottom: "1px solid black", width: "130px", height: "1px" }}></div>
          </div>
          <p style={{ marginBlock: "2px", fontSize: "12px", fontWeight: "500" }}>Sales</p>
        </div>

        {/* Admin */}
        <div style={{ width: "160px", textAlign: "center" }}>
          <p style={{ marginBlock: "0", fontSize: "12px" }}>Disetujui Oleh,</p>
          <div style={{ height: "50px" }}></div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ borderBottom: "1px solid black", width: "130px", height: "1px" }}></div>
          </div>
          <p style={{ marginBlock: "2px", fontSize: "12px", fontWeight: "500" }}>Admin</p>
        </div>
      </div>
    </div>
  );
};

/**
 * ReturanInvoice — wraps the printable table with useReactToPrint.
 * Follows the same pattern as Invoice.js and BulkPrinting.
 */
export const ReturanInvoice = ({ data, onBeforePrint }) => {
  const dispatch = useDispatch();
  const printRef = useRef();

  const Print = useReactToPrint({
    onBeforePrint: () => dispatch(setLoading()),
    content: () => printRef.current,
    documentTitle: "Nota Retur Barang",
    onAfterPrint: () => dispatch(setLoading()),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div ref={printRef} className="hide-on-screen">
        <ReturanTable data={data} />
      </div>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
        <Button
          onClick={() => {
            Print();
            if (onBeforePrint) {
              onBeforePrint();
            }
          }}
          sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#c95f1f" }, width: "140px", height: "40px", borderRadius: "24px", textTransform: "none" }}
          variant="contained"
        >
          Print
        </Button>
      </Box>
    </div>
  );
};
