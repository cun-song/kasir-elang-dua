import React, { useEffect } from "react";
import { Box, Button, DialogActions, DialogContent, Grid, Typography, TextField, MenuItem, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StyledDialog from "./StyledDialog";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { pushTransaction } from "../redux/action/transactionAction";
import { setLoading } from "../redux/sidenavReducer";
import { setTransactionCustomer } from "../redux/customerReducer";
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
export default function DialogSelectCustomer({ open = false, handleToggle }) {
  const [customerID, setCustomerID] = useState(null);
  const [ownerList, setOwnerList] = useState([]);
  const [merchantList, setMerchantList] = useState([]);

  const dispatch = useDispatch();
  const customer = useSelector((state) => state?.customer?.allCustomer);
  const transaction = useSelector((state) => state?.transaction?.transactionData);
  const adminName = useSelector((state) => state?.sidenav?.name);
  const defaultData = useSelector((state) => state?.customer?.transactionCustomer);

  function save() {
    const ownerName = ownerList.find((owner) => owner.value === customerID)?.label;
    const merchantName = merchantList.find((merchant) => merchant.value === customerID)?.label;
    dispatch(setTransactionCustomer({ customerID: customerID, ownerName: ownerName, merchantName: merchantName }));
    handleToggle();
  }

  function removeCustomer() {
    setCustomerID(null);
  }

  useEffect(() => {
    if (open) {
      setCustomerID(defaultData?.customerID);
    }
  }, [open]);

  useEffect(() => {
    const ownerList = customer.map((c) => ({
      value: c.id,
      label: c.ownerName,
    }));
    setOwnerList(ownerList);

    const merchantList = customer.map((c) => ({
      value: c.id,
      label: c.merchantName,
    }));
    setMerchantList(merchantList);
  }, [customer]);
  return (
    <StyledDialog isOpen={open} handleToggle={handleToggle} useCloseBtn width="30%" title="Pilih Pelanggan">
      <DialogContent>
        <Grid>
          <Grid item mt={2}>
            <Typography sx={style.labelBotol} mb={1}>
              Nama Pemesan
            </Typography>
            <Grid item container gap={2}>
              <TextField id="select-costumer" SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: "400px" } } } }} select sx={{ width: "80%" }} value={customerID} onChange={(e) => setCustomerID(e.target.value)}>
                {ownerList.map((item, index) => (
                  <MenuItem value={item?.value} key={index}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
              <IconButton onClick={() => removeCustomer()} sx={{ width: "50px", height: "50px", ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Grid item mt={2}>
            <Typography sx={style.labelBotol} mb={1}>
              Nama Toko
            </Typography>
            <Grid item container gap={2}>
              <TextField id="select-merchant" SelectProps={{ MenuProps: { PaperProps: { style: { maxHeight: "400px" } } } }} select sx={{ width: "80%" }} value={customerID} onChange={(e) => setCustomerID(e.target.value)}>
                {merchantList.map((item, index) => (
                  <MenuItem value={item?.value} key={index}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
              <IconButton onClick={() => removeCustomer()} sx={{ width: "50px", height: "50px", ":hover": { backgroundColor: "transparent" }, ":active": { backgroundColor: "transparent" } }}>
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid item container justifyContent={"center"} my={2}>
          <Button onClick={() => save()} sx={{ backgroundColor: "#E06F2C", ":hover": { backgroundColor: "#E06F2C" }, width: "40%", height: "66px", borderRadius: "30px", textTransform: "none" }} variant="contained">
            Selesai
          </Button>
        </Grid>
      </DialogActions>
    </StyledDialog>
  );
}
