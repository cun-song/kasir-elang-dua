import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box, Dialog, Typography } from "@mui/material";
import Home from "./Home";
import SideNav from "../component/SideNav";
import Product from "./Product";
import Customer from "./Customer";
import History from "./History";
import Settings from "./Settings";
import ProtectedRoute from "../component/ProtectedRoute";
import { AuthProvider } from "../utils/useAuth";
import ProtectedSuperAdmin from "../component/ProtectedSuperAdmin";
import CircularProgress, { circularProgressClasses, CircularProgressProps } from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";

function FacebookCircularProgress(props: CircularProgressProps) {
  return (
    <Box sx={{ position: "relative" }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) => theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
        }}
        size={60}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) => (theme.palette.mode === "light" ? "#1a90ff" : "#308fe8"),
          animationDuration: "550ms",
          position: "absolute",
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: "round",
          },
        }}
        size={60}
        thickness={4}
        {...props}
      />
    </Box>
  );
}

export default function Main() {
  const openLoading = useSelector((state) => state.sidenav.loading);

  return (
    <AuthProvider>
      <SideNav />
      <Box sx={{ backgroundColor: "#F4F4F4", width: "100%", height: "100%", paddingLeft: 6, display: "flex", flexDirection: "column" }}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route element={<ProtectedSuperAdmin />}>
              <Route path="/product" element={<Product />} />
            </Route>
            <Route path="/customer" element={<Customer />} />

            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Box>
      <Dialog
        open={openLoading}
        PaperProps={{
          sx: {
            width: "250px",
            height: "250px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            paddingTop: "30px",
          },
        }}
      >
        <FacebookCircularProgress />

        <Typography sx={{ fontFamily: "poppins", fontSize: "22px", fontWeight: "bold", color: "#12141E" }}>Loading...</Typography>
      </Dialog>
    </AuthProvider>
  );
}
