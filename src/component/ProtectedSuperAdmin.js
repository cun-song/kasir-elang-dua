import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/useAuth"; // Assume you have a custom hook to get auth status
import { useSelector } from "react-redux";

const ProtectedSuperAdmin = () => {
  const role = useSelector((state) => state.sidenav.role);
  return role === "Super Admin" ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedSuperAdmin;
