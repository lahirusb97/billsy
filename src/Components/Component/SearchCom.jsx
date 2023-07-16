import React, { useEffect, useState } from "react";
import { Box, TextField, Autocomplete } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import stockData, { stockFilter } from "../../Store/Slices/stockData";

export default function SearchCom() {
  const dispatch = useDispatch();
  const StockData = useSelector((state) => state.stock_data.CATEGORY_DATA);
  const allStocks = useSelector((state) => state.stock_data.ALL_STOCKS);

  const [mainCategory, setmainCategory] = useState(["All"]);
  const [subCategory, setsubCategory] = useState(["All"]);
  const [brandList, setbrandList] = useState(["All"]);
  const [value, setValue] = useState(mainCategory[0]);
  const [subvalue, setsubValue] = useState(subCategory[0]);
  const [brand, setBrand] = useState(brandList[0]);
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    if (value === "All") {
      //!ALL CATEGORYS

      const filterdData = allStocks.filter((item) =>
        item["Product_name"].includes(inputValue)
      );

      dispatch(stockFilter(filterdData));
      console.log("s");
    } else {
      //!SELECTED CATEGORYS
      if (subvalue === "All") {
        //!NO SUB VALUE
        const filterdData = inputValue
          ? allStocks.filter(
              (item) =>
                item["Product_name"].includes(inputValue) &&
                item["Category"].includes(value)
            )
          : allStocks.filter((item) => item["Category"].includes(value));
        dispatch(stockFilter(filterdData));
        console.log("x");
      } else {
        const filterdData = inputValue
          ? allStocks.filter(
              (item) =>
                item["Product_name"].includes(inputValue) &&
                item["Category"].includes(value) &&
                item["Sub_Category"].includes(subvalue)
            )
          : allStocks;
        //!WITH SUB VALUE
        dispatch(stockFilter(filterdData));
        console.log("cat");
      }
    }
  }, [inputValue, value, subvalue]);

  useEffect(() => {
    if (StockData) {
      const catArray1 = ["All"];
      StockData["Category"].forEach((e) => catArray1.push(e));
      setmainCategory(catArray1);
      // setValue(mainCategory[0]);

      const catArray = ["All"];
      if (StockData[value]) {
        StockData[value].forEach((e) => catArray.push(e));
        setsubCategory(catArray);
      } else {
        setsubCategory(["All"]);
        setsubValue(subCategory[0]);
      }
      if (StockData["Brand"]) {
        const catArray1 = ["All"];
        StockData["Brand"].forEach((e) => catArray1.push(e));
        setbrandList(catArray1);
      } else {
        setbrandList(["All"]);
        setBrand(brandList[0]);
      }
    }
  }, [StockData, subvalue, value, brand]);
  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
        <Search sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          id="input-with-sx"
          label="Search Product"
          variant="standard"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Box>
      <div className="flex my-4">
        <Autocomplete
          value={value === null ? "All" : value}
          onChange={(event, newValue) => {
            setValue(newValue);
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
            className="ml-2"
            value={subvalue === null ? "All" : subvalue}
            onChange={(event, newValue) => {
              setsubValue(newValue);
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
        {/* <Autocomplete
          className="ml-2"
          value={brand === null ? "All" : brand}
          onChange={(event, newValue) => {
            setBrand(newValue);
          }}
          disablePortal
          id="combo-box-demo"
          options={brandList}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Brand" />}
        /> */}
      </div>
    </div>
  );
}
