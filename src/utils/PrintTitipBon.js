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
 * NOTA REKAPAN (TITIP BON) — printable invoice matching the physical design.
 * Layout: 8.5in × 5.5in (continuous PRS paper)
 */
const TitipBonTable = ({ data }) => {
  const invoices = data?.invoices || [];
  const minimumRows = 7;
  const rowsToAdd = Math.max(0, minimumRows - invoices.length);

  // Build customer display
  const customerName = [
    data?.ownerName !== "-" ? data?.ownerName : "",
    data?.merchantName !== "-" ? data?.merchantName : "",
  ]
    .filter(Boolean)
    .join(", ");

  // Calculate totals
  const totalLusin = invoices.reduce((acc, inv) => acc + (inv?.lusin || 0), 0);
  const totalDiskon = invoices.reduce((acc, inv) => acc + (inv?.discount || 0), 0);

  return (
    <div
      style={{
        padding: "18px 22px",
        width: "8.5in",
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
          <p style={css.smallHeader}>Telp. (0562) 632867 - WhatsApp : +62 811-5748-73</p>
        </div>

        {/* NOTA REKAPAN (TITIP BON) box */}
        <div style={{ flexShrink: 0, textAlign: "center", marginLeft: "10px" }}>
          <div style={css.boxTitle}>NOTA REKAPAN (TITIP BON)</div>
          <div style={{ ...css.boxId, marginTop: "4px" }}>
            <span style={{ fontSize: "11px" }}>No. Rekapan : </span>
            <span style={{ fontWeight: "bold", fontSize: "14px" }}>{data?.id}</span>
          </div>
        </div>
      </div>

      {/* ═══════ INFO SECTION ═══════ */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "6px" }}>
        {/* Left column */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "3px" }}>
            <p style={css.infoLabel}>Pelanggan</p>
            <p style={{ ...css.infoLabel, minWidth: "15px", textAlign: "center" }}>:</p>
            <p style={{ ...css.infoValue, fontWeight: "bold", fontSize: "14px" }}>{customerName}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "3px" }}>
            <p style={css.infoLabel}>Alamat</p>
            <p style={{ ...css.infoLabel, minWidth: "15px", textAlign: "center" }}>:</p>
            <p style={css.infoValue}>{data?.customerAddress || ""}</p>
          </div>
        </div>

        {/* Right column */}
        <div style={{ flex: 0.6 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "3px" }}>
            <p style={{ ...css.infoLabel, minWidth: "60px" }}>Tanggal</p>
            <p style={{ ...css.infoLabel, minWidth: "15px", textAlign: "center" }}>:</p>
            <p style={css.infoValue}>{data?.timestamp ? convertTimestampDate(data.timestamp) : ""}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "3px" }}>
            <p style={{ ...css.infoLabel, minWidth: "60px" }}>Sales</p>
            <p style={{ ...css.infoLabel, minWidth: "15px", textAlign: "center" }}>:</p>
            <p style={css.infoValue}>{data?.createdBy || ""}</p>
          </div>
        </div>
      </div>

      {/* ═══════ INVOICE TABLE ═══════ */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...css.headerBorder, width: "4%" }}>No</th>
            <th style={{ ...css.headerBorder, width: "18%" }}>ID Invoice</th>
            <th style={{ ...css.headerBorder, width: "20%" }}>Tanggal Invoice</th>
            <th style={{ ...css.headerBorder, width: "12%" }}>Total Lusin</th>
            <th style={{ ...css.headerBorder, width: "18%" }}>Diskon (Rp)</th>
            <th style={{ ...css.headerBorder, width: "22%" }}>Total (Rp)</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv, index) => (
            <tr key={index}>
              <td style={css.tableBorder}>{index + 1}</td>
              <td style={css.tableBorder}>{inv.invoiceId}</td>
              <td style={css.tableBorder}>{inv.invoiceTimestamp ? convertTimestampDate(inv.invoiceTimestamp) : ""}</td>
              <td style={css.tableBorder}>{inv.lusin || 0}</td>
              <td style={{ ...css.tableBorder, textAlign: "right", paddingRight: "8px" }}>{formattedNumber(Math.round(inv.discount || 0))}</td>
              <td style={{ ...css.tableBorder, textAlign: "right", paddingRight: "8px" }}>{formattedNumber(Math.round(inv.total || 0))}</td>
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
          </tr>
          {/* TOTAL LUSIN */}
          <tr>
            <td colSpan={3} rowSpan={3}>
              {/* Catatan */}
              <div style={{ marginTop: "6px" }}>
                <div style={{ border: "1px solid black", padding: "4px 8px", minWidth: "180px" }}>
                  <p style={{ marginBlock: "0", fontSize: "11px", fontWeight: "bold" }}>Catatan :</p>
                  <p style={{ marginBlock: "2px", fontSize: "11px", borderBottom: "1px solid black", minHeight: "14px" }}>{"\u00A0"}</p>
                  <p style={{ marginBlock: "2px", fontSize: "11px", borderBottom: "1px solid black", minHeight: "14px" }}>{"\u00A0"}</p>
                </div>
              </div>
            </td>
            <td colSpan={2} style={{ textAlign: "right", fontWeight: "bold", fontSize: "16px", paddingRight: "8px", fontFamily: "Courier New", letterSpacing: "0px", wordSpacing: "-3px" }}>TOTAL LUSIN</td>
            <td style={{ borderLeft: "1px solid black", borderRight: "1px solid black", textAlign: "right", paddingRight: "8px", fontWeight: "bold", fontSize: "16px", fontFamily: "Courier New", letterSpacing: "-2px", wordSpacing: "-3px" }}>
              {totalLusin}
            </td>
          </tr>
          {/* TOTAL DISKON */}
          <tr>
            <td colSpan={2} style={{ textAlign: "right", fontWeight: "bold", fontSize: "16px", paddingRight: "8px", fontFamily: "Courier New", letterSpacing: "0px", wordSpacing: "-3px" }}>TOTAL DISKON</td>
            <td style={{ borderLeft: "1px solid black", borderRight: "1px solid black", textAlign: "right", paddingRight: "8px", fontWeight: "bold", fontSize: "16px", fontFamily: "Courier New", letterSpacing: "-2px", wordSpacing: "-3px" }}>
              Rp {formattedNumber(Math.round(totalDiskon))}
            </td>
          </tr>
          {/* GRAND TOTAL */}
          <tr>
            <td colSpan={2} style={{ textAlign: "right", fontWeight: "bold", fontSize: "16px", paddingRight: "8px", fontFamily: "Courier New", letterSpacing: "0px", wordSpacing: "-3px" }}>GRAND TOTAL</td>
            <td style={{ borderLeft: "1px solid black", borderRight: "1px solid black", borderBottom: "1px solid black", textAlign: "right", paddingRight: "8px", fontWeight: "bold", fontSize: "16px", fontFamily: "Courier New", letterSpacing: "-2px", wordSpacing: "-3px" }}>
              Rp {formattedNumber(Math.round(data?.grandTotal || 0))}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ═══════ SIGNATURE AREAS ═══════ */}
      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "12px" }}>
        {/* Pelanggan */}
        <div style={{ width: "160px", textAlign: "center" }}>
          <p style={{ marginBlock: "0", fontSize: "12px" }}>Diterima Oleh,</p>
          <div style={{ height: "50px" }}></div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ borderBottom: "1px solid black", width: "130px", height: "1px" }}></div>
          </div>
          <p style={{ marginBlock: "2px", fontSize: "12px", fontWeight: "500" }}>Pelanggan</p>
        </div>

        {/* Admin */}
        <div style={{ width: "160px", textAlign: "center" }}>
          <p style={{ marginBlock: "0", fontSize: "12px" }}>Dibuat Oleh,</p>
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
 * TitipBonInvoice — wraps the printable table with useReactToPrint.
 * Follows the same pattern as ReturanInvoice.
 */
export const TitipBonInvoice = ({ data, onBeforePrint }) => {
  const dispatch = useDispatch();
  const printRef = useRef();

  const Print = useReactToPrint({
    onBeforePrint: () => dispatch(setLoading()),
    content: () => printRef.current,
    documentTitle: "Nota Rekapan Titip Bon",
    onAfterPrint: () => dispatch(setLoading()),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div ref={printRef} className="hide-on-screen">
        <TitipBonTable data={data} />
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
