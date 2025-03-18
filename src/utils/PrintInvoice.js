import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import elangVector from "../img/ElangVector.png";
import { decimalToFraction, formattedNumber } from "./stingFormatted";
import { renderToStaticMarkup } from "react-dom/server";
import { useReactToPrint } from "react-to-print";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/sidenavReducer";
import { Box, Button } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/id"; // Import Indonesian locale

const css = {
  titleHeader: {
    fontSize: "20px",
    marginBlock: "0",
  },
  smallHeader: {
    marginBlock: "0",
    fontSize: "12px",
  },
  headerBorder: {
    border: "1px solid black",
    textAlign: "center",
    fontSize: "14px",
    paddingRight: "5px",
    paddingLeft: "5px",
  },
  tableBorder: {
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    textAlign: "center",
    fontSize: "16px",
    letterSpacing: "-2px",
    wordSpacing: "-3px",
    fontFamily: "Courier New",
  },
  tableBorderTotal: {
    paddingRight: "8px",
    textAlign: "right",
    fontSize: "16px",
    letterSpacing: "-2px",
    wordSpacing: "-3px",
    fontFamily: "Courier New",
  },
  tableBorderValue: {
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    paddingRight: "8px",
    textAlign: "right",
    fontSize: "16px",
    letterSpacing: "-2px",
    wordSpacing: "-3px",
    fontFamily: "Courier New",
  },
  tableBorderLast: {
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    textAlign: "center",
    fontSize: "11px",
    fontSize: "16px",
    letterSpacing: "-2px",
    wordSpacing: "-3px",
    fontFamily: "Courier New",
  },
};

function formatDate(dateString) {
  return dateString.format("D MMMM YYYY");
}

