import numeral from "numeral";

export function formattedNumber(number) {
  return numeral(number).format("0,0").replace(/,/g, ".");
}

export function convertTimestamp(timestamp) {
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  // Tambahkan offset GMT+7 (7 jam dalam milidetik)
  const gmt7Offset = 7 * 60 * 60 * 1000;
  const date = new Date(timestamp + gmt7Offset);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const monthIndex = date.getUTCMonth(); // UTC-based
  const monthName = months[monthIndex];
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  const formattedDate = `${day} ${monthName} ${year} ${hours}:${minutes}`;
  return formattedDate;
}

export function convertTimestampDate(timestamp) {
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  // Shift timestamp by +7 hours (7 * 60 * 60 * 1000 ms)
  const gmt7Offset = 7 * 60 * 60 * 1000;
  const date = new Date(timestamp + gmt7Offset);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const monthIndex = date.getUTCMonth(); // UTC month
  const monthName = months[monthIndex];
  const year = date.getUTCFullYear();

  const formattedDate = `${day} ${monthName} ${year}`;
  return formattedDate;
}

export function decimalToFraction(dec) {
  if (dec === 0) return dec;
  const modulo = dec % 1;
  const integer = dec - modulo;
  const convertedInteger = integer === 0 ? "" : integer;
  const convertedModulo = modulo === 0.5 ? "1/2" : "";
  const separator = integer !== 0 && modulo === 0.5 ? " " : "";
  return `${convertedInteger}${separator}${convertedModulo}`;
}

export function decimalToFraction2(dec) {
  if (dec === 0) return dec;
  const modulo = dec % 1;
  const integer = dec - modulo;
  const convertedInteger = integer === 0 ? "" : integer;
  const ismodulo = modulo === 0.5 ? true : false;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <p style={{ marginBlockEnd: 0, marginBlockStart: 0 }}>{convertedInteger}</p>
      {ismodulo ? (
        <p style={{ marginLeft: "10px", marginBlockEnd: 0, marginBlockStart: 0 }}>
          <sup>1</sup>&frasl;<sub>2</sub>
        </p>
      ) : (
        <></>
      )}
    </div>
  );
}
