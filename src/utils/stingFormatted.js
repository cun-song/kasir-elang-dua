import numeral from "numeral";

export function formattedNumber(number) {
  return numeral(number).format("0,0").replace(/,/g, ".");
}
export function convertTimestamp(timestamp) {
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  let date = new Date(timestamp);

  let day = String(date.getDate()).padStart(2, "0");
  let monthIndex = date.getMonth(); // Months are zero-indexed
  let monthName = months[monthIndex];
  let year = date.getFullYear();
  let hours = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");

  let formattedDate = `${day} ${monthName} ${year} ${hours}:${minutes}`;
  return formattedDate;
}