const Table = ({ data, date }) => {
  const minimumRows = 11;
  const rowsToAdd = minimumRows - data?.product?.length;
  const nonBonusData = data?.product?.filter((product) => product?.price !== 0);
  const bonusData = data?.product?.filter((product) => product?.price === 0);
  const nbl = nonBonusData?.length;
  return (
    <div style={{ padding: "20px", paddingLeft: "25px", paddingTop: "18px", width: "8in", height: "5.5in", boxSizing: "border-box", position: "relative" }}>
      <div style={{ position: "absolute", top: 28, left: 25 }}>
        <img src={elangVector} style={{ height: "40px", width: "auto" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "10px", paddingBottom: "5px", borderBottom: "2px double black" }}>
        <h1 style={css.titleHeader}>Perusahaan Kecap ELANG DUA</h1>
        <p style={css.smallHeader}>Jl K.S Tubun No.01 Singkawang - Kalimantan Barat - Indonesia</p>
        <p style={css.smallHeader}>Phone : (0562) 632867 - WhatsApp : +62 811-5748-73</p>
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={css.smallHeader}>No Invoice: {data?.id}</p>
            <p style={css.smallHeader}>Admin: {data?.adminName}</p>
            <p style={css.smallHeader}>Dicetak: {formatDate(date)}</p>
          </div>

          <div>
            <p style={{ ...css.smallHeader, textAlign: "right" }}>Kepada Yth</p>
            <p style={{ ...css.smallHeader, fontWeight: "600", textAlign: "right", fontSize: "15px" }}>
              {data?.customer?.ownerName !== "-" ? data?.customer?.ownerName : ""}
              {data?.customer?.ownerName !== "-" && data?.customer?.merchantName !== "-" ? ", " : ""}
              {data?.customer?.merchantName !== "-" ? data?.customer?.merchantName : ""}
            </p>
            <p style={{ ...css.smallHeader, textAlign: "right" }}>
              {data?.customer?.address !== "-" ? data?.customer?.address : ""}
              {data?.customer?.address !== "-" && data?.customer?.area !== "-" ? ", " : ""}
              {data?.customer?.area !== "-" ? data?.customer?.area : ""}
            </p>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}>
          <thead>
            <tr>
              <th style={css.headerBorder}>No</th>
              <th style={css.headerBorder}>Produk</th>
              <th style={css.headerBorder}>Ukuran</th>
              <th style={{ ...css.headerBorder, paddingRight: "2px", paddingLeft: "2px" }}>Qty</th>
              <th style={css.headerBorder}>Jenis</th>
              <th style={{ ...css.headerBorder, paddingRight: "10px", paddingLeft: "10px" }}>Harga</th>
              <th style={css.headerBorder}>Diskon</th>
              <th style={css.headerBorder}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {nonBonusData.map((product, index) => (
              <tr key={product.id}>
                <td style={css.tableBorder}>{index + 1}</td>
                <td style={{ ...css.tableBorder, textAlign: "left", paddingLeft: "5px" }}>{product?.label}</td>
                <td style={css.tableBorder}>{product?.size}</td>
                <td style={css.tableBorder}>{decimalToFraction(product?.productQty)}</td>
                <td style={css.tableBorder}>{product?.type}</td>
                <td style={css.tableBorder}>{formattedNumber(product?.price)}</td>
                <td style={css.tableBorder}>{formattedNumber(product?.discount)}</td>
                <td style={css.tableBorder}>{formattedNumber(product?.subtotal)}</td>
              </tr>
            ))}
            {Array.from({ length: rowsToAdd }, (_, index) => (
              <tr key={`blank-${index}`} style={{ height: "20.5px" }}>
                <td style={css.tableBorder}></td>
                <td style={css.tableBorder}></td>
                <td style={css.tableBorder}></td>
                <td style={css.tableBorder}></td>
                <td style={css.tableBorder}></td>
                <td style={css.tableBorder}></td>
                <td style={css.tableBorder}></td>
                <td style={css.tableBorder}></td>
              </tr>
            ))}
            {bonusData.map((product, index) => (
              <tr key={product.id}>
                <td style={{ ...css.tableBorder, borderTop: data?.product[nbl + index - 1]?.price !== 0 && product?.price === 0 ? "1px solid black" : "none" }}>{nbl + index + 1}</td>
                <td style={{ ...css.tableBorder, textAlign: "left", paddingLeft: "5px", borderTop: data?.product[nbl + index - 1]?.price !== 0 && product?.price === 0 ? "1px solid black" : "none" }}>{product?.label}</td>
                <td style={{ ...css.tableBorder, borderTop: data?.product[nbl + index - 1]?.price !== 0 && product?.price === 0 ? "1px solid black" : "none" }}>{product?.size}</td>
                <td style={{ ...css.tableBorder, borderTop: data?.product[nbl + index - 1]?.price !== 0 && product?.price === 0 ? "1px solid black" : "none" }}>{decimalToFraction(product?.productQty)}</td>
                <td style={{ ...css.tableBorder, borderTop: data?.product[nbl + index - 1]?.price !== 0 && product?.price === 0 ? "1px solid black" : "none" }}>{product?.type}</td>
                <td style={{ ...css.tableBorder, borderTop: data?.product[nbl + index - 1]?.price !== 0 && product?.price === 0 ? "1px solid black" : "none" }}>Bonus</td>
                <td style={{ ...css.tableBorder, borderTop: data?.product[nbl + index - 1]?.price !== 0 && product?.price === 0 ? "1px solid black" : "none" }}>Bonus</td>
                <td style={{ ...css.tableBorder, borderTop: data?.product[nbl + index - 1]?.price !== 0 && product?.price === 0 ? "1px solid black" : "none" }}>Bonus</td>
              </tr>
            ))}
            <tr key={13} style={{ height: "2px" }}>
              <td style={css.tableBorderLast}></td>
              <td style={css.tableBorderLast}></td>
              <td style={css.tableBorderLast}></td>
              <td style={css.tableBorderLast}></td>
              <td style={css.tableBorderLast}></td>
              <td style={css.tableBorderLast}></td>
              <td style={css.tableBorderLast}></td>
              <td style={css.tableBorderLast}></td>
            </tr>
            <tr key={14}>
              <td rowSpan={5} colSpan={5}>
                <div style={{ display: "flex", justifyContent: "space-around", height: "80px" }}>
                  <div style={{ width: "150px", height: "100%" }}>
                    <p style={{ textAlign: "center", marginBottom: "50px", marginTop: "5px", fontWeight: "500", fontFamily: "serif" }}>PEMBELI</p>
                    <div style={{ display: "flex" }}>
                      <p style={{ marginBlock: "2px" }}>{"("}</p>
                      <div style={{ width: "98%", borderBottom: "1px solid black" }}></div>
                      <p style={{ marginBlock: "2px" }}>{")"}</p>
                    </div>
                  </div>
                  <div style={{ width: "190px", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "15px" }}>
                    <div style={{ border: "1px solid black", borderRadius: "12px", padding: 5 }}>
                      <p style={{ ...css.smallHeader, textAlign: "center", fontSize: "11px" }}>PERHATIKAN!!!</p>
                      <p style={{ ...css.smallHeader, textAlign: "center", fontSize: "11px" }}>Setelah Lunas pembayaran Bon Asli harus ditarik, tidak ditarik dianggap belum lunas.</p>
                    </div>
                  </div>
                  <div style={{ width: "150px", height: "100%" }}>
                    <p style={{ textAlign: "center", marginBottom: "50px", marginTop: "5px", fontWeight: "500", fontFamily: "serif" }}>ADMIN</p>
                    <div style={{ display: "flex" }}>
                      <p style={{ marginBlock: "2px" }}>{"("}</p>
                      <div style={{ width: "98%", borderBottom: "1px solid black" }}></div>
                      <p style={{ marginBlock: "2px" }}>{")"}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td style={css.tableBorderTotal} colSpan={2}>
                Total
              </td>
              <td style={css.tableBorderValue}>{data?.total}</td>
            </tr>
            <tr key={15}>
              <td style={css.tableBorderTotal} colSpan={2}>
                Diskon
              </td>
              <td style={css.tableBorderValue}>{data?.discount}</td>
            </tr>
            <tr key={16}>
              <td style={{ ...css.tableBorderTotal, fontWeight: "800", fontSize: "16px" }} colSpan={2}>
                Grand Total
              </td>
              <td style={{ ...css.tableBorderValue, paddingRight: "8px", textAlign: "right", fontWeight: "800", fontSize: "16px" }}>{data?.grandTotal}</td>
            </tr>
            <tr key={17}>
              <td style={css.tableBorderTotal} colSpan={2}>
                Total Lusin
              </td>
              <td style={{ ...css.tableBorderLast, textAlign: "right", paddingRight: "8px" }}>{decimalToFraction(data?.totalQty)}</td>
            </tr>
            <tr key={18} style={{ height: "17px" }}></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const BulkPrinting = ({ data }) => {
  const dispatch = useDispatch();
  const printRef = useRef();
  const Print = useReactToPrint({
    onBeforePrint: () => dispatch(setLoading()),
    content: () => printRef.current,
    documentTitle: "Invoice",
    onAfterPrint: () => dispatch(setLoading()),
  });
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.locale("id");

  // Set zona waktu yang Anda inginkan (contoh: Asia/Jakarta)
  const myTimezone = "Asia/Jakarta";
  const today = dayjs().tz(myTimezone);
  const [date, setDate] = useState(today);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
      <div ref={printRef} className="hide-on-screen">
        {data.map((item, index) => (
          <div key={index} style={{ pageBreakAfter: "always" }}>
            <Table data={item} date={date} />
          </div>
        ))}
      </div>
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
          <DatePicker sx={{ marginLeft: 2, mr: 6 }} defaultValue={today} disablePast views={["year", "month", "day"]} format="DD MMMM YYYY" onChange={(e) => setDate(e)} />
        </LocalizationProvider>
        <Button onClick={Print} sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, width: "150px", height: "48px", borderRadius: "28px", textTransform: "none" }} variant="contained">
          Print
        </Button>
      </Box>
    </div>
  );
};
