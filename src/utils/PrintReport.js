import React, { useRef } from "react";
import { convertTimestampDate, decimalToFraction, formattedNumber } from "./stingFormatted";
import { useReactToPrint } from "react-to-print";
import { useDispatch } from "react-redux";
import { setLoading } from "../redux/sidenavReducer";
import { Box, Button } from "@mui/material";
const css = {
  headerProduk: {
    border: "1px solid black",
    textAlign: "center",
    fontSize: "18px",
    padding: "8px",
  },
  bodyProduk: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "center",
    fontSize: "16px",
  },
  header: {
    border: "1px solid black",
    textAlign: "center",
    fontSize: "12px",
    padding: "5px",
    width: "auto",
    wordWarp: "breakWord",
    whiteSpace: "normal",
    overflow: "hidden",
  },
  headerHidden: {
    color: "transparent",
    textAlign: "center",
    fontSize: "12px",
    padding: "5px",
    width: "auto",
    wordWarp: "breakWord",
    whiteSpace: "normal",
    overflow: "hidden",
  },

  body: {
    border: "1px solid black",
    padding: "5px",
    textAlign: "center",
    fontSize: "12px",
    wordWarp: "breakWord",
    whiteSpace: "normal",
    overflow: "hidden",
  },
  bodyBolder: {
    border: "1px solid black",
    padding: "5px",
    textAlign: "center",
    fontSize: "12px",
    wordWarp: "breakWord",
    whiteSpace: "normal",
    overflow: "hidden",
  },
  bodyBoldest: {
    border: "1px solid black",
    padding: "5px",
    textAlign: "center",
    fontSize: "12px",
    wordWarp: "breakWord",
    whiteSpace: "normal",
    overflow: "hidden",
  },
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const PrintLusin = ({ doc, sumLusin, date, area }) => {
  const title = `Laporan Penjualan ${area === "All" ? "Total" : area} - ${monthNames[date?.month]} ${date?.year}`;
  const dispatch = useDispatch();
  const printRef = useRef();
  const Print = useReactToPrint({
    onBeforePrint: () => dispatch(setLoading()),
    content: () => printRef.current,
    documentTitle: title,
    onAfterPrint: () => dispatch(setLoading()),
  });

  return (
    <div>
      <div ref={printRef} className="hide-on-screen" style={{ padding: "1cm" }}>
        <p style={{ fontSize: "28px", fontWeight: "600", textAlign: "center", marginTop: "-10px" }}>{title}</p>

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}>
          <thead>
            <tr>
              <th style={css.headerProduk}>No</th>
              <th style={css.headerProduk}>Label</th>
              <th style={css.headerProduk}>Jumlah</th>
              <th style={css.headerProduk}>Jenis</th>
              <th style={css.headerProduk}>Total Lusin</th>
            </tr>
          </thead>
          <tbody>
            {doc.map((product, index) => (
              <tr key={product?.id}>
                <td style={css.bodyProduk}>{index + 1}</td>
                <td style={css.bodyProduk}>{product?.label}</td>
                <td style={css.bodyProduk}>{decimalToFraction(product?.value)}</td>
                <td style={css.bodyProduk}>{product?.type}</td>
                <td style={css.bodyProduk}>{decimalToFraction(product?.value * product?.totalLusin)}</td>
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

export const PrintBon = ({ doc, date, area }) => {
  const title = `Laporan Nota Bon ${area === "All" ? "Total" : area} - ${monthNames[date?.month]} ${date?.year}`;
  const dispatch = useDispatch();
  const printRef = useRef();
  const Print = useReactToPrint({
    onBeforePrint: () => dispatch(setLoading()),
    content: () => printRef.current,
    documentTitle: title,
    onAfterPrint: () => dispatch(setLoading()),
  });

  return (
    <div>
      <div ref={printRef} className="hide-on-screen tableNota" style={{ padding: "1cm" }}>
        <p style={{ fontSize: "28px", fontWeight: "600", textAlign: "center", marginTop: "-10px", marginBottom: "-10px" }}>{title}</p>

        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th style={css.headerHidden}>Nama</th>
              <th style={css.headerHidden}>Invoice</th>
              <th style={css.headerHidden}>Tanggal</th>
              <th style={{ ...css.headerHidden, width: "18%" }}>Produk</th>
              <th style={{ ...css.headerHidden, width: "3%" }}>Qty</th>
              <th style={{ ...css.headerHidden, width: "4%" }}>Jenis</th>
              <th style={{ ...css.headerHidden, width: "6%" }}>Harga</th>
              <th style={{ ...css.headerHidden, width: "5%" }}>Diskon</th>
              <th style={css.headerHidden}>Subtotal</th>
              <th style={css.headerHidden}>Total</th>
              <th style={css.headerHidden}>Lunas</th>
            </tr>{" "}
            <tr>
              <th style={css.header}>Nama</th>
              <th style={css.header}>Invoice</th>
              <th style={css.header}>Tanggal</th>
              <th style={{ ...css.header, width: "18%" }}>Produk</th>
              <th style={{ ...css.header, width: "3%" }}>Qty</th>
              <th style={{ ...css.header, width: "4%" }}>Jenis</th>
              <th style={{ ...css.header, width: "6%" }}>Harga</th>
              <th style={{ ...css.header, width: "5%" }}>Diskon</th>
              <th style={css.header}>Subtotal</th>
              <th style={css.header}>Total</th>
              <th style={css.header}>Lunas</th>
            </tr>
          </thead>
          <tbody>
            {doc.map((cust, index) => {
              return (
                <React.Fragment key={cust?.id}>
                  <tr>
                    {/* <td style={css.bodyBoldest} rowSpan={cust?.rowSpan}>
                      {cust?.id}
                    </td> */}
                    <td style={css.bodyBoldest} rowSpan={cust?.rowSpan}>
                      {cust?.name}
                    </td>
                    {/* <td style={css.bodyBoldest} rowSpan={cust?.rowSpan}>
                      {cust?.area}
                    </td> */}
                    <td style={css.bodyBolder} rowSpan={Object.keys(cust?.invoice[0]?.product)?.length}>
                      {cust?.invoice[0]?.invoice}
                    </td>
                    <td style={css.bodyBolder} rowSpan={Object.keys(cust?.invoice[0]?.product)?.length}>
                      {convertTimestampDate(cust?.invoice[0]?.time)}
                    </td>
                    <td style={css.body}>{cust?.invoice[0]?.product[Object.keys(cust?.invoice[0]?.product ?? 0)[0]]?.label}</td>
                    <td style={css.body}>{cust?.invoice[0]?.product[Object.keys(cust?.invoice[0]?.product ?? 0)[0]]?.productQty}</td>
                    <td style={css.body}>{cust?.invoice[0]?.product[Object.keys(cust?.invoice[0]?.product ?? 0)[0]]?.type}</td>
                    {cust?.invoice[0]?.product[Object.keys(cust?.invoice[0]?.product ?? 0)[0]]?.price === 0 ? (
                      <>
                        <td style={css.body} colSpan={3}>
                          Bonus
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={css.body}>{formattedNumber(cust?.invoice[0]?.product[Object.keys(cust?.invoice[0]?.product ?? 0)[0]]?.price)}</td>
                        <td style={css.body}>
                          {formattedNumber(
                            cust?.invoice[0]?.discount[cust?.invoice[0]?.product[Object.keys(cust?.invoice[0]?.product ?? 0)[0]]?.size?.toLowerCase()] * cust?.invoice[0]?.product[Object.keys(cust?.invoice[0]?.product ?? 0)[0]]?.totalLusin
                          )}
                        </td>
                        <td style={css.body}>
                          {formattedNumber(
                            (cust?.invoice[0]?.product[Object.keys(cust?.invoice[0]?.product ?? 0)[0]]?.price -
                              cust?.invoice[0]?.discount[cust?.invoice[0]?.product[Object.keys(cust?.invoice[0]?.product ?? 0)[0]]?.size?.toLowerCase()] *
                                cust?.invoice[0]?.product[Object.keys(cust?.invoice[0]?.product ?? 0)[0]]?.totalLusin) *
                              cust?.invoice[0]?.product[Object.keys(cust?.invoice[0]?.product ?? 0)[0]]?.productQty
                          )}
                        </td>
                      </>
                    )}

                    <td style={{ ...css.body, fontWeight: 600 }} rowSpan={Object.keys(cust?.invoice[0]?.product)?.length}>
                      {formattedNumber(cust?.invoice[0]?.total)}
                    </td>
                    <td style={css.body} rowSpan={Object.keys(cust?.invoice[0]?.product)?.length}>
                      {cust?.invoice[0]?.isPaid === 1 ? "Lunas" : ""}
                    </td>
                  </tr>
                  {Object.keys(cust?.invoice[0]?.product)
                    ?.slice(1)
                    .map((p) => (
                      <tr key={p}>
                        <td style={css.body}>{cust?.invoice[0]?.product[p]?.label}</td>
                        <td style={css.body}>{cust?.invoice[0]?.product[p]?.productQty}</td>

                        <td style={css.body}>{cust?.invoice[0]?.product[p]?.type}</td>
                        {cust?.invoice[0]?.product[p]?.price === 0 ? (
                          <>
                            <td style={css.body} colSpan={3}>
                              Bonus
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={css.body}>{formattedNumber(cust?.invoice[0]?.product[p]?.price)}</td>
                            <td style={css.body}>{formattedNumber(cust?.invoice[0]?.discount[cust?.invoice[0]?.product[p]?.size?.toLowerCase()] * cust?.invoice[0]?.product[p]?.totalLusin)}</td>
                            <td style={css.body}>
                              {formattedNumber(
                                (cust?.invoice[0]?.product[p]?.price - cust?.invoice[0]?.discount[cust?.invoice[0]?.product[p]?.size?.toLowerCase()] * cust?.invoice[0]?.product[p]?.totalLusin) * cust?.invoice[0]?.product[p]?.productQty
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}

                  {cust?.invoice?.slice(1).map((inv) => (
                    <React.Fragment key={inv?.invoice}>
                      <tr>
                        <td style={css.bodyBolder} rowSpan={Object.keys(inv?.product)?.length}>
                          {inv?.invoice}
                        </td>
                        <td style={css.bodyBolder} rowSpan={Object.keys(inv?.product)?.length}>
                          {convertTimestampDate(inv?.time)}
                        </td>
                        <td style={css.body}>{inv?.product[Object.keys(inv?.product ?? 0)[0]]?.label}</td>
                        <td style={css.body}>{inv?.product[Object.keys(inv?.product ?? 0)[0]]?.productQty}</td>
                        <td style={css.body}>{inv?.product[Object.keys(inv?.product ?? 0)[0]]?.type}</td>
                        {inv?.product[Object.keys(inv?.product ?? 0)[0]]?.price === 0 ? (
                          <>
                            <td style={css.body} colSpan={3}>
                              Bonus
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={css.body}>{formattedNumber(inv?.product[Object.keys(inv?.product ?? 0)[0]]?.price)}</td>
                            <td style={css.body}>{formattedNumber(inv?.discount[inv?.product[Object.keys(inv?.product ?? 0)[0]]?.size?.toLowerCase()] * inv?.product[Object.keys(inv?.product ?? 0)[0]]?.totalLusin)}</td>
                            <td style={css.body}>
                              {formattedNumber(
                                (inv?.product[Object.keys(inv?.product ?? 0)[0]]?.price - inv?.discount[inv?.product[Object.keys(inv?.product ?? 0)[0]]?.size?.toLowerCase()] * inv?.product[Object.keys(inv?.product ?? 0)[0]]?.totalLusin) *
                                  inv?.product[Object.keys(inv?.product ?? 0)[0]]?.productQty
                              )}
                            </td>
                          </>
                        )}

                        <td style={{ ...css.body, fontWeight: 600 }} rowSpan={Object.keys(inv?.product)?.length}>
                          {formattedNumber(inv?.total)}
                        </td>
                        <td style={css.body} rowSpan={Object.keys(inv?.product)?.length}>
                          {inv?.isPaid === 1 ? "Lunas" : ""}
                        </td>
                      </tr>
                      {Object.keys(inv?.product)
                        ?.slice(1)
                        .map((p) => (
                          <tr key={p}>
                            <td style={css.body}>{inv?.product[p]?.label}</td>
                            <td style={css.body}>{inv?.product[p]?.productQty}</td>
                            <td style={css.body}>{inv?.product[p]?.type}</td>
                            {inv?.product[p]?.price === 0 ? (
                              <>
                                <td style={css.body} colSpan={3}>
                                  Bonus
                                </td>
                              </>
                            ) : (
                              <>
                                <td style={css.body}>{formattedNumber(inv?.product[p]?.price)}</td>
                                <td style={css.body}>{formattedNumber(inv?.discount[inv?.product[p]?.size?.toLowerCase()] * inv?.product[p]?.totalLusin)}</td>
                                <td style={css.body}>{formattedNumber((inv?.product[p]?.price - inv?.discount[inv?.product[p]?.size?.toLowerCase()] * inv?.product[p]?.totalLusin) * inv?.product[p]?.productQty)}</td>
                              </>
                            )}
                          </tr>
                        ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        {/* <p style={{ fontSize: "24px" }}>Total Lusin : {decimalToFraction(sumLusin)} Lusin</p> */}
      </div>
      <Box>
        <Button onClick={Print} sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, width: "150px", height: "48px", borderRadius: "28px", textTransform: "none" }} variant="contained">
          Print
        </Button>
      </Box>
    </div>
  );
};
