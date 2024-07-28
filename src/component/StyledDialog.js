import { Dialog, DialogTitle, useMediaQuery } from "@mui/material";
import React from "react";
import Close from "@mui/icons-material/Cancel";

export default function StyledDialog({ isOpen = false, handleToggle, title = "", children, width = "55%", minWidth = "30%", useBorder = false, useCloseBtn = false, disabledBackdropClose = false, disabledEspKeyClose = false }) {
  const handleOnClose = (_, reason) => {
    if (reason === "backdropClick" && disabledBackdropClose) {
      return;
    }
    if (reason === "escapeKeyDown" && disabledEspKeyClose) {
      return;
    }
    handleToggle();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleOnClose}
      PaperProps={{
        sx: {
          maxWidth: "100%",
          width: useMediaQuery("(min-width:900px)") ? width : "90%",
          minWidth: minWidth,
          height: "full",
          borderTop: useBorder && 8,
          borderColor: useBorder && "#72371D",
          padding: "10px 5px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "poppins",
          fontSize: "28px",
          fontWeight: "bold",
          color: "#12141E",
          paddingBottom: 0,
        }}
      >
        {title}
        {useCloseBtn && <Close aria-label="close" onClick={handleToggle} sx={{ ml: "auto", cursor: "pointer", fontSize: 28, color: "#F24E1E" }} />}
      </DialogTitle>
      {children}
    </Dialog>
  );
}
