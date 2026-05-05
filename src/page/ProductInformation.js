// src/page/ProductInformation.jsx
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Box } from "@mui/material";
import NavBar from "../component/NavBar";
import { useDispatch, useSelector } from "react-redux";
import { click, setTitle } from "../redux/sidenavReducer";
import { subscribeProductList, fetchHpp, saveProduksi, saveBahan, saveKemasan, saveHarga, genRowId } from "../redux/action/hppAction";

// ── palette ───────────────────────────────────────────────────────────────────
const ACC = "#e06f2c";
const ACC_DARK = "#b85820";
const ACC_LIGHT = "#fdf0e8";
const ACC_MID = "#f4a46a";

// ── helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("id-ID").format(Math.round(n || 0));
const unitSize = (t) => (t === "lusin" ? 12 : 24);

// ── shared style tokens (module-scope) ────────────────────────────────────────
const TH = {
  fontSize: 11,
  fontWeight: 600,
  color: "var(--color-text-secondary)",
  textTransform: "uppercase",
  letterSpacing: ".05em",
  padding: "7px 8px",
  borderBottom: "0.5px solid var(--color-border-tertiary)",
  background: "var(--color-background-secondary)",
  whiteSpace: "nowrap",
};
const TD = { padding: "5px 6px", verticalAlign: "middle", fontSize: 13 };
const INPUT_BASE = {
  width: "100%",
  padding: "7px 8px",
  borderRadius: 6,
  border: "0.5px solid var(--color-border-tertiary)",
  background: "var(--color-background-primary)",
  color: "var(--color-text-primary)",
  fontSize: 13,
};
const BTN_DEL = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: "0.5px solid var(--color-border-tertiary)",
  background: "transparent",
  color: "var(--color-text-secondary)",
  cursor: "pointer",
  fontSize: 16,
  lineHeight: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const BTN_ADD = {
  padding: "7px 14px",
  borderRadius: 8,
  border: `1px dashed ${ACC_MID}`,
  background: ACC_LIGHT,
  color: ACC_DARK,
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
};
const TFOOT_ROW = { borderTop: `1.5px solid ${ACC_MID}`, background: ACC_LIGHT };
const TFOOT_LABEL = { ...TD, fontWeight: 600, fontSize: 13, paddingLeft: 8, color: ACC_DARK };
const TFOOT_VAL = { ...TD, textAlign: "right", fontWeight: 700, fontSize: 14, color: ACC_DARK };

// ══════════════════════════════════════════════════════════════════════════════
//  MODULE-LEVEL COMPONENTS
//  Didefinisikan di luar komponen utama → tidak unmount saat re-render
//  → fix bug fokus input hilang saat mengetik
// ══════════════════════════════════════════════════════════════════════════════

