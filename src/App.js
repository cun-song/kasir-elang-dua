import "./App.css";
import Main from "./page/Main";
import Login from "./component/auth/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import ProtectedRouteLogin from "./component/ProtectedRouteLogin";
import { AuthProvider } from "./utils/useAuth";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Box sx={{ backgroundColor: "#F4F4F4", width: "100vw", height: "100vh" }} display={"flex"}>
          <Routes>
            <Route path="*" element={<Main />} />
            <Route element={<ProtectedRouteLogin />}>
              <Route path="/login" element={<Login />} />
            </Route>
          </Routes>
        </Box>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
