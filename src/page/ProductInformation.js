import React from "react";
import { Box, Button } from "@mui/material";
import NavBar from "../component/NavBar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { click, setTitle } from "../redux/sidenavReducer";

import { useState, useMemo, useCallback } from "react";

/* ─── constants ─────────────────────────────────────── */
const ACC = "#e06f2c";
const ACC_DARK = "#b85820";
const ACC_LIGHT = "#fdf0e8";
const ACC_MID = "#f4a46a";

const varianKecap = [
  { id: "manis_kental", label: "Kecap Manis Kental" },
  { id: "manis_sedang", label: "Kecap Manis Sedang" },
  { id: "asin", label: "Kecap Asin" },
  { id: "ikan", label: "Kecap Ikan" },
  { id: "pedas", label: "Kecap Pedas" },
  { id: "premium", label: "Kecap Premium" },
];

const defaultBahan = {
  manis_kental: [
    { id: 1, nama: "Kedelai Hitam", satuan: "kg", harga: 18000, jumlah: 10 },
    { id: 2, nama: "Gula Merah", satuan: "kg", harga: 22000, jumlah: 8 },
    { id: 3, nama: "Garam", satuan: "kg", harga: 3000, jumlah: 2 },
    { id: 4, nama: "Bawang Putih", satuan: "kg", harga: 40000, jumlah: 1 },
    { id: 5, nama: "Lengkuas", satuan: "kg", harga: 12000, jumlah: 0.5 },
    { id: 6, nama: "Daun Salam", satuan: "ikat", harga: 5000, jumlah: 2 },
    { id: 7, nama: "Gas LPG", satuan: "tabung", harga: 25000, jumlah: 1 },
  ],
  manis_sedang: [
    { id: 1, nama: "Kedelai Hitam", satuan: "kg", harga: 18000, jumlah: 8 },
    { id: 2, nama: "Gula Merah", satuan: "kg", harga: 22000, jumlah: 5 },
    { id: 3, nama: "Garam", satuan: "kg", harga: 3000, jumlah: 2 },
    { id: 4, nama: "Air", satuan: "liter", harga: 500, jumlah: 5 },
    { id: 5, nama: "Gas LPG", satuan: "tabung", harga: 25000, jumlah: 1 },
  ],
  asin: [
    { id: 1, nama: "Kedelai Kuning", satuan: "kg", harga: 16000, jumlah: 10 },
    { id: 2, nama: "Garam Kasar", satuan: "kg", harga: 4000, jumlah: 5 },
    { id: 3, nama: "Air", satuan: "liter", harga: 500, jumlah: 10 },
    { id: 4, nama: "Gas LPG", satuan: "tabung", harga: 25000, jumlah: 1 },
  ],
};

const defaultPengemasan = {
  manis_kental: [
    { id: 1, nama: "Botol Kaca 250ml", satuan: "pcs", harga: 3500, jumlah: 12 },
    { id: 2, nama: "Tutup Botol", satuan: "pcs", harga: 300, jumlah: 12 },
    { id: 3, nama: "Label Stiker", satuan: "pcs", harga: 250, jumlah: 12 },
    { id: 4, nama: "Shrink Wrap", satuan: "pcs", harga: 200, jumlah: 12 },
    { id: 5, nama: "Kardus", satuan: "pcs", harga: 3000, jumlah: 1 },
  ],
  manis_sedang: [
    { id: 1, nama: "Botol Plastik 250ml", satuan: "pcs", harga: 1500, jumlah: 12 },
    { id: 2, nama: "Tutup Botol", satuan: "pcs", harga: 200, jumlah: 12 },
    { id: 3, nama: "Label Stiker", satuan: "pcs", harga: 200, jumlah: 12 },
    { id: 4, nama: "Kardus", satuan: "pcs", harga: 2500, jumlah: 1 },
  ],
  asin: [
    { id: 1, nama: "Botol Kaca 150ml", satuan: "pcs", harga: 2800, jumlah: 12 },
    { id: 2, nama: "Tutup Botol", satuan: "pcs", harga: 250, jumlah: 12 },
    { id: 3, nama: "Label Stiker", satuan: "pcs", harga: 200, jumlah: 12 },
    { id: 4, nama: "Kardus", satuan: "pcs", harga: 2500, jumlah: 1 },
  ],
};

const getDefaultBahan = (id) => (defaultBahan[id] || [{ id: 1, nama: "Bahan Utama", satuan: "kg", harga: 0, jumlah: 0 }]).map((b) => ({ ...b }));
const getDefaultPengemasan = (id) => (defaultPengemasan[id] || [{ id: 1, nama: "Kemasan", satuan: "pcs", harga: 0, jumlah: 0 }]).map((b) => ({ ...b }));

const fmt = (n) => new Intl.NumberFormat("id-ID").format(Math.round(n));
const unitSize = (t) => (t === "lusin" ? 12 : 24);
let nextId = 200;

