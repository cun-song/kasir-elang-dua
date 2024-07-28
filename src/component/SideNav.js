import { Box, Grid, IconButton } from "@mui/material";
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
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function SideNav() {
  const navigate = useNavigate();
  const value = useSelector((state) => state.sidenav.value);
  const role = useSelector((state) => state.sidenav.role);

  return (
    <Box sx={{ backgroundColor: "#FFFFFF", width: "5vw", height: "100vh" }}>
      <Grid sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 3 }}>
        <Grid sx={{ width: "80%", height: "auto" }}>
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
        <Grid gap={5} sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 5 }}>
          <IconButton
            sx={{ ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}
            onClick={() => {
              navigate("/");
            }}
          >
            {value === 0 ? <HomeRoundedIcon sx={{ color: "#E06F2C", fontSize: 38 }} /> : <HomeOutlinedIcon sx={{ color: "#666666", fontSize: 38, opacity: 0.4 }} />}
          </IconButton>
          <IconButton
            sx={{ ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" }, display: role === "Super Admin" ? "block" : "none" }}
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
            sx={{ ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}
            onClick={() => {
              navigate("/settings");
            }}
          >
            {value === 4 ? <SettingsRoundedIcon sx={{ color: "#E06F2C", fontSize: 32 }} /> : <SettingsOutlinedIcon sx={{ color: "#666666", fontSize: 32, opacity: 0.4 }} />}
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
}