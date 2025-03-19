import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { setLoading, setOpenFailedLogin } from "../../redux/sidenavReducer";
import { useDispatch } from "react-redux";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const Navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 600px)");

  function login() {
    if ((email !== "") & (password !== "")) {
      dispatch(setLoading());
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          dispatch(setLoading());
          Navigate("/");
        })
        .catch((error) => {
          dispatch(setLoading());
          dispatch(setOpenFailedLogin({ isOpen: true, message: "Email atau password salah !!" }));
          console.log(error);
        });
    }
  }
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100vh" }}>
      <Box sx={{ width: "70%", height: "70%", backgroundColor: "#E06F2C", borderRadius: "24px", boxShadow: "0px 0px 48px -32px rgba(0,0,0,0.75)", display: isMobile ? "block" : "flex" }}>
        <Box sx={{ width: isMobile ? "100%" : "65%", height: isMobile ? "30%" : "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Typography sx={{ fontSize: isMobile ? "32px" : "96px", fontWeight: "700", color: "white", fontFamily: "poppins" }}>ELANG DUA</Typography>
        </Box>
        <Box sx={{ width: isMobile ? "100%" : "35%", height: isMobile ? "70%" : "100%", backgroundColor: "#FFFFFF", borderRadius: isMobile ? "0 0 24px 24px" : "0 24px 24px 0" }}>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: isMobile ? 0 : 16 }}>
            <Typography sx={{ fontFamily: "poppins", fontSize: isMobile ? 0 : "44px", fontWeight: "400", mt: isMobile ? 4 : 0 }}>Login</Typography>
          </Box>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 5 }}>
            <TextField id="standard1" sx={{ width: "75%" }} label="Email" variant="standard" onChange={(e) => setEmail(e.target.value)} />
          </Box>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 5 }}>
            <FormControl sx={{ width: "75%" }} variant="standard">
              <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
              <Input
                onChange={(e) => setPassword(e.target.value)}
                id="standard-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Box>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 8 }}>
            <Button onClick={() => login()} sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, width: "75%", height: "46px", borderRadius: "26px", textTransform: "none" }} variant="contained">
              Login
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
