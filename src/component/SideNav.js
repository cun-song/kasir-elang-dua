import { Box, useMediaQuery, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Collapse, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import logo from "../img/logo.png";

// Penjualan
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import KeyboardReturnOutlinedIcon from "@mui/icons-material/KeyboardReturnOutlined";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";

// Pembelian
import LocalMallIcon from '@mui/icons-material/LocalMall';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";

// Master Data
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import BadgeIcon from "@mui/icons-material/Badge";

// Laporan
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

// Pengaturan & Home & utilitas
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { click, setTitle } from "../redux/sidenavReducer"; // sesuaikan path/nama action sesuai struktur Redux Anda

const COLLAPSED_WIDTH = 76;
const EXPANDED_WIDTH = 268;

// ====== KONFIGURASI MENU ======
// path: null => fitur belum tersedia (disabled, badge "Soon")
const MENU_GROUPS = [
  {
    label: "Penjualan",
    items: [
      { id: 0, label: "Transaksi Penjualan", path: "/", icon: ShoppingCartOutlinedIcon, iconActive: ShoppingCartIcon },
      { id: 3, label: "Data Penjualan", path: "/history", icon: ReceiptOutlinedIcon, iconActive: ReceiptRoundedIcon },
      { id: 10, label: "Returan", path: "/returan", icon: KeyboardReturnOutlinedIcon, iconActive: KeyboardReturnIcon },
      { id: 11, label: "Titip Bon", path: "/titip-bon", icon: StickyNote2OutlinedIcon, iconActive: StickyNote2Icon },
      { id: 12, label: "Piutang", path: null, icon: RequestQuoteOutlinedIcon, iconActive: RequestQuoteIcon },
    ],
  },
  {
    label: "Pembelian",
    items: [
      { id: 13, label: "Transaksi Pembelian", path: null, icon: LocalMallOutlinedIcon, iconActive: LocalMallIcon },
      { id: 14, label: "Data Pembelian", path: null, icon: ReceiptOutlinedIcon, iconActive: ReceiptRoundedIcon },
    ],
  },
  {
    label: "Master Data",
    superAdminOnly: true,
    items: [
      { id: 1, label: "Produk", path: "/product", icon: Inventory2OutlinedIcon, iconActive: Inventory2RoundedIcon },
      { id: 2, label: "Customer", path: "/customer", icon: PeopleAltOutlinedIcon, iconActive: PeopleAltRoundedIcon, superAdminOnly: false },
      { id: 5, label: "HPP Produk", path: "/product-information", icon: AssignmentOutlinedIcon, iconActive: AssignmentIcon },
      { id: 15, label: "Karyawan", path: null, icon: BadgeOutlinedIcon, iconActive: BadgeIcon },
    ],
  },
  {
    label: "Laporan",
    superAdminOnly: true,
    items: [
      { id: 16, label: "Arus Kas", path: null, icon: AccountBalanceWalletOutlinedIcon, iconActive: AccountBalanceWalletIcon },
      { id: 4, label: "Laporan Kinerja", path: "/information", icon: InfoOutlinedIcon, iconActive: InfoRoundedIcon },
    ],
  },
];

const SETTINGS_ITEM = { id: 6, label: "Pengaturan", path: "/settings", icon: SettingsOutlinedIcon, iconActive: SettingsRoundedIcon };

// Daftar flat semua item (termasuk Pengaturan) untuk mencocokkan path -> {id, label}.
// Dipakai untuk sinkronisasi value & title dari URL saat refresh/reload halaman.
const ALL_ITEMS = [...MENU_GROUPS.flatMap((g) => g.items), SETTINGS_ITEM];

export default function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const value = useSelector((state) => state.sidenav.value);
  const role = useSelector((state) => state.sidenav.role);

  const isMobile = useMediaQuery("(max-width: 600px)");
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sinkronkan value & title Redux berdasarkan URL aktif.
  // Diperlukan karena Redux reset ke initial state setiap kali halaman di-refresh,
  // sehingga title/highlight menu tidak bisa hanya mengandalkan dispatch saat klik.
  useEffect(() => {
    const matched = ALL_ITEMS.find((item) => item.path === location.pathname);
    if (matched) {
      dispatch(click(matched.id));
      dispatch(setTitle(matched.label));
    }
  }, [location.pathname]);

  const handleNavigate = (item) => {
    if (!item.path) return; // fitur belum tersedia, tidak melakukan apa-apa
    dispatch(click(item.id));
    dispatch(setTitle(item.label));
    navigate(item.path);
    if (isMobile) setMobileOpen(false);
  };

  const renderItem = (item, showLabel) => {
    const isActive = value === item.id;
    const isDisabled = !item.path;
    const Icon = isActive ? item.iconActive : item.icon;

    return (
      <ListItemButton
        key={item.id}
        disabled={isDisabled}
        onClick={() => handleNavigate(item)}
        sx={{
          borderRadius: "10px",
          mx: 1,
          mb: 0.5,
          py: 1,
          minHeight: 44,
          opacity: isDisabled ? 0.5 : 1,
          "&:hover": {
            backgroundColor: isDisabled ? "transparent" : "rgba(224,111,44,0.08)",
          },
          backgroundColor: isActive ? "rgba(224,111,44,0.12)" : "transparent",
        }}
      >
        <ListItemIcon sx={{ minWidth: 0, mr: showLabel ? 2 : 0, justifyContent: "center" }}>
          <Icon sx={{ color: isActive ? "#E06F2C" : "#666666", fontSize: 26 }} />
        </ListItemIcon>
        <Collapse in={showLabel} orientation="horizontal" sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", whiteSpace: "nowrap" }}>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "#E06F2C" : "#333333",
                noWrap: true,
              }}
            />
            {isDisabled && (
              <Box
                sx={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#854F0B",
                  backgroundColor: "#FAEEDA",
                  px: 0.8,
                  py: 0.1,
                  borderRadius: "8px",
                  ml: 1,
                  whiteSpace: "nowrap",
                }}
              >
                Soon
              </Box>
            )}
          </Box>
        </Collapse>
      </ListItemButton>
    );
  };

  const getFirstVisibleGroupLabel = () => {
    const firstVisible = MENU_GROUPS.find((g) =>
      g.items.some((item) => {
        const itemRestricted = item.superAdminOnly ?? g.superAdminOnly;
        return !itemRestricted || role === "Super Admin";
      })
    );
    return firstVisible?.label;
  };
  const firstVisibleGroupLabel = getFirstVisibleGroupLabel();

  const renderGroup = (group, showLabel, isFirst) => {
    const visibleItems = group.items.filter((item) => {
      const itemRestricted = item.superAdminOnly ?? group.superAdminOnly;
      return !itemRestricted || role === "Super Admin";
    });
    if (visibleItems.length === 0) return null;
    return (
      <Box key={group.label} sx={{ mb: 1 }}>
        <Collapse in={showLabel}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 0.5,
              color: "#A0A0A0",
              textTransform: "uppercase",
              px: 2.2,
              pt: 1.5,
              pb: 0.5,
              whiteSpace: "nowrap",
            }}
          >
            {group.label}
          </Typography>
        </Collapse>
        {!showLabel && !isFirst && <Divider sx={{ mx: 2, my: 1 }} />}
        {visibleItems.map((item) => renderItem(item, showLabel))}
      </Box>
    );
  };

  // ====== MOBILE: bottom nav (item utama) + tombol menu yang membuka drawer penuh ======
  if (isMobile) {
    const mainMobileItems = [
      MENU_GROUPS[0].items[0], // Transaksi Penjualan
      MENU_GROUPS[0].items[1], // Data Penjualan
      MENU_GROUPS[2].items[0], // Produk
      MENU_GROUPS[2].items[1], // Customer
    ];

    return (
      <>
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            width: "100vw",
            height: "9vh",
            position: "fixed",
            bottom: 0,
            left: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            borderTop: "0.5px solid #eee",
          }}
        >
          {mainMobileItems.map((item) => {
            const isActive = value === item.id;
            const Icon = isActive ? item.iconActive : item.icon;
            return (
              <IconButton key={item.id} onClick={() => handleNavigate(item)} sx={{ ":hover": { backgroundColor: "transparent" } }}>
                <Icon sx={{ color: isActive ? "#E06F2C" : "#666666", fontSize: 28, opacity: isActive ? 1 : 0.5 }} />
              </IconButton>
            );
          })}
          <IconButton onClick={() => setMobileOpen(true)} sx={{ ":hover": { backgroundColor: "transparent" } }}>
            <MenuOutlinedIcon sx={{ color: "#666666", fontSize: 28, opacity: 0.6 }} />
          </IconButton>
        </Box>

        <Drawer
          anchor="bottom"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: "80vh" } }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, py: 1.5 }}>
            <Typography sx={{ fontWeight: 600, fontSize: 16 }}>Menu</Typography>
            <IconButton onClick={() => setMobileOpen(false)}>
              <CloseOutlinedIcon />
            </IconButton>
          </Box>
          <Divider />
          <List sx={{ overflowY: "auto", py: 1 }}>
            {MENU_GROUPS.map((group) => renderGroup(group, true, group.label === firstVisibleGroupLabel))}
            <Divider sx={{ mx: 2, my: 1 }} />
            {renderItem(SETTINGS_ITEM, true)}
          </List>
        </Drawer>
      </>
    );
  }

  // ====== DESKTOP: sidebar overlay, collapse <-> expand on hover ======
  return (
    <Box
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      sx={{
        position: "fixed", // overlay: tidak mendorong/menggeser konten lain
        top: 0,
        left: 0,
        height: "100vh",
        width: expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
        backgroundColor: "#FFFFFF",
        borderRight: "0.5px solid #eee",
        boxShadow: expanded ? "2px 0 12px rgba(0,0,0,0.08)" : "none",
        transition: "width 0.2s ease, box-shadow 0.2s ease",
        zIndex: 1300,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
      <Box sx={{ display: "flex", alignItems: "center", height: 72, px: 2, flexShrink: 0, cursor: "pointer" }} onClick={() => handleNavigate(MENU_GROUPS[0].items[0])}>
        <img src={logo} alt="logo" style={{ height: 36, width: 36, objectFit: "contain", flexShrink: 0 }} />
        <Collapse in={expanded} orientation="horizontal">
          <Typography sx={{ ml: 1.5, fontWeight: 700, fontSize: 15, color: "#E06F2C", whiteSpace: "nowrap" }}>Elang Dua</Typography>
        </Collapse>
      </Box>

      <Divider />

      {/* Menu list, scrollable jika konten melebihi tinggi viewport */}
      <List sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", pt: 1 }}>
        {MENU_GROUPS.map((group) => renderGroup(group, expanded, group.label === firstVisibleGroupLabel))}
      </List>

      <Divider />

      {/* Pengaturan selalu di bawah */}
      <List sx={{ flexShrink: 0, py: 1 }}>{renderItem(SETTINGS_ITEM, expanded)}</List>
    </Box>
  );
}