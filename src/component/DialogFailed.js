import React from "react";
import { Alert, Stack, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function DialogFailed({ open = false, handleToggle, message = "Pesanan Gagal Dibuat" }) {
  return (
    <Stack
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 9999,
      }}
    >
      {open && (
        <Alert
          severity="error"
          action={
            <IconButton aria-label="close" color="inherit" size="small" onClick={handleToggle}>
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {message}
        </Alert>
      )}
    </Stack>
  );
}
