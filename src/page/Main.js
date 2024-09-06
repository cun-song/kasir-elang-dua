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
import Information from "./Information";

export default function Main() {
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
            <Route path="/information" element={<Information />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Box>
    </AuthProvider>
  );
}