/* ─── shared style tokens ────────────────────────────── */
const TH = {
  fontSize: 11,
  fontWeight: 600,
  color: "var(--color-text-secondary)",
  textTransform: "uppercase",
  letterSpacing: ".05em",
  padding: "6px 6px",
  borderBottom: "0.5px solid var(--color-border-tertiary)",
  background: "var(--color-background-secondary)",
};
const TD = { padding: "5px 4px", verticalAlign: "middle", fontSize: 13 };
const INPUT_BASE = {
  width: "100%",
  padding: "7px 8px",
  borderRadius: 6,
  border: "0.5px solid var(--color-border-tertiary)",
  background: "var(--color-background-primary)",
  color: "var(--color-text-primary)",
  fontSize: 13,
};
const TFOOT_ROW = { borderTop: `1px solid ${ACC_MID}`, background: ACC_LIGHT };
const TFOOT_LABEL = { ...TD, fontWeight: 600, fontSize: 13, paddingLeft: 8, color: ACC_DARK };
const TFOOT_VAL = { ...TD, textAlign: "right", fontWeight: 700, fontSize: 14, color: ACC_DARK };
const BTN_DEL = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: "0.5px solid var(--color-border-tertiary)",
  background: "transparent",
  color: "var(--color-text-secondary)",
  cursor: "pointer",
  fontSize: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const BTN_ACC = {
  padding: "8px 16px",
  borderRadius: 8,
  border: "none",
  background: ACC,
  color: "#fff",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};