function TableBahan({ list, onUpdate, onAdd, onRemove }) {
  const total = list.reduce((s, b) => s + (b.harga || 0) * (b.jumlah || 0), 0);
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "30%" }} />
          <col style={{ width: "11%" }} />
          <col style={{ width: "19%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "19%" }} />
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
            <tr
              key={b.rowId}
              style={{
                borderBottom: "0.5px solid var(--color-border-tertiary)",
                background: idx % 2 ? "var(--color-background-secondary)" : "transparent",
              }}
            >
              <td style={TD}>
                <input style={INPUT_BASE} value={b.nama} placeholder="Nama bahan..." onChange={(e) => onUpdate(b.rowId, "nama", e.target.value)} />
              </td>
              <td style={TD}>
                <input style={{ ...INPUT_BASE, textAlign: "center" }} value={b.satuan} onChange={(e) => onUpdate(b.rowId, "satuan", e.target.value)} />
              </td>
              <td style={TD}>
                <input style={{ ...INPUT_BASE, textAlign: "right" }} type="number" min="0" value={b.harga} onChange={(e) => onUpdate(b.rowId, "harga", e.target.value)} />
              </td>
              <td style={TD}>
                <input style={{ ...INPUT_BASE, textAlign: "right" }} type="number" min="0" step="0.1" value={b.jumlah} onChange={(e) => onUpdate(b.rowId, "jumlah", e.target.value)} />
              </td>
              <td style={{ ...TD, textAlign: "right", fontWeight: 500, color: ACC }}>Rp {fmt((b.harga || 0) * (b.jumlah || 0))}</td>
              <td style={TD}>
                <button style={BTN_DEL} onClick={() => onRemove(b.rowId)}>
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={TFOOT_ROW}>
            <td colSpan={4} style={TFOOT_LABEL}>
              Total Bahan Baku
            </td>
            <td style={TFOOT_VAL}>Rp {fmt(total)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
      <div style={{ marginTop: 8, textAlign: "right" }}>
        <button style={BTN_ADD} onClick={onAdd}>
          + Tambah Bahan
        </button>
      </div>
    </div>
  );
}

function TableKemasan({ list, onUpdate, onAdd, onRemove, unitLabel }) {
  const total = list.reduce((s, k) => s + (k.harga || 0) * (k.jumlah || 0), 0);
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
        <colgroup>
          <col style={{ width: "32%" }} />
          <col style={{ width: "11%" }} />
          <col style={{ width: "19%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "17%" }} />
          <col style={{ width: "8%" }} />
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
            <tr
              key={k.rowId}
              style={{
                borderBottom: "0.5px solid var(--color-border-tertiary)",
                background: idx % 2 ? "var(--color-background-secondary)" : "transparent",
              }}
            >
              <td style={TD}>
                <input style={INPUT_BASE} value={k.nama} placeholder="Nama biaya..." onChange={(e) => onUpdate(k.rowId, "nama", e.target.value)} />
              </td>
              <td style={TD}>
                <input style={{ ...INPUT_BASE, textAlign: "center" }} value={k.satuan} onChange={(e) => onUpdate(k.rowId, "satuan", e.target.value)} />
              </td>
              <td style={TD}>
                <input style={{ ...INPUT_BASE, textAlign: "right" }} type="number" min="0" value={k.harga} onChange={(e) => onUpdate(k.rowId, "harga", e.target.value)} />
              </td>
              <td style={TD}>
                <input style={{ ...INPUT_BASE, textAlign: "right" }} type="number" min="0" step="1" value={k.jumlah} onChange={(e) => onUpdate(k.rowId, "jumlah", e.target.value)} />
              </td>
              <td style={{ ...TD, textAlign: "right", fontWeight: 500, color: ACC }}>Rp {fmt((k.harga || 0) * (k.jumlah || 0))}</td>
              <td style={TD}>
                <button style={BTN_DEL} onClick={() => onRemove(k.rowId)}>
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={TFOOT_ROW}>
            <td colSpan={4} style={TFOOT_LABEL}>
              Total Pengemasan / {unitLabel}
            </td>
            <td style={TFOOT_VAL}>Rp {fmt(total)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
      <div style={{ marginTop: 8, textAlign: "right" }}>
        <button style={BTN_ADD} onClick={onAdd}>
          + Tambah Biaya
        </button>
      </div>
    </div>
  );
}

function SaveBtn({ onClick, status, label = "Simpan ke Firebase" }) {
  const m =
    {
      idle: { bg: "transparent", bd: ACC_MID, fg: ACC_DARK, t: `💾 ${label}` },
      saving: { bg: ACC_LIGHT, bd: ACC_MID, fg: ACC_DARK, t: "⏳ Menyimpan..." },
      saved: { bg: "#d8f3dc", bd: "#95d5b2", fg: "#1b4332", t: "✓ Tersimpan" },
      error: { bg: "#ffe0e0", bd: "#fca5a5", fg: "#7f1d1d", t: "✕ Gagal — coba lagi" },
    }[status] || {};
  return (
    <button
      onClick={onClick}
      disabled={status === "saving"}
      style={{
        padding: "9px 20px",
        borderRadius: 9,
        border: `1.5px solid ${m.bd}`,
        background: m.bg,
        color: m.fg,
        fontSize: 13,
        fontWeight: 600,
        cursor: status === "saving" ? "not-allowed" : "pointer",
        transition: "all .25s",
      }}
    >
      {m.t}
    </button>
  );
}

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  const [bg, fg] = type === "success" ? ["#d8f3dc", "#1b4332"] : type === "error" ? ["#ffe0e0", "#7f1d1d"] : [ACC_LIGHT, ACC_DARK];
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: bg,
        color: fg,
        padding: "12px 18px",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 500,
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        zIndex: 9999,
        maxWidth: 340,
      }}
    >
      {msg}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  PRODUCT INFORMATION PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function ProductInformation() {
  const dispatch = useDispatch();

  // ── Redux state ──────────────────────────────────────────────────────────────
  const { productList, hppData, loadingProduct, loadingHpp, saveStatus, openSuccess, openFailed } = useSelector((state) => state.hpp);

  // ── Navbar ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(click(5));
    dispatch(setTitle("Informasi Biaya Produk"));
  }, [dispatch]);

  // ── Subscribe product list on mount ──────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = dispatch(subscribeProductList());
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [dispatch]);

  // ── Selected product ──────────────────────────────────────────────────────────
  const [selectedKey, setSelectedKey] = useState("");
  const selectedProduct = productList.find((p) => p._key === selectedKey);

  // ── Load HPP saat produk berubah ──────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchHpp(selectedKey));
  }, [selectedKey, dispatch]);

  // ── Local edit state (bahan & kemasan)
  //    Dipisah dari Redux agar ketikan per-karakter tidak trigger Redux action.
  //    Redux diupdate hanya saat tombol Save ditekan.
  // ─────────────────────────────────────────────────────────────────────────────
  const [localBahan, setLocalBahan] = useState([]);
  const [localKemasan, setLocalKemasan] = useState([]);
  const [jumlahUnit, setJumlahUnit] = useState(10);
  const [unitType, setUnitType] = useState("lusin");
  const [hargaJual, setHargaJual] = useState(0);
  const [diskonType, setDiskonType] = useState("persen");
  const [diskonPersen, setDiskonPersen] = useState(0);
  const [diskonNominal, setDiskonNominal] = useState(0);
  const [tab, setTab] = useState("hpp");
  const [toast, setToast] = useState(null);

  // sync local state saat hppData berubah (load dari Firebase)
  useEffect(() => {
    setLocalBahan(hppData.bahan || []);
    setLocalKemasan(hppData.kemasan || []);
    setJumlahUnit(hppData.jumlahProduksi ?? 10);
    setUnitType(hppData.unitType ?? "lusin");
    setHargaJual(hppData.hargaJual ?? 0);
    setDiskonType(hppData.diskonType ?? "persen");
    setDiskonPersen(hppData.diskonPersen ?? 0);
    setDiskonNominal(hppData.diskonNominal ?? 0);
  }, [hppData]);

  // toast dari Redux
  useEffect(() => {
    if (openSuccess) setToast({ msg: "✓ Data berhasil disimpan", type: "success" });
  }, [openSuccess]);

  useEffect(() => {
    if (openFailed.isOpen) setToast({ msg: openFailed.message, type: "error" });
  }, [openFailed]);

  // ── Row callbacks (stable) ────────────────────────────────────────────────────
  const handleUpdateBahan = useCallback((rowId, f, v) => setLocalBahan((p) => p.map((b) => (b.rowId === rowId ? { ...b, [f]: f === "nama" || f === "satuan" ? v : parseFloat(v) || 0 } : b))), []);
  const handleAddBahan = useCallback(() => setLocalBahan((p) => [...p, { rowId: genRowId(), nama: "", satuan: "kg", harga: 0, jumlah: 0 }]), []);
  const handleRemoveBahan = useCallback((rowId) => setLocalBahan((p) => (p.length > 1 ? p.filter((b) => b.rowId !== rowId) : p)), []);

  const handleUpdateKemasan = useCallback((rowId, f, v) => setLocalKemasan((p) => p.map((k) => (k.rowId === rowId ? { ...k, [f]: f === "nama" || f === "satuan" ? v : parseFloat(v) || 0 } : k))), []);
  const handleAddKemasan = useCallback(() => setLocalKemasan((p) => [...p, { rowId: genRowId(), nama: "", satuan: "pcs", harga: 0, jumlah: 0 }]), []);
  const handleRemoveKemasan = useCallback((rowId) => setLocalKemasan((p) => (p.length > 1 ? p.filter((k) => k.rowId !== rowId) : p)), []);

  // ── Save handlers ─────────────────────────────────────────────────────────────
  const baseArgs = {
    productKey: selectedKey,
    productId: selectedProduct?.id ?? "",
    productNama: selectedProduct?.label?.trim() ?? "",
    updatedBy: "", // tidak perlu auth di sini, sudah terproteksi di route
  };

  const handleSaveProduksi = () => dispatch(saveProduksi({ ...baseArgs, jumlahProduksi: jumlahUnit, unitType }));
  const handleSaveBahan = () => dispatch(saveBahan({ ...baseArgs, bahan: localBahan }));
  const handleSaveKemasan = () => dispatch(saveKemasan({ ...baseArgs, kemasan: localKemasan }));
  const handleSaveHarga = () => dispatch(saveHarga({ ...baseArgs, hargaJual, diskonType, diskonPersen, diskonNominal }));

  // ── Calculations ──────────────────────────────────────────────────────────────
  const totBahan = useMemo(() => localBahan.reduce((s, b) => s + (b.harga || 0) * (b.jumlah || 0), 0), [localBahan]);
  const totKemasan = useMemo(() => localKemasan.reduce((s, k) => s + (k.harga || 0) * (k.jumlah || 0), 0), [localKemasan]);
  const bpp = unitSize(unitType);
  const totBotol = jumlahUnit * bpp;

  const hppBahanPU = jumlahUnit > 0 ? totBahan / jumlahUnit : 0;
  const hppBahanPB = totBotol > 0 ? totBahan / totBotol : 0;
  const hppTotPU = hppBahanPU + totKemasan;
  const hppTotPB = bpp > 0 ? hppTotPU / bpp : 0;

  const diskonNomEff = diskonType === "persen" ? (hargaJual * diskonPersen) / 100 : diskonNominal;
  const diskonPctEff = hargaJual > 0 ? (diskonNomEff / hargaJual) * 100 : 0;
  const hargaEff = hargaJual - diskonNomEff;
  const profitPU = hargaEff - hppTotPU;
  const profitPB = bpp > 0 ? profitPU / bpp : 0;
  const margin = hargaEff > 0 ? (profitPU / hargaEff) * 100 : 0;
  const totRevenue = hargaEff * jumlahUnit;
  const totProfit = profitPU * jumlahUnit;
  const bep = hppTotPU > 0 && profitPU > 0 ? Math.ceil((hppTotPU * jumlahUnit) / profitPU) : 0;

  const UL = unitType === "lusin" ? "Lusin" : "Dus";
  const pcol = profitPU >= 0 ? ACC : "#e63946";
  const mcol = margin >= 30 ? ACC : margin >= 10 ? "#d4a017" : "#e63946";

  // ── Style helpers ─────────────────────────────────────────────────────────────
  const card = { background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "1rem" };
  const lbl = { fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 5, display: "block" };
  const sel = { padding: "8px 10px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", background: "var(--color-background-primary)", color: "var(--color-text-primary)", fontSize: 14, cursor: "pointer" };
  const inp = { ...INPUT_BASE, textAlign: "left" };
  const mc = { background: "var(--color-background-secondary)", borderRadius: 10, padding: "12px 14px", flex: "1 1 140px", minWidth: 0 };
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
    padding: "2px 10px",
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
    padding: "7px 0",
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
  const metricRow = (items) => (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "1rem" }}>
      {items.map((m, i) => (
        <div key={i} style={{ ...mc, border: m.hi ? `1.5px solid ${ACC_MID}` : "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", fontWeight: 500, textTransform: "uppercase", letterSpacing: ".05em" }}>{m.label}</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: m.hi ? ACC : m.color || "var(--color-text-primary)", marginTop: 2 }}>{m.val}</div>
          {m.sub && <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>{m.sub}</div>}
        </div>
      ))}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ width: "100%", pr: 5 }}>
        <NavBar />
        <Box sx={{ backgroundColor: "white", borderRadius: "10px", p: 4, mt: 4 }}>
          <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
            {/* ── header strip ── */}
            <div style={{ background: `linear-gradient(135deg,${ACC_DARK} 0%,${ACC} 65%,${ACC_MID} 100%)`, padding: "1.25rem 1.5rem 1rem", borderRadius: 10, marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🍶</div>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>Kalkulator HPP Kecap</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.78)", marginTop: 2 }}>Kasir Elang Dua · Harga Pokok Produksi</p>
                </div>
              </div>
            </div>

            {/* ── pilih produk ── */}
            <div style={{ ...card, borderLeft: `3px solid ${ACC}` }}>
              <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 10px" }}>🗂 Pilih Produk</p>
              {loadingProduct ? (
                <div style={{ fontSize: 13, color: "#999" }}>⏳ Memuat daftar produk...</div>
              ) : productList.length === 0 ? (
                <div style={{ fontSize: 13, color: "#999", background: "#f5f5f5", borderRadius: 8, padding: "10px 14px" }}>Tidak ada produk ditemukan di database.</div>
              ) : (
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 280px" }}>
                    <span style={lbl}>Produk Kecap</span>
                    <select style={{ ...sel, width: "100%" }} value={selectedKey} onChange={(e) => setSelectedKey(e.target.value)}>
                      <option value="">— Pilih produk —</option>
                      {productList.map((p) => (
                        <option key={p._key} value={p._key}>
                          [{p.id}] {p.label.trim()} ({p.type})
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedProduct && (
                    <div style={{ flex: "1 1 200px", background: "#f9f9f9", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4 }}>
                        <span style={badge("acc")}>{selectedProduct.id}</span>
                        <span style={badge("yellow")}>{selectedProduct.type}</span>
                        <span style={badge("yellow")}>{selectedProduct.size}</span>
                      </div>
                      <div style={{ color: "#777" }}>
                        Harga kasir: <strong style={{ color: ACC }}>Rp {fmt(selectedProduct.price)}</strong> / {selectedProduct.type}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── belum pilih produk ── */}
            {!selectedKey && (
              <div style={{ ...card, textAlign: "center", padding: "2.5rem", color: "#999" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🍶</div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Pilih produk untuk mulai</div>
                <div style={{ fontSize: 13 }}>Data HPP akan dimuat otomatis dari Firebase</div>
              </div>
            )}

            {/* ── loading hpp ── */}
            {selectedKey && loadingHpp && (
              <div style={{ ...card, textAlign: "center", padding: "2rem", color: "#999" }}>
                <div style={{ fontSize: 14 }}>⏳ Memuat data HPP dari Firebase...</div>
              </div>
            )}

            {/* ══ KONTEN HPP ══ */}
            {selectedKey && !loadingHpp && (
              <>
                {/* tabs */}
                <div style={{ display: "flex", gap: 4, marginBottom: "1rem", flexWrap: "wrap" }}>
                  {[
                    ["hpp", "📦 Bahan Baku & HPP"],
                    ["profit", "💰 Analisis Profit"],
                    ["summary", "📋 Ringkasan"],
                  ].map(([k, l]) => (
                    <button key={k} style={tabBtn(tab === k)} onClick={() => setTab(k)}>
                      {l}
                    </button>
                  ))}
                </div>

                {/* ════ TAB HPP ════ */}
                {tab === "hpp" && (
                  <>
                    {/* info produksi */}
                    <div style={card}>
                      <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>⚙️ Info Produksi</p>
                      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
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
                        <div style={{ fontSize: 12, color: "#777", paddingBottom: 8 }}>
                          = <strong style={{ color: ACC }}>{fmt(totBotol)} botol</strong>
                        </div>
                      </div>
                      <div style={divider} />
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <SaveBtn onClick={handleSaveProduksi} status={saveStatus.produksi} label="Simpan Info Produksi" />
                      </div>
                    </div>

                    {/* bahan baku */}
                    <div style={card}>
                      <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px" }}>
                        🌾 Bahan Baku
                        <span style={{ fontSize: 12, color: "#777", fontWeight: 400, marginLeft: 8 }}>— {selectedProduct?.label?.trim()}</span>
                      </p>
                      {localBahan.length === 0 && (
                        <div style={{ fontSize: 13, color: "#999", background: "#f9f9f9", padding: "10px 12px", borderRadius: 8, marginBottom: 10 }}>
                          Belum ada data bahan baku. Klik <strong>+ Tambah Bahan</strong>.
                        </div>
                      )}
                      <TableBahan list={localBahan} onUpdate={handleUpdateBahan} onAdd={handleAddBahan} onRemove={handleRemoveBahan} />
                      <div style={{ marginTop: 10, fontSize: 12, color: "#777", display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <span>
                          HPP bahan/{UL}: <strong style={{ color: ACC }}>Rp {fmt(hppBahanPU)}</strong>
                        </span>
                        <span>
                          HPP bahan/botol: <strong style={{ color: ACC }}>Rp {fmt(hppBahanPB)}</strong>
                        </span>
                      </div>
                      <div style={divider} />
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <SaveBtn onClick={handleSaveBahan} status={saveStatus.bahan} label="Simpan Bahan Baku" />
                      </div>
                    </div>

                    {/* pengemasan */}
                    <div style={card}>
                      <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px" }}>
                        📦 Biaya Pengemasan
                        <span style={{ fontSize: 12, color: "#777", fontWeight: 400, marginLeft: 8 }}>per {UL}</span>
                      </p>
                      {localKemasan.length === 0 && (
                        <div style={{ fontSize: 13, color: "#999", background: "#f9f9f9", padding: "10px 12px", borderRadius: 8, marginBottom: 10 }}>
                          Belum ada data pengemasan. Klik <strong>+ Tambah Biaya</strong>.
                        </div>
                      )}
                      <TableKemasan list={localKemasan} onUpdate={handleUpdateKemasan} onAdd={handleAddKemasan} onRemove={handleRemoveKemasan} unitLabel={UL} />
                      <div style={{ marginTop: 8, fontSize: 12, color: "#777" }}>
                        Pengemasan/botol: <strong style={{ color: ACC }}>Rp {fmt(totKemasan / bpp)}</strong>
                      </div>
                      <div style={divider} />
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <SaveBtn onClick={handleSaveKemasan} status={saveStatus.kemasan} label="Simpan Pengemasan" />
                      </div>
                    </div>

                    {/* metric cards */}
                    {metricRow([
                      { label: "Total Bahan Baku", val: `Rp ${fmt(totBahan)}`, sub: "Per sekali masak" },
                      { label: `Pengemasan/${UL}`, val: `Rp ${fmt(totKemasan)}`, sub: `${bpp} botol` },
                      { label: `HPP / ${UL}`, val: `Rp ${fmt(hppTotPU)}`, sub: "Bahan ÷ produksi + kemasan", hi: true },
                      { label: "HPP / Botol", val: `Rp ${fmt(hppTotPB)}`, sub: "Per satuan botol", hi: true },
                    ])}

                    {/* formula */}
                    <div style={{ ...card, background: ACC_LIGHT, border: `0.5px solid ${ACC_MID}` }}>
                      <div style={{ fontSize: 12, color: ACC_DARK, lineHeight: 1.85 }}>
                        <strong>📐 Formula HPP per {UL}:</strong>
                        <br />= (Total Bahan Baku ÷ Jumlah Produksi) + Total Pengemasan per {UL}
                        <br />= (Rp {fmt(totBahan)} ÷ {jumlahUnit}) + Rp {fmt(totKemasan)} = <strong>Rp {fmt(hppTotPU)}</strong>
                      </div>
                    </div>
                  </>
                )}

                {/* ════ TAB PROFIT ════ */}
                {tab === "profit" && (
                  <>
                    <div style={card}>
                      <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>💰 Penetapan Harga Jual</p>
                      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 200px" }}>
                          <span style={lbl}>Harga Jual per {UL} (Rp)</span>
                          <input type="number" min="0" value={hargaJual || ""} onChange={(e) => setHargaJual(Number(e.target.value))} style={inp} placeholder={`Harga per ${UL}...`} />
                          {hargaJual > 0 && (
                            <div style={{ fontSize: 11, color: "#777", marginTop: 3 }}>
                              ≈ Rp {fmt(hargaJual / bpp)} / botol
                              {selectedProduct?.price && (
                                <span style={{ marginLeft: 8, color: ACC_DARK }}>
                                  | Harga kasir: Rp {fmt(selectedProduct.price)}/{selectedProduct.type}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div style={{ flex: "1 1 260px" }}>
                          <span style={lbl}>Diskon</span>
                          <div style={{ display: "flex", border: "0.5px solid #ddd", borderRadius: 8, overflow: "hidden", width: "fit-content", marginBottom: 8 }}>
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
                              <span style={{ fontSize: 13, color: "#777", flexShrink: 0 }}>%</span>
                            </div>
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 13, color: "#777", flexShrink: 0 }}>Rp</span>
                              <input type="number" min="0" value={diskonNominal || ""} onChange={(e) => setDiskonNominal(Number(e.target.value))} style={{ ...INPUT_BASE, flex: 1, textAlign: "right" }} placeholder="0" />
                              <span style={{ fontSize: 12, color: "#777", flexShrink: 0 }}>/{UL}</span>
                            </div>
                          )}
                          {hargaJual > 0 && (
                            <div style={{ fontSize: 11, color: "#777", marginTop: 6, background: ACC_LIGHT, padding: "6px 10px", borderRadius: 6 }}>
                              Diskon: Rp {fmt(diskonNomEff)} ({diskonPctEff.toFixed(1)}%) → Efektif:{" "}
                              <strong style={{ color: ACC }}>
                                Rp {fmt(hargaEff)}/{UL}
                              </strong>
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={divider} />
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <SaveBtn onClick={handleSaveHarga} status={saveStatus.harga} label="Simpan Harga Jual" />
                      </div>
                    </div>

                    {hargaJual > 0 ? (
                      <>
                        {metricRow([
                          { label: `Profit/${UL}`, val: `Rp ${fmt(profitPU)}`, color: pcol },
                          { label: "Margin Profit", val: `${margin.toFixed(1)}%`, color: mcol },
                          { label: "Profit/Botol", val: `Rp ${fmt(profitPB)}`, color: pcol },
                          { label: "Total Profit", val: `Rp ${fmt(totProfit)}`, color: pcol },
                          { label: `BEP (${UL})`, val: bep > 0 ? fmt(bep) : "—" },
                        ])}

                        {/* komposisi */}
                        <div style={card}>
                          <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>Komposisi Harga per {UL}</p>
                          {[
                            { label: "HPP Bahan Baku", val: hppBahanPU, color: "#d4a017", pct: hargaEff > 0 ? (hppBahanPU / hargaEff) * 100 : 0 },
                            { label: "Biaya Pengemasan", val: totKemasan, color: ACC_MID, pct: hargaEff > 0 ? (totKemasan / hargaEff) * 100 : 0 },
                            { label: "Profit", val: profitPU, color: ACC, pct: hargaEff > 0 ? (profitPU / hargaEff) * 100 : 0 },
                          ].map((item, i) => (
                            <div key={i} style={{ marginBottom: 10 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                                <span style={{ color: "#777" }}>{item.label}</span>
                                <span style={{ fontWeight: 600 }}>
                                  Rp {fmt(item.val)} ({item.pct.toFixed(1)}%)
                                </span>
                              </div>
                              <div style={pbar}>
                                <div style={pfill(item.pct, item.color)} />
                              </div>
                            </div>
                          ))}
                          <div style={divider} />
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, alignItems: "center" }}>
                            <span style={{ color: "#777" }}>Status margin:</span>
                            <span style={badge(margin >= 30 ? "acc" : margin >= 10 ? "yellow" : "red")}>{margin >= 30 ? "✓ Sangat Baik (≥30%)" : margin >= 10 ? "◐ Cukup (10–30%)" : "✕ Kurang (<10%)"}</span>
                          </div>
                          {bep > 0 && (
                            <div style={{ marginTop: 8, fontSize: 12, color: ACC_DARK, background: ACC_LIGHT, borderRadius: 8, padding: "8px 12px" }}>
                              💡 BEP:{" "}
                              <strong>
                                {fmt(bep)} {UL}
                              </strong>{" "}
                              = {fmt(bep * bpp)} botol
                            </div>
                          )}
                        </div>

                        {/* proyeksi */}
                        <div style={card}>
                          <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 10px" }}>Proyeksi Penjualan</p>
                          <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                              <thead>
                                <tr>
                                  {["Skenario", UL, "Botol", "Revenue", "HPP Total", "Profit Bersih"].map((h, i) => (
                                    <th key={i} style={{ ...TH, textAlign: i === 0 ? "left" : "right" }}>
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {[0.25, 0.5, 0.75, 1.0].map((pct, i) => {
                                  const q = Math.round(jumlahUnit * pct),
                                    b = q * bpp;
                                  const rv = q * hargaEff,
                                    hp = q * hppTotPU,
                                    pr = rv - hp;
                                  return (
                                    <tr key={i} style={{ borderBottom: "0.5px solid #eee", background: pct === 1 ? ACC_LIGHT : "transparent" }}>
                                      <td style={{ ...TD, fontWeight: pct === 1 ? 600 : 400 }}>{pct * 100}% terjual</td>
                                      <td style={{ ...TD, textAlign: "right" }}>{fmt(q)}</td>
                                      <td style={{ ...TD, textAlign: "right", color: "#777" }}>{fmt(b)}</td>
                                      <td style={{ ...TD, textAlign: "right" }}>Rp {fmt(rv)}</td>
                                      <td style={{ ...TD, textAlign: "right", color: "#777" }}>Rp {fmt(hp)}</td>
                                      <td style={{ ...TD, textAlign: "right", fontWeight: 600, color: pr >= 0 ? ACC : "#e63946" }}>Rp {fmt(pr)}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* per botol */}
                        <div style={card}>
                          <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 8px" }}>Rincian Per Botol</p>
                          {[
                            { label: "Harga jual/botol", val: `Rp ${fmt(hargaJual / bpp)}` },
                            { label: `Diskon (${diskonPctEff.toFixed(1)}%)`, val: `− Rp ${fmt(diskonNomEff / bpp)}` },
                            { label: "Harga efektif/botol", val: `Rp ${fmt(hargaEff / bpp)}`, bold: true },
                            { label: "HPP bahan/botol", val: `− Rp ${fmt(hppBahanPB)}` },
                            { label: "HPP pengemasan/botol", val: `− Rp ${fmt(totKemasan / bpp)}` },
                            { label: "Profit/botol", val: `Rp ${fmt(profitPB)}`, bold: true, color: profitPB >= 0 ? ACC : "#e63946" },
                          ].map((item, i) => infoRow(item, i, 5))}
                        </div>
                      </>
                    ) : (
                      <div style={{ ...card, textAlign: "center", padding: "2.5rem", color: "#999" }}>
                        <div style={{ fontSize: 36, marginBottom: 8 }}>💰</div>
                        <div style={{ fontSize: 14 }}>Masukkan harga jual per {UL} di atas</div>
                      </div>
                    )}
                  </>
                )}

                {/* ════ TAB SUMMARY ════ */}
                {tab === "summary" && (
                  <>
                    <div style={card}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <p style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{selectedProduct?.label?.trim()}</p>
                          <div style={{ fontSize: 12, color: "#777", marginTop: 4 }}>
                            {jumlahUnit} {UL} · {fmt(totBotol)} botol · ID: <code style={{ fontSize: 11 }}>{selectedProduct?.id}</code>
                          </div>
                          <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                            <span style={badge("acc")}>{selectedProduct?.type}</span>
                            <span style={badge("yellow")}>{selectedProduct?.size}</span>
                            <span style={badge("yellow")}>
                              Harga kasir: Rp {fmt(selectedProduct?.price)}/{selectedProduct?.type}
                            </span>
                          </div>
                        </div>
                        <span style={badge("acc")}>
                          🍶 {jumlahUnit} {UL}
                        </span>
                      </div>
                      <div style={divider} />
                      {[
                        { label: "Total bahan baku", val: `Rp ${fmt(totBahan)}` },
                        { label: `HPP bahan/${UL} (÷${jumlahUnit})`, val: `Rp ${fmt(hppBahanPU)}` },
                        { label: `Biaya pengemasan/${UL}`, val: `Rp ${fmt(totKemasan)}` },
                        { label: `HPP total/${UL}`, val: `Rp ${fmt(hppTotPU)}`, bold: true, color: ACC },
                        { label: "HPP total/botol", val: `Rp ${fmt(hppTotPB)}`, bold: true, color: ACC },
                      ].map((item, i) => infoRow(item, i, 4))}
                    </div>

                    {hargaJual > 0 && (
                      <div style={card}>
                        <p style={{ fontSize: 15, fontWeight: 600, margin: "0 0 10px" }}>Analisis Profit per {UL}</p>
                        {[
                          { label: `Harga jual/${UL}`, val: `Rp ${fmt(hargaJual)}` },
                          { label: `Diskon (${diskonPctEff.toFixed(1)}%)`, val: `− Rp ${fmt(diskonNomEff)}` },
                          { label: `Harga efektif/${UL}`, val: `Rp ${fmt(hargaEff)}`, bold: true },
                          { label: `HPP/${UL}`, val: `− Rp ${fmt(hppTotPU)}` },
                          { label: `Profit/${UL}`, val: `Rp ${fmt(profitPU)}`, bold: true, color: pcol },
                          { label: "Margin profit", val: `${margin.toFixed(1)}%`, bold: true, color: mcol },
                          { label: "Total revenue", val: `Rp ${fmt(totRevenue)}` },
                          { label: "Total profit bersih", val: `Rp ${fmt(totProfit)}`, bold: true, color: pcol },
                        ].map((item, i) => infoRow(item, i, 7))}
                      </div>
                    )}

                    {/* detail bahan */}
                    <div style={card}>
                      <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 10px" }}>Rincian Bahan Baku</p>
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
                          {localBahan.map((b) => {
                            const tot = (b.harga || 0) * (b.jumlah || 0);
                            const pct = totBahan > 0 ? ((tot / totBahan) * 100).toFixed(1) : 0;
                            return (
                              <tr key={b.rowId} style={{ borderBottom: "0.5px solid #eee" }}>
                                <td style={TD}>{b.nama || "—"}</td>
                                <td style={TD}>{b.satuan}</td>
                                <td style={{ ...TD, textAlign: "right" }}>{fmt(b.harga)}</td>
                                <td style={{ ...TD, textAlign: "right" }}>{b.jumlah}</td>
                                <td style={{ ...TD, textAlign: "right", fontWeight: 500 }}>Rp {fmt(tot)}</td>
                                <td style={{ ...TD, textAlign: "right", color: "#777" }}>{pct}%</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* detail kemasan */}
                    <div style={card}>
                      <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 10px" }}>Rincian Pengemasan per {UL}</p>
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
                          {localKemasan.map((k) => (
                            <tr key={k.rowId} style={{ borderBottom: "0.5px solid #eee" }}>
                              <td style={TD}>{k.nama || "—"}</td>
                              <td style={TD}>{k.satuan}</td>
                              <td style={{ ...TD, textAlign: "right" }}>{fmt(k.harga)}</td>
                              <td style={{ ...TD, textAlign: "right" }}>{k.jumlah}</td>
                              <td style={{ ...TD, textAlign: "right", fontWeight: 500 }}>Rp {fmt((k.harga || 0) * (k.jumlah || 0))}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr style={TFOOT_ROW}>
                            <td colSpan={4} style={TFOOT_LABEL}>
                              Total / {UL}
                            </td>
                            <td style={TFOOT_VAL}>Rp {fmt(totKemasan)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </Box>
      </Box>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <style>{`
        input[type=range] { accent-color: ${ACC} }
        input:focus, select:focus {
          outline: none;
          border-color: ${ACC};
          box-shadow: 0 0 0 2px rgba(224,111,44,0.15);
        }
        button:hover:not(:disabled) { opacity: .85 }
        code { font-family: monospace; background: #f3f3f3; padding: 1px 5px; border-radius: 4px; }
      `}</style>
    </Box>
  );
}
