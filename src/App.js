import "./App.css";
import Main from "./page/Main";
import Login from "./component/auth/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRouteLogin from "./component/ProtectedRouteLogin";
import { AuthProvider } from "./utils/useAuth";
import { Box, Dialog, Typography } from "@mui/material";
import CircularProgress, { circularProgressClasses, CircularProgressProps } from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import DialogFailed from "./component/DialogFailed";
import { setOpenFailedLogin } from "./redux/sidenavReducer";

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
function App() {
  const openLoading = useSelector((state) => state.sidenav.loading);
  const failedLogin = useSelector((state) => state.sidenav.openFailedLogin);
  const dispatch = useDispatch();

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
      <DialogFailed open={failedLogin?.isOpen} handleToggle={() => dispatch(setOpenFailedLogin({ isOpen: false, message: "" }))} message={failedLogin?.message} />
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
    </BrowserRouter>
  );
}

export default App;