export default function Settings() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(click(5));
    dispatch(setTitle("Informasi Biaya Produk"));
  }, []);
  const [varian, setVarian] = useState("manis_kental");
  const [bahanMap, setBahanMap] = useState(() => {
    const m = {};
    varianKecap.forEach((v) => {
      m[v.id] = getDefaultBahan(v.id);
    });
    return m;
  });
  const [kemasanMap, setKemasanMap] = useState(() => {
    const m = {};
    varianKecap.forEach((v) => {
      m[v.id] = getDefaultPengemasan(v.id);
    });
    return m;
  });
  const [jumlahUnit, setJumlahUnit] = useState(10);
  const [unitType, setUnitType] = useState("lusin");
  const [hargaJual, setHargaJual] = useState(0);
  const [diskonType, setDiskonType] = useState("persen");
  const [diskonPersen, setDiskonPersen] = useState(0);
  const [diskonNominal, setDiskonNominal] = useState(0);
  const [tab, setTab] = useState("hpp");

  const bahan = bahanMap[varian] || [];
  const kemasan = kemasanMap[varian] || [];

  /* stable callbacks — useCallback so identity doesn't change on unrelated re-renders */
  const setBahan = useCallback((list) => setBahanMap((prev) => ({ ...prev, [varian]: list })), [varian]);
  const setKemasan = useCallback((list) => setKemasanMap((prev) => ({ ...prev, [varian]: list })), [varian]);

  const handleUpdateBahan = useCallback(
    (id, field, value) => {
      setBahanMap((prev) => ({
        ...prev,
        [varian]: prev[varian].map((b) => (b.id === id ? { ...b, [field]: field === "nama" || field === "satuan" ? value : parseFloat(value) || 0 } : b)),
      }));
    },
    [varian]
  );

  const handleUpdateKemasan = useCallback(
    (id, field, value) => {
      setKemasanMap((prev) => ({
        ...prev,
        [varian]: prev[varian].map((k) => (k.id === id ? { ...k, [field]: field === "nama" || field === "satuan" ? value : parseFloat(value) || 0 } : k)),
      }));
    },
    [varian]
  );

  const handleAddBahan = useCallback(() => setBahan([...bahan, { id: ++nextId, nama: "", satuan: "kg", harga: 0, jumlah: 0 }]), [bahan, setBahan]);
  const handleAddKemasan = useCallback(() => setKemasan([...kemasan, { id: ++nextId, nama: "", satuan: "pcs", harga: 0, jumlah: 0 }]), [kemasan, setKemasan]);
  const handleRemoveBahan = useCallback(
    (id) => {
      if (bahan.length > 1) setBahan(bahan.filter((b) => b.id !== id));
    },
    [bahan, setBahan]
  );
  const handleRemoveKemasan = useCallback(
    (id) => {
      if (kemasan.length > 1) setKemasan(kemasan.filter((k) => k.id !== id));
    },
    [kemasan, setKemasan]
  );

  /* calculations */
  const totalBiayaBahan = useMemo(() => bahan.reduce((s, b) => s + b.harga * b.jumlah, 0), [bahan]);
  const totalBiayaKemasan = useMemo(() => kemasan.reduce((s, k) => s + k.harga * k.jumlah, 0), [kemasan]);
  const botolPerUnit = unitSize(unitType);
  const totalBotol = jumlahUnit * botolPerUnit;

  const hppBahanPerUnit = jumlahUnit > 0 ? totalBiayaBahan / jumlahUnit : 0;
  const hppBahanPerBotol = totalBotol > 0 ? totalBiayaBahan / totalBotol : 0;
  const hppTotalPerUnit = hppBahanPerUnit + totalBiayaKemasan;
  const hppTotalPerBotol = botolPerUnit > 0 ? hppTotalPerUnit / botolPerUnit : 0;

  const diskonNomEff = diskonType === "persen" ? (hargaJual * diskonPersen) / 100 : diskonNominal;
  const diskonPctEff = hargaJual > 0 ? (diskonNomEff / hargaJual) * 100 : 0;
  const hargaEff = hargaJual - diskonNomEff;

  const profitPerUnit = hargaEff - hppTotalPerUnit;
  const profitPerBotol = botolPerUnit > 0 ? profitPerUnit / botolPerUnit : 0;
  const profitMargin = hargaEff > 0 ? (profitPerUnit / hargaEff) * 100 : 0;
  const totalRevenue = hargaEff * jumlahUnit;
  const totalHPPAll = hppTotalPerUnit * jumlahUnit;
  const totalProfit = profitPerUnit * jumlahUnit;
  const bep = hppTotalPerUnit > 0 && profitPerUnit > 0 ? Math.ceil(totalHPPAll / profitPerUnit) : 0;

  const varianLabel = varianKecap.find((v) => v.id === varian)?.label || "";
  const unitLabel = unitType === "lusin" ? "Lusin" : "Dus";
  const profitColor = profitPerUnit >= 0 ? ACC : "#e63946";
  const marginColor = profitMargin >= 30 ? ACC : profitMargin >= 10 ? "#d4a017" : "#e63946";

  /* inline style helpers */
  const card = { background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1rem" };
  const lbl = { fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6, display: "block" };
  const sel = { padding: "8px 10px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontSize: 14, cursor: "pointer" };
  const inp = { ...INPUT_BASE, textAlign: "left" };
  const mc = { background: "var(--color-background-secondary)", borderRadius: 10, padding: "12px 14px", flex: "1 1 140px", minWidth: 0 };
  const btn = {
    padding: "7px 14px",
    borderRadius: 8,
    border: "0.5px solid var(--color-border-secondary)",
    background: "transparent",
    color: "var(--color-text-primary)",
    fontSize: 13,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
  };
  const tabBtn = (a) => ({
    padding: "8px 16px",
    borderRadius: 8,
    border: `0.5px solid ${a ? ACC : "var(--color-border-tertiary)"}`,
    background: a ? ACC : "transparent",
    color: a ? "#fff" : "var(--color-text-secondary)",
    fontSize: 13,
    fontWeight: a ? 600 : 400,
    cursor: "pointer",
  });
  const badge = (c) => ({
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    background: c === "acc" ? ACC_LIGHT : c === "red" ? "#ffe0e0" : "#fff3cd",
    color: c === "acc" ? ACC_DARK : c === "red" ? "#7f1d1d" : "#7d4e00",
  });
  const divider = { borderTop: "0.5px solid var(--color-border-tertiary)", margin: "10px 0" };
  const pbar = { height: 6, borderRadius: 3, background: "var(--color-background-secondary)", overflow: "hidden", marginTop: 4 };
  const pfill = (pct, color) => ({ width: Math.min(100, Math.max(0, pct)) + "%", height: "100%", background: color, borderRadius: 3, transition: "width .4s ease" });
  const segBtn = (a) => ({
    flex: 1,
    padding: "6px 0",
    borderRadius: 6,
    border: `0.5px solid ${a ? ACC : "var(--color-border-tertiary)"}`,
    background: a ? ACC_LIGHT : "transparent",
    color: a ? ACC_DARK : "var(--color-text-secondary)",
    fontSize: 12,
    fontWeight: a ? 600 : 400,
    cursor: "pointer",
  });
  const infoRow = (item, i, max) => (
    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < max ? "0.5px solid var(--color-border-tertiary)" : "none" }}>
      <span style={{ fontSize: 13, color: item.bold ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>{item.label}</span>
      <span style={{ fontSize: 13, fontWeight: item.bold ? 700 : 400, color: item.color || "var(--color-text-primary)" }}>{item.val}</span>
    </div>
  );

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ width: "100%", pr: 5 }}>
        <NavBar />
        <Box sx={{ backgroundColor: "white", borderRadius: "10px", p: 4, mt: 4 }}>
          <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "var(--color-background-tertiary)", minHeight: "100vh", paddingBottom: "2rem" }}>
            {/* header */}
            <div style={{ background: `linear-gradient(135deg,${ACC_DARK} 0%,${ACC} 65%,${ACC_MID} 100%)`, padding: "1.5rem 1.5rem 1rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🍶</div>
                <div>
                  <p style={{ fontSize: 21, fontWeight: 700, color: "#fff", margin: 0 }}>Kalkulator HPP Kecap</p>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.78)", marginTop: 3 }}>Harga Pokok Produksi · Analisis Profit per {unitLabel}</p>
                </div>
              </div>
            </div>

            <div style={{ padding: "0 1.25rem" }}>
              {/* config row */}
              <div style={card}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                  <div style={{ flex: "2 1 200px" }}>
                    <span style={lbl}>Varian Kecap</span>
                    <select style={{ ...sel, width: "100%" }} value={varian} onChange={(e) => setVarian(e.target.value)}>
                      {varianKecap.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: "1 1 90px" }}>
                    <span style={lbl}>Jumlah Produksi</span>
                    <input type="number" min="1" value={jumlahUnit} onChange={(e) => setJumlahUnit(Math.max(1, Number(e.target.value)))} style={inp} />
                  </div>
                  <div style={{ flex: "1 1 130px" }}>
                    <span style={lbl}>Satuan</span>
                    <select style={{ ...sel, width: "100%" }} value={unitType} onChange={(e) => setUnitType(e.target.value)}>
                      <option value="lusin">Lusin (12 btl)</option>
                      <option value="dus">Dus (24 btl)</option>
                    </select>
                  </div>
                  <button
                    style={btn}
                    onClick={() => {
                      setBahan(getDefaultBahan(varian));
                      setKemasan(getDefaultPengemasan(varian));
                    }}
                  >
                    ↺ Reset Default
                  </button>
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: "var(--color-text-secondary)" }}>
                  Total produksi: <strong style={{ color: ACC }}>{fmt(totalBotol)} botol</strong> ({jumlahUnit} {unitLabel})
                </div>
              </div>

              {/* tabs */}
              <div style={{ display: "flex", gap: 4, marginBottom: "1rem", flexWrap: "wrap" }}>
                {[
                  ["hpp", "Bahan Baku & HPP"],
                  ["profit", "Analisis Profit"],
                  ["summary", "Ringkasan"],
                ].map(([k, l]) => (
                  <button key={k} style={tabBtn(tab === k)} onClick={() => setTab(k)}>
                    {l}
                  </button>
                ))}
              </div>

              {/* ══ TAB HPP ══ */}
              {tab === "hpp" && (
                <>
                  <div style={card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <div>
                        <span style={{ fontSize: 15, fontWeight: 600 }}>Bahan Baku</span>
                        <span style={{ fontSize: 12, color: "var(--color-text-secondary)", marginLeft: 8 }}>— {varianLabel}</span>
                      </div>
                    </div>
                    <TableBahan list={bahan} onUpdate={handleUpdateBahan} onAdd={handleAddBahan} onRemove={handleRemoveBahan} />
                    <div style={{ marginTop: 8, display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: "var(--color-text-secondary)" }}>
                      <span>
                        HPP bahan / {unitLabel}: <strong style={{ color: ACC }}>Rp {fmt(hppBahanPerUnit)}</strong>
                      </span>
                      <span>
                        HPP bahan / botol: <strong style={{ color: ACC }}>Rp {fmt(hppBahanPerBotol)}</strong>
                      </span>
                    </div>
                  </div>

                  <div style={card}>
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>Biaya Pengemasan</span>
                      <span style={{ fontSize: 12, color: "var(--color-text-secondary)", marginLeft: 8 }}>per {unitLabel}</span>
                    </div>
                    <TableKemasan list={kemasan} onUpdate={handleUpdateKemasan} onAdd={handleAddKemasan} onRemove={handleRemoveKemasan} unitLabel={unitLabel} />
                    <div style={{ marginTop: 8, fontSize: 12, color: "var(--color-text-secondary)" }}>
                      Pengemasan / botol: <strong style={{ color: ACC }}>Rp {fmt(totalBiayaKemasan / botolPerUnit)}</strong>
                    </div>
                  </div>

                  {/* metric cards */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "1rem" }}>
                    {[
                      { label: "Total Bahan Baku", val: `Rp ${fmt(totalBiayaBahan)}`, sub: "Per sekali masak" },
                      { label: `Pengemasan / ${unitLabel}`, val: `Rp ${fmt(totalBiayaKemasan)}`, sub: `${botolPerUnit} botol` },
                      { label: `HPP / ${unitLabel}`, val: `Rp ${fmt(hppTotalPerUnit)}`, sub: "Bahan ÷ produksi + kemasan", hi: true },
                      { label: "HPP / Botol", val: `Rp ${fmt(hppTotalPerBotol)}`, sub: "Per satuan botol", hi: true },
                    ].map((m, i) => (
                      <div key={i} style={{ ...mc, border: m.hi ? `1.5px solid ${ACC_MID}` : "0.5px solid var(--color-border-tertiary)" }}>
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500, textTransform: "uppercase", letterSpacing: ".05em" }}>{m.label}</div>
                        <div style={{ fontSize: 17, fontWeight: 700, color: m.hi ? ACC : "var(--color-text-primary)", marginTop: 2 }}>{m.val}</div>
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>{m.sub}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ ...card, background: ACC_LIGHT, border: `0.5px solid ${ACC_MID}` }}>
                    <div style={{ fontSize: 12, color: ACC_DARK, lineHeight: 1.7 }}>
                      <strong>Formula HPP per {unitLabel}:</strong>
                      <br />
                      HPP / {unitLabel} = (Total Bahan Baku ÷ Jumlah Produksi) + Total Biaya Pengemasan per {unitLabel}
                      <br />= (Rp {fmt(totalBiayaBahan)} ÷ {jumlahUnit}) + Rp {fmt(totalBiayaKemasan)} = <strong>Rp {fmt(hppTotalPerUnit)}</strong>
                    </div>
                  </div>
                </>
              )}

              {/* ══ TAB PROFIT ══ */}
              {tab === "profit" && (
                <>
                  <div style={card}>
                    <span style={lbl}>Penetapan Harga Jual</span>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
                      <div style={{ flex: "1 1 200px" }}>
                        <span style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Harga Jual per {unitLabel} (Rp)</span>
                        <input type="number" min="0" value={hargaJual || ""} onChange={(e) => setHargaJual(Number(e.target.value))} style={inp} placeholder={`Harga per ${unitLabel}...`} />
                        {hargaJual > 0 && <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 3 }}>≈ Rp {fmt(hargaJual / botolPerUnit)} / botol</div>}
                      </div>
                      <div style={{ flex: "1 1 260px" }}>
                        <span style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>Diskon</span>
                        <div style={{ display: "flex", border: "0.5px solid var(--color-border-secondary)", borderRadius: 8, overflow: "hidden", width: "fit-content", marginBottom: 8 }}>
                          <button style={segBtn(diskonType === "persen")} onClick={() => setDiskonType("persen")}>
                            Persen (%)
                          </button>
                          <button style={segBtn(diskonType === "nominal")} onClick={() => setDiskonType("nominal")}>
                            Nominal (Rp)
                          </button>
                        </div>
                        {diskonType === "persen" ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <input type="range" min="0" max="60" step="1" value={diskonPersen} onChange={(e) => setDiskonPersen(Number(e.target.value))} style={{ flex: 1 }} />
                            <input type="number" min="0" max="100" value={diskonPersen} onChange={(e) => setDiskonPersen(Math.min(100, Number(e.target.value)))} style={{ ...INPUT_BASE, width: 60, textAlign: "right" }} />
                            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", flexShrink: 0 }}>%</span>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 13, color: "var(--color-text-secondary)", flexShrink: 0 }}>Rp</span>
                            <input type="number" min="0" value={diskonNominal || ""} onChange={(e) => setDiskonNominal(Number(e.target.value))} style={{ ...INPUT_BASE, flex: 1, textAlign: "right" }} placeholder="0" />
                            <span style={{ fontSize: 12, color: "var(--color-text-secondary)", flexShrink: 0 }}>per {unitLabel}</span>
                          </div>
                        )}
                        {hargaJual > 0 && (
                          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 6, background: ACC_LIGHT, padding: "6px 10px", borderRadius: 6 }}>
                            Diskon: Rp {fmt(diskonNomEff)} ({diskonPctEff.toFixed(1)}%) → Harga efektif:{" "}
                            <strong style={{ color: ACC }}>
                              Rp {fmt(hargaEff)} / {unitLabel}
                            </strong>{" "}
                            ≈ Rp {fmt(hargaEff / botolPerUnit)} / botol
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {hargaJual > 0 ? (
                    <>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "1rem" }}>
                        {[
                          { label: `Profit / ${unitLabel}`, val: `Rp ${fmt(profitPerUnit)}`, color: profitColor },
                          { label: "Margin Profit", val: `${profitMargin.toFixed(1)}%`, color: marginColor },
                          { label: "Profit / Botol", val: `Rp ${fmt(profitPerBotol)}`, color: profitColor },
                          { label: "Total Profit", val: `Rp ${fmt(totalProfit)}`, color: profitColor },
                          { label: `BEP (${unitLabel})`, val: bep > 0 ? fmt(bep) : "—", color: "var(--color-text-primary)" },
                        ].map((m, i) => (
                          <div key={i} style={mc}>
                            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500, textTransform: "uppercase", letterSpacing: ".05em" }}>{m.label}</div>
                            <div style={{ fontSize: 17, fontWeight: 700, color: m.color, marginTop: 2 }}>{m.val}</div>
                          </div>
                        ))}
                      </div>

                      <div style={card}>
                        <span style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 12 }}>Komposisi Harga per {unitLabel}</span>
                        {[
                          { label: "HPP Bahan Baku", val: hppBahanPerUnit, color: "#d4a017", pct: hargaEff > 0 ? (hppBahanPerUnit / hargaEff) * 100 : 0 },
                          { label: "Biaya Pengemasan", val: totalBiayaKemasan, color: ACC_MID, pct: hargaEff > 0 ? (totalBiayaKemasan / hargaEff) * 100 : 0 },
                          { label: "Profit", val: profitPerUnit, color: ACC, pct: hargaEff > 0 ? (profitPerUnit / hargaEff) * 100 : 0 },
                        ].map((item, i) => (
                          <div key={i} style={{ marginBottom: 10 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                              <span style={{ color: "var(--color-text-secondary)" }}>{item.label}</span>
                              <span style={{ fontWeight: 600 }}>
                                Rp {fmt(item.val)} ({item.pct.toFixed(1)}%)
                              </span>
                            </div>
                            <div style={pbar}>
                              <div style={pfill(item.pct, item.color)}></div>
                            </div>
                          </div>
                        ))}
                        <div style={divider} />
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, alignItems: "center" }}>
                          <span style={{ color: "var(--color-text-secondary)" }}>Status margin:</span>
                          <span style={badge(profitMargin >= 30 ? "acc" : profitMargin >= 10 ? "yellow" : "red")}>{profitMargin >= 30 ? "✓ Sangat Baik (≥30%)" : profitMargin >= 10 ? "◐ Cukup (10–30%)" : "✕ Kurang (<10%)"}</span>
                        </div>
                        {bep > 0 && (
                          <div style={{ marginTop: 8, fontSize: 12, color: ACC_DARK, background: ACC_LIGHT, borderRadius: 8, padding: "8px 12px" }}>
                            💡 BEP tercapai setelah menjual{" "}
                            <strong>
                              {fmt(bep)} {unitLabel}
                            </strong>{" "}
                            = {fmt(bep * botolPerUnit)} botol
                          </div>
                        )}
                      </div>

                      <div style={card}>
                        <span style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 10 }}>Proyeksi Penjualan</span>
                        <div style={{ overflowX: "auto" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                              <tr>
                                {[`Skenario`, `${unitLabel} Terjual`, "Botol", "Revenue", "HPP Total", "Profit Bersih"].map((h, i) => (
                                  <th key={i} style={{ ...TH, textAlign: i === 0 ? "left" : "right" }}>
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {[0.25, 0.5, 0.75, 1.0].map((pct, i) => {
                                const qty = Math.round(jumlahUnit * pct),
                                  btl = qty * botolPerUnit;
                                const rev = qty * hargaEff,
                                  hpp = qty * hppTotalPerUnit,
                                  prf = rev - hpp;
                                return (
                                  <tr key={i} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)", background: pct === 1 ? ACC_LIGHT : "transparent" }}>
                                    <td style={{ ...TD, fontWeight: pct === 1 ? 600 : 400 }}>{pct * 100}% terjual</td>
                                    <td style={{ ...TD, textAlign: "right" }}>{fmt(qty)}</td>
                                    <td style={{ ...TD, textAlign: "right", color: "var(--color-text-secondary)" }}>{fmt(btl)}</td>
                                    <td style={{ ...TD, textAlign: "right" }}>Rp {fmt(rev)}</td>
                                    <td style={{ ...TD, textAlign: "right", color: "var(--color-text-secondary)" }}>Rp {fmt(hpp)}</td>
                                    <td style={{ ...TD, textAlign: "right", fontWeight: 600, color: prf >= 0 ? ACC : "#e63946" }}>Rp {fmt(prf)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div style={card}>
                        <span style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 8 }}>Rincian Per Botol</span>
                        {[
                          { label: "Harga jual per botol", val: `Rp ${fmt(hargaJual / botolPerUnit)}` },
                          { label: `Diskon per botol (${diskonPctEff.toFixed(1)}%)`, val: `− Rp ${fmt(diskonNomEff / botolPerUnit)}` },
                          { label: "Harga efektif per botol", val: `Rp ${fmt(hargaEff / botolPerUnit)}`, bold: true },
                          { label: "HPP bahan per botol", val: `− Rp ${fmt(hppBahanPerBotol)}` },
                          { label: "HPP pengemasan per botol", val: `− Rp ${fmt(totalBiayaKemasan / botolPerUnit)}` },
                          { label: "Profit per botol", val: `Rp ${fmt(profitPerBotol)}`, bold: true, color: profitPerBotol >= 0 ? ACC : "#e63946" },
                        ].map((item, i) => infoRow(item, i, 5))}
                      </div>
                    </>
                  ) : (
                    <div style={{ ...card, textAlign: "center", padding: "2.5rem", color: "var(--color-text-secondary)" }}>
                      <div style={{ fontSize: 36, marginBottom: 8 }}>💰</div>
                      <div style={{ fontSize: 14 }}>Masukkan harga jual per {unitLabel} untuk melihat analisis profit</div>
                    </div>
                  )}
                </>
              )}

              {/* ══ TAB SUMMARY ══ */}
              {tab === "summary" && (
                <>
                  <div style={card}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <span style={{ fontSize: 16, fontWeight: 700 }}>Ringkasan HPP — {varianLabel}</span>
                        <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
                          Per sekali masak · {jumlahUnit} {unitLabel} ({fmt(totalBotol)} botol)
                        </div>
                      </div>
                      <span style={badge("acc")}>
                        🍶 {jumlahUnit} {unitLabel}
                      </span>
                    </div>
                    <div style={divider} />
                    {[
                      { label: "Total biaya bahan baku", val: `Rp ${fmt(totalBiayaBahan)}` },
                      { label: `HPP bahan per ${unitLabel} (÷${jumlahUnit})`, val: `Rp ${fmt(hppBahanPerUnit)}` },
                      { label: `Biaya pengemasan per ${unitLabel}`, val: `Rp ${fmt(totalBiayaKemasan)}` },
                      { label: `HPP total per ${unitLabel}`, val: `Rp ${fmt(hppTotalPerUnit)}`, bold: true, color: ACC },
                      { label: "HPP total per botol", val: `Rp ${fmt(hppTotalPerBotol)}`, bold: true, color: ACC },
                    ].map((item, i) => infoRow(item, i, 4))}
                  </div>

                  {hargaJual > 0 && (
                    <div style={card}>
                      <span style={{ fontSize: 15, fontWeight: 600, display: "block", marginBottom: 10 }}>Analisis Profit per {unitLabel}</span>
                      {[
                        { label: `Harga jual per ${unitLabel}`, val: `Rp ${fmt(hargaJual)}` },
                        { label: `Diskon (${diskonPctEff.toFixed(1)}%)`, val: `− Rp ${fmt(diskonNomEff)}` },
                        { label: `Harga efektif per ${unitLabel}`, val: `Rp ${fmt(hargaEff)}`, bold: true },
                        { label: `HPP per ${unitLabel}`, val: `− Rp ${fmt(hppTotalPerUnit)}` },
                        { label: `Profit per ${unitLabel}`, val: `Rp ${fmt(profitPerUnit)}`, bold: true, color: profitColor },
                        { label: "Margin profit", val: `${profitMargin.toFixed(1)}%`, bold: true, color: marginColor },
                        { label: `Total revenue (${jumlahUnit} ${unitLabel})`, val: `Rp ${fmt(totalRevenue)}` },
                        { label: "Total profit bersih", val: `Rp ${fmt(totalProfit)}`, bold: true, color: profitColor },
                      ].map((item, i) => infoRow(item, i, 7))}
                    </div>
                  )}

                  <div style={card}>
                    <span style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 10 }}>Rincian Bahan Baku</span>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr>
                          {["Bahan", "Satuan", "Harga", "Jumlah", "Total", "% Bahan"].map((h, i) => (
                            <th key={i} style={{ ...TH, fontSize: 11, textAlign: i > 1 ? "right" : "left" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bahan.map((b) => {
                          const tot = b.harga * b.jumlah,
                            pct = totalBiayaBahan > 0 ? ((tot / totalBiayaBahan) * 100).toFixed(1) : 0;
                          return (
                            <tr key={b.id} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                              <td style={TD}>{b.nama || "—"}</td>
                              <td style={TD}>{b.satuan}</td>
                              <td style={{ ...TD, textAlign: "right" }}>{fmt(b.harga)}</td>
                              <td style={{ ...TD, textAlign: "right" }}>{b.jumlah}</td>
                              <td style={{ ...TD, textAlign: "right", fontWeight: 500 }}>Rp {fmt(tot)}</td>
                              <td style={{ ...TD, textAlign: "right", color: "var(--color-text-secondary)" }}>{pct}%</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div style={card}>
                    <span style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 10 }}>Rincian Biaya Pengemasan per {unitLabel}</span>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr>
                          {["Nama Biaya", "Satuan", "Harga", "Jumlah", "Total"].map((h, i) => (
                            <th key={i} style={{ ...TH, fontSize: 11, textAlign: i > 1 ? "right" : "left" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {kemasan.map((k) => (
                          <tr key={k.id} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
                            <td style={TD}>{k.nama || "—"}</td>
                            <td style={TD}>{k.satuan}</td>
                            <td style={{ ...TD, textAlign: "right" }}>{fmt(k.harga)}</td>
                            <td style={{ ...TD, textAlign: "right" }}>{k.jumlah}</td>
                            <td style={{ ...TD, textAlign: "right", fontWeight: 500 }}>Rp {fmt(k.harga * k.jumlah)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr style={TFOOT_ROW}>
                          <td colSpan={4} style={TFOOT_LABEL}>
                            Total per {unitLabel}
                          </td>
                          <td style={TFOOT_VAL}>Rp {fmt(totalBiayaKemasan)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </>
              )}
            </div>

            <style>{`
        input[type=range]{accent-color:${ACC}}
        input:focus,select:focus{outline:none;border-color:${ACC};box-shadow:0 0 0 2px rgba(224,111,44,0.15)}
        button:hover{opacity:.82}
      `}</style>
          </div>
        </Box>
      </Box>
    </Box>
  );
}
/* ══════════════════════════════════════════════════════
   MODULE-LEVEL COMPONENTS  ← fixes the focus/unmount bug
   Defining these inside App causes React to treat them as
   new component types on every render, unmounting inputs
   and losing focus after every keystroke.
   ══════════════════════════════════════════════════════ */

function TableBahan({ list, onUpdate, onAdd, onRemove }) {
  const total = list.reduce((s, b) => s + b.harga * b.jumlah, 0);
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "30%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "17%" }} />
          <col style={{ width: "8%" }} />
        </colgroup>
        <thead>
          <tr>
            {["Nama Bahan", "Satuan", "Harga Satuan (Rp)", "Jumlah", "Total (Rp)", ""].map((h, i) => (
              <th key={i} style={{ ...TH, textAlign: i >= 2 ? "right" : "left" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((b, idx) => (
            <tr key={b.id} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)", background: idx % 2 ? "var(--color-background-secondary)" : "transparent" }}>
              <td style={TD}>
                <input style={{ ...INPUT_BASE, textAlign: "left" }} value={b.nama} onChange={(e) => onUpdate(b.id, "nama", e.target.value)} placeholder="Nama bahan..." />
              </td>
              <td style={TD}>
                <input style={{ ...INPUT_BASE, textAlign: "center" }} value={b.satuan} onChange={(e) => onUpdate(b.id, "satuan", e.target.value)} />
              </td>
              <td style={TD}>
                <input style={{ ...INPUT_BASE, textAlign: "right" }} type="number" min="0" value={b.harga} onChange={(e) => onUpdate(b.id, "harga", e.target.value)} />
              </td>
              <td style={TD}>
                <input style={{ ...INPUT_BASE, textAlign: "right" }} type="number" min="0" step="0.1" value={b.jumlah} onChange={(e) => onUpdate(b.id, "jumlah", e.target.value)} />
              </td>
              <td style={{ ...TD, textAlign: "right", fontWeight: 500, color: ACC }}>Rp {fmt(b.harga * b.jumlah)}</td>
              <td style={TD}>
                <button style={BTN_DEL} onClick={() => onRemove(b.id)}>
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={TFOOT_ROW}>
            <td colSpan={4} style={TFOOT_LABEL}>
              Total Biaya Bahan Baku
            </td>
            <td style={TFOOT_VAL}>Rp {fmt(total)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <div style={{ marginTop: 6, textAlign: "right" }}>
        <button style={BTN_ACC} onClick={onAdd}>
          + Tambah Baris
        </button>
      </div>
    </div>
  );
}

function TableKemasan({ list, onUpdate, onAdd, onRemove, unitLabel }) {
  const total = list.reduce((s, k) => s + k.harga * k.jumlah, 0);
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "33%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "7%" }} />
        </colgroup>
        <thead>
          <tr>
            {["Nama Biaya", "Satuan", "Harga Satuan", "Jumlah", "Total (Rp)", ""].map((h, i) => (
              <th key={i} style={{ ...TH, textAlign: i >= 2 ? "right" : "left" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((k, idx) => (
            <tr key={k.id} style={{ borderBottom: "0.5px solid var(--color-border-tertiary)", background: idx % 2 ? "var(--color-background-secondary)" : "transparent" }}>
              <td style={TD}>
                <input style={{ ...INPUT_BASE, textAlign: "left" }} value={k.nama} onChange={(e) => onUpdate(k.id, "nama", e.target.value)} placeholder="Nama biaya..." />
              </td>
              <td style={TD}>
                <input style={{ ...INPUT_BASE, textAlign: "center" }} value={k.satuan} onChange={(e) => onUpdate(k.id, "satuan", e.target.value)} />
              </td>
              <td style={TD}>
                <input style={{ ...INPUT_BASE, textAlign: "right" }} type="number" min="0" value={k.harga} onChange={(e) => onUpdate(k.id, "harga", e.target.value)} />
              </td>
              <td style={TD}>
                <input style={{ ...INPUT_BASE, textAlign: "right" }} type="number" min="0" step="1" value={k.jumlah} onChange={(e) => onUpdate(k.id, "jumlah", e.target.value)} />
              </td>
              <td style={{ ...TD, textAlign: "right", fontWeight: 500, color: ACC }}>Rp {fmt(k.harga * k.jumlah)}</td>
              <td style={TD}>
                <button style={BTN_DEL} onClick={() => onRemove(k.id)}>
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={TFOOT_ROW}>
            <td colSpan={4} style={TFOOT_LABEL}>
              Total Pengemasan per {unitLabel}
            </td>
            <td style={TFOOT_VAL}>Rp {fmt(total)}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <div style={{ marginTop: 6, textAlign: "right" }}>
        <button style={BTN_ACC} onClick={onAdd}>
          + Tambah Baris
        </button>
      </div>
    </div>
  );
}

/* ─── main app ───────────────────────────────────────── */
