import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/useAuth"; // Assume you have a custom hook to get auth status

const ProtectedRoute = () => {
  const { currentUser } = useAuth(); // Use your custom hook to get the current user

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
