import React, { useRef } from "react";
import { decimalToFraction } from "./stingFormatted";
import { useReactToPrint } from "react-to-print";
import { useDispatch } from "react-redux";
import { setLoading } from "../redux/sidenavReducer";
import { Box, Button } from "@mui/material";
const css = {
  header: {
    border: "1px solid black",
    textAlign: "center",
    fontSize: "18px",
    padding: "10px",
  },
  body: {
    border: "1px solid black",
    padding: "10px",
    // borderRight: "1px solid black",
    textAlign: "center",
    fontSize: "16px",
  },
};

export const PrintLusin = ({ doc, sumLusin, date }) => {
  const dispatch = useDispatch();
  const printRef = useRef();
  const Print = useReactToPrint({
    onBeforePrint: () => dispatch(setLoading()),
    content: () => printRef.current,
    documentTitle: "Invoice",
    onAfterPrint: () => dispatch(setLoading()),
  });
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div>
      <div ref={printRef} className="hide-on-screen" style={{ padding: "1cm" }}>
        <p style={{ fontSize: "28px", fontWeight: "600", textAlign: "center" }}>
          Laporan Penjualan {monthNames[date?.month]} {date?.year}
        </p>

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}>
          <thead>
            <tr>
              <th style={css.header}>No</th>
              <th style={css.header}>Label</th>
              <th style={css.header}>Jumlah</th>
              <th style={css.header}>Jenis</th>
              <th style={css.header}>Total Lusin</th>
            </tr>
          </thead>
          <tbody>
            {doc.map((product, index) => (
              <tr key={product?.id}>
                <td style={css.body}>{index + 1}</td>
                <td style={css.body}>{product?.label}</td>
                <td style={css.body}>{decimalToFraction(product?.value)}</td>
                <td style={css.body}>{product?.type}</td>
                <td style={css.body}>{decimalToFraction(product?.value * product?.totalLusin)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: "24px" }}>Total Lusin : {decimalToFraction(sumLusin)} Lusin</p>
      </div>
      <Box>
        <Button onClick={Print} sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, width: "150px", height: "48px", borderRadius: "28px", textTransform: "none" }} variant="contained">
          Print
        </Button>
      </Box>
    </div>
  );
};
