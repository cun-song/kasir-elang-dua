import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import elangVector from "../img/ElangVector.png";
import { decimalToFraction, formattedNumber } from "../utils/stingFormatted";
import { Button } from "@mui/material";
import { setLoading } from "../redux/sidenavReducer";
import { useDispatch } from "react-redux";
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
  },
  tableBorder: {
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    textAlign: "center",
    fontSize: "11px",
  },

  tableBorderTotal: {
    // border: "1px solid black",
    paddingRight: "8px",
    textAlign: "right",
    fontSize: "11px",
  },
  tableBorderValue: {
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    paddingRight: "8px",
    textAlign: "right",
    fontSize: "11px",
  },
  tableBorderLast: {
    borderLeft: "1px solid black",
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    textAlign: "center",
    fontSize: "11px",
  },
};
const Invoice = ({ transaction, customer, total, grandTotal, discount, totalQty, idTransaction, adminName }) => {
  const dispatch = useDispatch();
  const printRef = useRef();
  const Print = async () => {
    dispatch(setLoading());

    const element = printRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL("image/png");

    // Set custom size in inches (width: 9.5, height: 5.5)
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "in",
      format: [5.5, 9.5],
    });

    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = 9.5; // inches
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, "PNG", 0, 0, pdfWidth, pdfHeight);
    const pdfBlob = pdf.output("blob");

    // Create a URL for the PDF blob
    const pdfUrl = URL.createObjectURL(pdfBlob);

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    iframe.src = pdfUrl;

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      dispatch(setLoading());
    };

    document.body.appendChild(iframe);
  };
  function formatDate(date) {
    const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }
  const today = new Date();
  const minimumRows = 13;
  const rowsToAdd = minimumRows - transaction.length;
  const nonBonusData = transaction.filter((product) => product?.price !== 0);
  const bonusData = transaction.filter((product) => product?.price === 0);
  const nbl = nonBonusData?.length;
  //product length paling banyak 13
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div ref={printRef} style={{ padding: "20px", width: "9.5in", height: "5.5in", boxSizing: "border-box", border: "1px solid black", position: "absolute", left: "-9999px" }}>
        <div style={{ position: "absolute", top: 25, left: 20 }}>
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
              <p style={css.smallHeader}>No Invoice: {idTransaction}</p>
              <p style={css.smallHeader}>Admin: {adminName}</p>
              <p style={css.smallHeader}>Dicetak: {formatDate(today)}</p>
            </div>

            <div>
              <p style={{ ...css.smallHeader, fontWeight: "600" }}>Kepada Yth</p>
              <p style={css.smallHeader}>
                {customer?.ownerName}, {customer?.merchantName}
              </p>
              <p style={css.smallHeader}>
                {customer?.address}, {customer?.area}
              </p>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}>
            <thead>
              <tr>
                <th style={css.headerBorder}>No</th>
                <th style={css.headerBorder}>Produk</th>
                <th style={css.headerBorder}>Ukuran</th>
                <th style={css.headerBorder}>Qty</th>
                <th style={css.headerBorder}>Jenis</th>
                <th style={css.headerBorder}>Harga</th>
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
                <tr key={`blank-${index}`} style={{ height: "17px" }}>
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
                  <td style={{ ...css.tableBorder, borderTop: transaction[nbl + index - 1]?.price !== 0 && product?.price === 0 ? "1px solid black" : "none" }}>{nbl + index + 1}</td>
                  <td style={{ ...css.tableBorder, textAlign: "left", paddingLeft: "5px", borderTop: transaction[nbl + index - 1]?.price !== 0 && product?.price === 0 ? "1px solid black" : "none" }}>{product?.label}</td>
                  <td style={{ ...css.tableBorder, borderTop: transaction[nbl + index - 1]?.price !== 0 && product?.price === 0 ? "1px solid black" : "none" }}>{product?.size}</td>
                  <td style={{ ...css.tableBorder, borderTop: transaction[nbl + index - 1]?.price !== 0 && product?.price === 0 ? "1px solid black" : "none" }}>{decimalToFraction(product?.productQty)}</td>
                  <td style={{ ...css.tableBorder, borderTop: transaction[nbl + index - 1]?.price !== 0 && product?.price === 0 ? "1px solid black" : "none" }}>{product?.type}</td>
                  <td style={{ ...css.tableBorder, fontWeight: "600", borderTop: transaction[nbl + index - 1]?.price !== 0 && product?.price === 0 ? "1px solid black" : "none" }}>Bonus</td>
                  <td style={{ ...css.tableBorder, fontWeight: "600", borderTop: transaction[nbl + index - 1]?.price !== 0 && product?.price === 0 ? "1px solid black" : "none" }}>Bonus</td>
                  <td style={{ ...css.tableBorder, fontWeight: "600", borderTop: transaction[nbl + index - 1]?.price !== 0 && product?.price === 0 ? "1px solid black" : "none" }}>Bonus</td>
                </tr>
              ))}
              <tr key={13} style={{ height: "17px" }}>
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
                  <div style={{ display: "flex", justifyContent: "space-around", height: "85px" }}>
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
                <td style={css.tableBorderValue}>{total}</td>
              </tr>
              <tr key={15}>
                <td style={css.tableBorderTotal} colSpan={2}>
                  Diskon
                </td>
                <td style={css.tableBorderValue}>{discount}</td>
              </tr>
              <tr key={16}>
                <td style={{ ...css.tableBorderTotal, fontWeight: "800", fontSize: "14px" }} colSpan={2}>
                  Grand Total
                </td>
                <td style={{ ...css.tableBorderValue, paddingRight: "8px", textAlign: "right", fontWeight: "800", fontSize: "14px" }}>{grandTotal}</td>
              </tr>
              <tr key={17}>
                <td style={css.tableBorderTotal} colSpan={2}>
                  Total Lusin
                </td>
                <td style={{ ...css.tableBorderLast, textAlign: "right", paddingRight: "8px" }}>{decimalToFraction(totalQty)}</td>
              </tr>
              <tr key={18} style={{ height: "17px" }}></tr>
            </tbody>
          </table>
        </div>
      </div>
      <Button onClick={Print} sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, width: "150px", height: "48px", borderRadius: "28px", textTransform: "none" }} variant="contained">
        Print
      </Button>
    </div>
  );
};

export default Invoice;
