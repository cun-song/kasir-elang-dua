import { Box, Grid, IconButton, useMediaQuery } from "@mui/material";
import React from "react";
import logo from "../img/logo.png";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SideNav() {
  const navigate = useNavigate();
  const value = useSelector((state) => state.sidenav.value);
  const role = useSelector((state) => state.sidenav.role);
  const style = {
    boxP: {
      backgroundColor: "#FFFFFF",
      width: "5vw",
      height: "100vh",
    },
    boxM: {
      backgroundColor: "#FFFFFF",
      width: "100vw",
      height: "10vh",
      position: "fixed",
      bottom: 0,
      left: 0,
      zIndex: 10,
    },
  };
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <Box sx={isMobile ? style?.boxM : style?.boxP}>
      <Grid sx={{ display: "flex", flexDirection: isMobile ? "row" : "column", alignItems: "center", mt: isMobile ? 0 : 3 }}>
        <Grid sx={{ width: "80%", height: "auto", display: isMobile ? "none" : "block" }}>
          <img
            src={logo}
            alt="logo"
            width={"100%"}
            height={"100%"}
            style={{ objectFit: "contain" }}
            onClick={() => {
              navigate("/");
            }}
          />
        </Grid>
        <Grid
          gap={isMobile ? 0 : 5}
          sx={{ display: "flex", flexDirection: isMobile ? "row" : "column", alignItems: "center", mt: isMobile ? 0 : 5, justifyContent: isMobile ? "space-around" : "center", width: isMobile ? "100vw !important" : "100%" }}
        >
          <IconButton
            sx={{ ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}
            onClick={() => {
              navigate("/");
            }}
          >
            {value === 0 ? <HomeRoundedIcon sx={{ color: "#E06F2C", fontSize: 38 }} /> : <HomeOutlinedIcon sx={{ color: "#666666", fontSize: 38, opacity: 0.4 }} />}
          </IconButton>
          <IconButton
            sx={{ ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" }, display: role === "Super Admin" && !isMobile ? "block" : "none" }}
            onClick={() => {
              navigate("/product");
            }}
          >
            {value === 1 ? <Inventory2RoundedIcon sx={{ color: "#E06F2C", fontSize: 32 }} /> : <Inventory2OutlinedIcon sx={{ color: "#666666", fontSize: 32, opacity: 0.4 }} />}
          </IconButton>
          <IconButton
            sx={{ ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}
            onClick={() => {
              navigate("/customer");
            }}
          >
            {value === 2 ? <PeopleAltRoundedIcon sx={{ color: "#E06F2C", fontSize: 32 }} /> : <PeopleAltOutlinedIcon sx={{ color: "#666666", fontSize: 32, opacity: 0.4 }} />}
          </IconButton>

          <IconButton
            sx={{ ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}
            onClick={() => {
              navigate("/history");
            }}
          >
            {value === 3 ? <ReceiptRoundedIcon sx={{ color: "#E06F2C", fontSize: 32 }} /> : <ReceiptOutlinedIcon sx={{ color: "#666666", fontSize: 32, opacity: 0.4 }} />}
          </IconButton>
          <IconButton
            sx={{ ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" }, display: role === "Super Admin" && !isMobile ? "block" : "none" }}
            onClick={() => {
              navigate("/information");
            }}
          >
            {value === 4 ? <InfoRoundedIcon sx={{ color: "#E06F2C", fontSize: 32 }} /> : <InfoOutlinedIcon sx={{ color: "#666666", fontSize: 32, opacity: 0.4 }} />}
          </IconButton>

          <IconButton
            sx={{ ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}
            onClick={() => {
              navigate("/settings");
            }}
          >
            {value === 5 ? <SettingsRoundedIcon sx={{ color: "#E06F2C", fontSize: 32 }} /> : <SettingsOutlinedIcon sx={{ color: "#666666", fontSize: 32, opacity: 0.4 }} />}
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
}
