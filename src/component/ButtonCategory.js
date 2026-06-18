import { Box, Typography } from "@mui/material";
import React from "react";

export default function ButtonCategory({ id, value, img, label, setCategory }) {
  const isActive = value === id;

  return (
    <Box
      onClick={() => setCategory(id)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexShrink: 0,
        cursor: "pointer",
        px: 2,
        height: "40px",
        borderRadius: "20px",
        backgroundColor: isActive ? "#E06F2C" : "#F2F2F4",
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: isActive ? "#E06F2C" : "#E8E8EB",
        },
      }}
    >
      <Box
        sx={{
          width: "22px",
          height: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <img
          src={img}
          alt={label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: isActive ? "brightness(0) invert(1)" : "none",
          }}
        />
      </Box>
      <Typography
        noWrap
        sx={{
          fontFamily: "poppins",
          fontSize: "13px",
          fontWeight: "medium",
          color: isActive ? "#FFFFFF" : "#12141E",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
