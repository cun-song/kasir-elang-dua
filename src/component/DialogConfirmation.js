import React from "react";
import StyledDialog from "./StyledDialog";
import { Button, DialogActions, DialogContent, Grid, Typography } from "@mui/material";

export default function DialogConfirmation({ open = false, handleToggle, save, label = "", children }) {
  return (
    <StyledDialog isOpen={open} handleToggle={handleToggle} useCloseBtn title="" width="30%">
      <DialogContent>
        <Typography sx={{ fontSize: "28px", fontWeight: "600", textAlign: "center", my: 2 }}>{label}</Typography>
        {children}
      </DialogContent>
      <DialogActions>
        <Grid container gap={4} sx={{ justifyContent: "center" }}>
          <Grid item>
            <Button onClick={handleToggle} sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, width: "160px", height: "56px", borderRadius: "26px", textTransform: "none" }} variant="contained">
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={() => save()} sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, width: "160px", height: "56px", borderRadius: "26px", textTransform: "none" }} variant="contained">
              Save
            </Button>
          </Grid>
        </Grid>
      </DialogActions>
    </StyledDialog>
  );
}
