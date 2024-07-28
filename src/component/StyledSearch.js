import AddBoxIcon from "@mui/icons-material/AddBox";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, FormControl, IconButton, MenuItem, OutlinedInput, Popover, Select, Typography } from "@mui/material";
import React, { createRef, useEffect, useRef, useState } from "react";
// import DateRangePicker from "../../components/dateTimePicker/DateRangePicker";
import Search from "../svg/ArrowDropDown";
// import ButtonCommon from "../buttons/ButtonCommon";
// import StyledChips from "../chip/StyledChip";

const styles = {
  labelPeriode: {
    fontWeight: 600,
    fontSize: "1rem",
    color: "#65748B",
  },
  labelKategori: {
    fontWeight: 600,
    fontSize: "1rem",
    color: "#65748B",
    paddingTop: "28px",
  },
  hr: {
    width: "4%",
    margin: "1.7rem 1rem 0 1rem",
    height: 0,
    border: ".5px solid black",
  },
  boxAS: {
    minWidth: 200,
    marginLeft: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrapper: {
    minWidth: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrapper: {
    minWidth: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  select: {
    height: 48,
    textAlign: "left",
    borderRadius: 0,
    fontSize: 18,
    fontWeight: 500,
    width: "100%",
    "& .MuiSvgIcon-root": {
      color: "#E06F2C",
      fontSize: "2.5rem",
    },
  },
  paperSelect: {
    "& .MuiPaper-root > .MuiList-root > .MuiButtonBase-root-MuiMenuItem-root .Mui-selected ": {
      display: "none",
    },
    "& .MuiPaper-root > .MuiList-root > .MuiMenuItem-root.Mui-selected ": {
      display: "none",
    },
    "& .MuiPaper-root > .MuiList-root > .MuiMenuItem-root.Mui-selected ": {
      display: "none",
    },
    ".MuiList-root > .MuiMenuItem-root.Mui-selected ": {
      display: "none",
    },
  },
  searchIcon: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
    backgroundColor: "#E06F2C",
    width: 50,
    height: 48,
    "&:hover": {
      backgroundColor: "#E06F2C",
    },
  },
  parentBox: {
    width: "full",
    display: "flex",
    alignItems: "left",
    justifyContent: "left",
    flexDirection: "row",
  },
  buttonAS: {
    fontSize: "16px",
    fontWeight: 700,
    width: 208,
    height: 48,
    // paddingX: 7,
    textTransform: "none",
    borderRadius: 2,
    backgroundColor: "#E06F2C",
    color: "white",
    transition: "transform .2s ease-in-out",
    "&:hover": {
      backgroundColor: "#125FA1",
    },
    "&:active": {
      backgroundColor: "#E06F2C",
    },
  },
  popoverBox: {
    height: "340px",
    overflow: "auto",
    width: "100%",
    borderRadius: "8px",
    padding: "24px 30px 0 30px",
    backgroundColor: "white",
  },
  selectAS: {
    fontWeight: 500,
    minWidth: "230px",
    height: "100%",
    background: "#FFF",
    boxSizing: "border-box",
    "& .MuiSvgIcon-root": {
      color: "#156db8",
      fontSize: "2.5rem",
    },
    "&.Mui-selected": {
      display: "none",
    },
    "&.MuiMenuItem-root > .Mui-selected": {
      display: "none",
    },
    "&.MuiButtonBase-root-MuiMenuItem-root .Mui-selected ": {
      display: "none",
    },
    "& .MuiPaper-root > .MuiList-root > .MuiMenuItem-root.Mui-selected ": {
      display: "none",
    },
  },
  submitAS: {
    textTransform: "inherit",
    float: "right",
    fontWeight: "bold",
    marginTop: "40px",
    marginRight: "15px",
    marginBottom: "40px",
    width: 120,
    backgroundColor: "#E06F2C",
    height: 48,
    color: "white",
    borderRadius: 1,
    fontSize: 16,
    fontFamily: "Montserrat",
    textTransform: "inherit",
    marginLeft: 2,
    "&:hover": {
      backgroundColor: "#125fa1",
    },
    "&:active": {
      backgroundColor: "#E06F2C",
    },
  },
  category: {
    display: "flex",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    marginTop: "12px",
    width: "100%",
    gap: 10,
  },
  iconAS: (type) => ({
    "& :hover": {
      cursor: "pointer",
    },
    color: type === "add" ? "#156db8" : "#d63031",
    marginTop: "0.9%",
    marginLeft: type === "add" ? "10%" : "1.2%",
    fontSize: "35px",
  }),
};

export default function StyledSearch({ selectMenuItems = [{ value: "all", label: "All" }], useAdvancedSearch = false, handleSearchClick, handleAdvancedSearchSubmit, isResetSearch, setIsResetSearch }) {
  const [value, setValue] = useState(selectMenuItems[0].value);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchInput, setSearchInput] = useState({
    text: "",
    column: "all",
  });

  // Advanced Search
  const [selectMenuItemsAS, setSelectMenuItemsAS] = useState([]);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [date, setDate] = useState({ start: null, end: null });
  const [dateError, setDateError] = useState({ start: null, end: null });
  const chipsRef = useRef([]);
  const [advancedData, setAdvancedData] = useState([
    {
      category: null,
      chips: [],
      label: null,
    },
  ]);
  const [selectPlaceholder, setSelectPlaceholder] = useState([]);

  const selectMenuItemsLen = selectMenuItems.length;

  useEffect(() => {
    setSelectMenuItemsAS(selectMenuItems.slice(1));
  }, [selectMenuItems]);

  useEffect(() => {
    if (isResetSearch) {
      setSearchInput((prev) => ({
        text: "",
        column: "all",
      }));
      setValue((prev) => selectMenuItems[0].value);
      setDate({ start: null, end: null });
      setAdvancedData((prev) => [
        {
          category: null,
          chips: [],
          label: null,
        },
      ]);
      setIsResetSearch((prev) => false);
    }
  }, [isResetSearch]);

  useEffect(() => {
    setSubmitDisabled(dateError.start !== null || dateError.end !== null || date.start === null || date.end === null);
  }, [date, dateError]);

  if (selectPlaceholder.length !== selectMenuItemsLen) {
    const selectPlaceholderTemp = Array(selectMenuItemsLen).fill("blank");
    setSelectPlaceholder(selectPlaceholderTemp);
  }

  // Generate empty array(s), then fill each with a createRef value
  if (chipsRef.current.length !== selectMenuItemsLen) {
    chipsRef.current = Array(selectMenuItemsLen)
      .fill()
      .map((_, i) => chipsRef.current[i] || createRef());
  }

  const handleSearchTextInput = (text) => {
    setSearchInput({
      ...searchInput,
      text,
    });
  };

  const handleSelectMenuSearch = (e, obj) => {
    const { value: column } = obj.props;
    setValue(e.target.value);

    setSearchInput({
      ...searchInput,
      column,
    });
  };

  /**
   * Handle add chip functionality to a specific element from advancedData
   * @param {Event} e Event
   * @param {Integer} idx Index pointing to a specific element from advancedData
   * @param {Hook} ref A useRef hook element which is pointing to a specific OutlinedInput
   */

  /**
   * Handle deletion for chips
   * @param {Integer} idx Index to point a specifc element from advancedData
   * @param {String} val Text description from a selected chip
   */

  const handleSubmitOnEnter = (e) => {
    if (e.key === "Enter") {
      handleSearchClick(searchInput);
    }
  };

  return (
    <Box sx={styles.parentBox}>
      <Box sx={styles.searchWrapper}>
        <FormControl sx={{ width: 241 }}>
          <OutlinedInput
            sx={{
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              height: 48,
              fontSize: 18,
              fontWeight: 500,
              "& input::placeholder": {
                color: "black",
                opacity: 1,
              },
            }}
            onChange={(e) => handleSearchTextInput(e.target.value)}
            value={searchInput.text}
            onKeyDown={handleSubmitOnEnter}
            placeholder="Cari di sini"
          />
        </FormControl>

        <FormControl sx={{ width: 210 }}>
          <Select sx={styles.select} value={value} onChange={(e, obj) => handleSelectMenuSearch(e, obj)} inputProps={{ "aria-label": "Without label" }}>
            {selectMenuItems.map(({ value, label }, idx) => (
              <MenuItem key={idx} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton sx={styles.searchIcon} edge="end" onClick={() => handleSearchClick(searchInput)}>
          <Search />
        </IconButton>
      </Box>

      {/* <Box sx={styles.boxAS}>
         {useAdvancedSearch && (
          <>
            <Button sx={styles.buttonAS} aria-describedby={id} onClick={handleShowPopover}>
              Advanced Search
            </Button>
            <Popover
              id={id}
              open={isOpen}
              anchorEl={anchorEl}
              onClose={handleClosePopover}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <Box sx={styles.popoverBox} boxShadow={2}>
                <div>
                  <Typography sx={styles.labelPeriode}>Periode</Typography>
                  <div style={{ display: "flex", marginTop: "12px" }}>
                    <DateRangePicker date={date} setDate={setDate} handleDateError={handleDateError} />
                  </div>
                </div>
                <div>
                  <Typography sx={styles.labelKategori}>Kategori</Typography>
                  {advancedData.map((data, i) => (
                    <div style={styles.category} key={i}>
                      <Select
                        sx={styles.selectAS}
                        name="select_category_as"
                        value={data.category}
                        onChange={(e) => handleSelectMenuAS(i, e)}
                        variant="outlined"
                        MenuProps={{
                          PaperProps: {
                            sx: styles.paperSelect,
                          },
                        }}
                      >
                        {selectMenuItemsAS.map((item, index) => {
                          return advancedData.filter((el) => el.category === item.value).length < 1 ? (
                            <MenuItem value={item} key={index}>
                              {item.label}
                            </MenuItem>
                          ) : (
                            <MenuItem value={data.category} key={index}>
                              {data.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      <StyledChips chipsRef={chipsRef.current[i]} handleAddChip={handleAddChip} handleDeleteChip={handleDeleteChip} index={i} chips={data.chips} />
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {i === advancedData.length - 1 && i < selectMenuItemsAS.length - 1 && <AddBoxIcon onClick={handleAddSelectMenuAS} sx={styles.iconAS("add")} />}
                        {advancedData.length !== 1 && <DeleteIcon onClick={(e) => handleDeleteSelectMenuAS(e, i)} sx={styles.iconAS("delete")} />}
                      </div>
                    </div>
                  ))}
                </div>
                <ButtonCommon disabled={submitDisabled} sx={styles.submitAS} label="Apply" onClick={handleSubmitAS} />
              </Box>
            </Popover>
          </>
        )} 
      </Box> */}
    </Box>
  );
}
