import React, { useEffect } from "react";
import { Box, Button, DialogActions, DialogContent, Grid, Typography, TextField, MenuItem, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StyledDialog from "./StyledDialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pushTransaction } from "../redux/action/transactionAction";
import { AREA_SELECT } from "../constant/Customer";
import { pushCustomer } from "../redux/action/customerAction";
import { setLoading } from "../redux/sidenavReducer";
const style = {
  scroll: {
    "&::-webkit-scrollbar": {
      height: "1.4em",
      scrollBehavior: "smooth",
      "&-track": {
        background: "transparent",
      },
      "&-thumb": {
        backgroundColor: "#D9D9D9",
        borderRadius: "2em",
        backgroundClip: "content-box",
        border: "0.3em solid transparent",
        "&:hover": {
          background: "#a8a8a8",
          backgroundClip: "content-box",
          border: "0.35em solid transparent",
        },
      },
      "&-track-piece": {
        marginLeft: "-0.3em",
        marginRight: "-0.3em",
      },
    },
  },
  rowCheckout: { display: "flex", justifyContent: "space-between" },
  textCheckout: { fontFamily: "poppins", fontSize: "16px", fontWeight: "medium", color: "#12141E" },
  title: { fontFamily: "poppins", fontSize: "28px", fontWeight: "bold", color: "#12141E" },
  labelBotol: { fontFamily: "nunito", fontSize: "16px", fontWeight: "medium", color: "#828282" },
};
export default function DialogCustomer({ open = false, handleToggle }) {
  const [area, setArea] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [address, setAddress] = useState("");
  const [gmaps, setGmaps] = useState("");

  const dispatch = useDispatch();
  function save() {
    if (ownerName !== "" && merchantName !== "" && area !== "" && address !== "" && gmaps !== "") {
      const temp = {
        ownerName: ownerName,
        merchantName: merchantName,
        area: area,
        address: address,
        gmapsPoint: gmaps,
      };
      dispatch(setLoading());
      dispatch(pushCustomer(temp));
    }
  }

  useEffect(() => {
    if (!open) {
      setOwnerName("");
      setMerchantName("");
      setArea("");
      setAddress("");
      setGmaps("");
    }
  }, [open]);

  return (
    <StyledDialog isOpen={open} handleToggle={handleToggle} useCloseBtn width="30%" title="Tambah Pelanggan">
      <DialogContent>
        <Grid>
          <Grid item mt={2}>
            <Typography sx={style.labelBotol} mb={1}>
              Nama Pelanggan
            </Typography>
            <Grid item container gap={2}>
              <TextField id="ownerName" sx={{ width: "80%" }} value={ownerName} onChange={(e) => setOwnerName(e.target.value)} />
              <IconButton onClick={() => setOwnerName("")} sx={{ width: "50px", height: "50px", ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item mt={2}>
            <Typography sx={style.labelBotol} mb={1}>
              Nama Toko
            </Typography>
            <Grid item container gap={2}>
              <TextField id="merchantName" sx={{ width: "80%" }} value={merchantName} onChange={(e) => setMerchantName(e.target.value)} />
              <IconButton onClick={() => setMerchantName("")} sx={{ width: "50px", height: "50px", ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item mt={2}>
            <Typography sx={style.labelBotol} mb={1}>
              Wilayah
            </Typography>
            <Grid item container gap={2}>
              <TextField id="select-area" select sx={{ width: "80%" }} value={area} onChange={(e) => setArea(e.target.value)}>
                {AREA_SELECT.map((item, index) => (
                  <MenuItem value={item?.value} key={index}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
              <IconButton onClick={() => setArea(null)} sx={{ width: "50px", height: "50px", ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item mt={2}>
            <Typography sx={style.labelBotol} mb={1}>
              Alamat
            </Typography>
            <Grid item container gap={2}>
              <TextField multiline maxRows={3} id="address" sx={{ width: "80%" }} value={address} onChange={(e) => setAddress(e.target.value)} />
              <IconButton onClick={() => setAddress("")} sx={{ width: "50px", height: "50px", ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item mt={2}>
            <Typography sx={style.labelBotol} mb={1}>
              Gmaps Point
            </Typography>
            <Grid item container gap={2}>
              <TextField multiline maxRows={3} id="gmaps" sx={{ width: "80%" }} value={gmaps} onChange={(e) => setGmaps(e.target.value)} />
              <IconButton onClick={() => setGmaps("")} sx={{ width: "50px", height: "50px", ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid item container justifyContent={"center"} my={2}>
          <Button onClick={() => save()} sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, width: "40%", height: "66px", borderRadius: "30px", textTransform: "none" }} variant="contained">
            Tambah
          </Button>
        </Grid>
      </DialogActions>
    </StyledDialog>
  );
}
