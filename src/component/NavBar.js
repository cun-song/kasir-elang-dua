import { Grid, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function NavBar() {
  const title = useSelector((state) => state.sidenav.title);
  const name = useSelector((state) => state.sidenav.name);
  const role = useSelector((state) => state.sidenav.role);
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <Grid sx={{ width: "100%", mt: 3 }} container justifyContent={"space-between"}>
      <Grid item sx={{ display: isMobile ? "none" : "" }}>
        <Typography sx={{ fontFamily: "poppins", fontSize: 28, fontWeight: "bold", color: "#12141E" }}>Perusahaan Kecap Elang Dua</Typography>
        <Typography sx={{ fontFamily: "nunito", fontSize: 16, fontWeight: "semibold", color: "#6D6F75" }}>{title}</Typography>
      </Grid>
      <Grid item sx={{ display: "flex", alignItems: "center" }} gap={1.5}>
        <Grid item>
          <AccountCircleIcon sx={{ width: "50px", height: "50px" }} />
        </Grid>
        <Grid item>
          <Typography sx={{ fontFamily: "poppins", fontSize: 18, fontWeight: "bold", color: "#12141E" }}>{name}</Typography>
          <Typography sx={{ fontFamily: "poppins", fontSize: 12, fontWeight: "medium", color: "#6D6F75" }}>{role}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
