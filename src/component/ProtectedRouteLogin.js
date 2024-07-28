import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/useAuth"; // Assume you have a custom hook to get auth status

const ProtectedRouteLogin = () => {
  const { currentUser } = useAuth(); // Use your custom hook to get the current user

  return currentUser ? <Navigate to="/" /> : <Outlet />;
};

export default ProtectedRouteLogin;
