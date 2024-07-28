import React from "react";
import { Button, Grid, Typography } from "@mui/material";

export default function ButtonCategory({ value, id, label, img, setCategory = () => {} }) {
  return (
    <Button
      sx={{ padding: 0, borderRadius: "18px", border: `1px solid ${value === id ? "#E66E27" : "#CDCBCA"}`, textTransform: "none" }}
      onClick={() => {
        setCategory(id);
      }}
    >
      <Grid item gap={2} sx={{ width: "172px", height: "192px", borderRadius: "18px", backgroundColor: `${value === id ? "#FDF1EA" : "#FFFFFF"}`, display: "flex", flexDirection: "column", alignItems: "center", pt: 5 }}>
        <img src={img} alt={label} />
        <Typography sx={{ color: `${value === id ? "#704332" : "#A59D9A"}`, fontSize: 18, fontFamily: "nunito" }}>{label}</Typography>
      </Grid>
    </Button>
  );
}
