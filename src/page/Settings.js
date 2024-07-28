import React from "react";
import { Box, Button } from "@mui/material";
import NavBar from "../component/NavBar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { click, setTitle } from "../redux/sidenavReducer";
import { signout } from "../utils/Authentication";

export default function Settings() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(click(4));
    dispatch(setTitle("Pengaturan"));
  }, []);

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ width: "100%", pr: 5 }}>
        <NavBar />
        <Button onClick={() => signout()} sx={{ mt: 5, mb: 5 }} variant="contained">
          Log out
        </Button>
      </Box>
      <Box sx={{ backgroundColor: "#FFFFFF", width: "30%", height: "100%" }}></Box>
    </Box>
  );
}
