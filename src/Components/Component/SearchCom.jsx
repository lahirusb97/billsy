import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import stockData, { stockFilter } from "../../Store/Slices/stockData";

export default function SearchCom() {
  const dispatch = useDispatch();

  const shopData = useSelector((state) => state.shop_data.SELECTED_SHOP);

  const allStocks = useSelector((state) => state.stock_data.ALL_STOCKS);

  const [mainCategory, setmainCategory] = useState(["All"]);
  const [subCategory, setsubCategory] = useState(["All"]);
  const [brandList, setbrandList] = useState(["All"]);
  const [value, setValue] = useState(mainCategory[0]);
  const [subvalue, setsubValue] = useState(subCategory[0]);

  const [inputValue, setInputValue] = useState("");

  // useEffect(() => {
  //   if (allStocks.length > 0) {
  //     if (value === "All" && subvalue === "All") {
  //       //!ALL CATEGORYS
  //       const filterdData = allStocks.filter((item) =>
  //         item["Product_name"].includes(inputValue)
  //       );

  //       dispatch(stockFilter(filterdData));
  //     } else if (value !== "All" && subvalue === "All") {
  //       //!SELECTED CATEGORYS NO SUB VALUE

  //       const filterdData = allStocks.filter(
  //         (item) =>
  //           item["Product_name"].includes(inputValue) &&
  //           item["Category"].includes(value)
  //       );

  //       //!WITH SUB VALUE AND CATE VALUE
  //       dispatch(stockFilter(filterdData));
  //     } else if (value !== "All" && subvalue !== "All") {
  //       const filterdData = allStocks.filter(
  //         (item) =>
  //           item["Product_name"].includes(inputValue) &&
  //           item["Category"].includes(value) &&
  //           item["Sub_Category"].includes(subvalue)
  //       );

  //       dispatch(stockFilter(filterdData));
  //     }
  //   }
  //   const catarray = ["All"];
  //   const subcatarray = ["All"];

  //   shopData["Category"].forEach((element) => {
  //     catarray.push(element);
  //   });
  //   if (shopData[value]) {
  //     shopData[value].forEach((element) => {
  //       subcatarray.push(element);
  //     });
  //   }

  //   setmainCategory(catarray);
  //   setsubCategory(subcatarray);
  // }, [inputValue, value, subvalue, allStocks, shopData["Category"]]);

  return (
    <div className="flex items-end pb-2 flex-wrap">
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <Search sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          id="input-with-sx"
          label="Search Product"
          variant="standard"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Box>

      <div className="flex flex-wrap pl-0 md:pl-2 md:my-0">
        <Autocomplete
          className="md:ml-2 ml-0 md:my-0 my-2"
          size="small"
          value={value === null ? "All" : value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          onInputChange={(event, newInputValue) => {
            setValue(newInputValue);
          }}
          disablePortal
          id="combo-box-demo"
          options={mainCategory}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Category" />}
        />
        {value === "All" || value === null ? (
          <></>
        ) : (
          <Autocomplete
            size="small"
            className="md:ml-2 ml-0 md:my-0 my-2"
            value={subvalue === null ? "All" : subvalue}
            onChange={(event, newValue) => {
              setsubValue(newValue);
            }}
            onInputChange={(event, newInputValue) => {
              setsubValue(newInputValue);
            }}
            disablePortal
            id="combo-box-demo"
            options={subCategory}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Sub Category" />
            )}
          />
        )}
      </div>
    </div>
  );
}
