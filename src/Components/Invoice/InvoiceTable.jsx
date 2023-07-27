import { AccountCircle, PhoneAndroid } from "@mui/icons-material";
import { Autocomplete, Box, Switch, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InvoiceDataTable from "./InvoiceDataTable";
import DrawerRight from "../Component/DrawerRight";
import CoustomBillItem from "./CoustomBillItem";
import { clearAll } from "../../Store/Slices/InvoiceSlice";

export default function InvoiceTable() {
  const userData = useSelector((state) => state.user_data.userData);
  const dispatch = useDispatch();
  const [state, setState] = useState(false);
  const [checked, setchecked] = useState(false);
  const [refer, setrefer] = useState(false);
  const COUSTOMER_DATA = useSelector(
    (state) => state.coustomer_data.COUSTOMER_DATA["Coustomers"]
  );
  const [selectedOption, setSelectedOption] = useState("");
  const [subselectedOption, setSubSelectedOption] = useState("");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update the date and time every second

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  const handleBill = () => {
    if (!checked && !refer) {
      if (name.length > 0 && mobile.length > 0) {
        console.log("s");
      } else {
        console.log("mobile name  empty");
        // if(name.length===0){
        // }
      }
    } else {
      if (checked && !refer) {
        console.log("checked");
      } else if (!checked && refer) {
        console.log("refer checked");
      } else {
        console.log("both");
      }
    }
  };
  const normalCoustomerBill = () => {};
  return (
    <div className="max-w-5xl border-2 border-bluedark p-4 m-auto">
      <h1 className="font-bold">
        Bill<span className="text-blue">#{"0001"}</span>
      </h1>
      <h5>
        Date:{currentDateTime.getFullYear()}/{currentDateTime.getMonth() + 1}/
        {currentDateTime.getDate()}
      </h5>
      <div>
        <Switch
          checked={refer}
          onChange={(e) => {
            setrefer(e.target.checked);
          }}
          aria-label=""
        />
        <span className="text-purple">Referal Coustomer</span>
        {refer ? (
          <Autocomplete
            onChange={(event, val) => {
              setSelectedOption(val);
            }}
            id="country-select-demo"
            sx={{ width: 300 }}
            options={COUSTOMER_DATA}
            autoHighlight
            getOptionLabel={(option) => option.Name}
            renderOption={(props, option) => (
              <Box
                component="li"
                sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                {...props}
              >
                <img
                  loading="lazy"
                  width="50"
                  src={option["Img"]}
                  srcSet={option["Img"]}
                  alt=""
                />
                {option.Name}
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Coustomer Name"
                variant="standard"
                placeholder="Chanaka"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: "new-password", // disable autocomplete and autofill
                }}
              />
            )}
          />
        ) : (
          <></>
        )}
      </div>

      <Switch
        checked={checked}
        onChange={(e) => {
          setchecked(e.target.checked);
          setMobile("");
        }}
        aria-label=""
      />
      <span className="text-purple">My Coustomer</span>

      <div className="flex justify-between items-end flex-wrap">
        <div className="flex items-end">
          <h2>Bill To:</h2>

          {checked ? (
            <Autocomplete
              onChange={(event, val) => {
                setSubSelectedOption(val);
                if (val === null) {
                  setMobile("");
                } else {
                  setMobile(val["Mobile"]);
                }
              }}
              id="country-select-demo"
              sx={{ width: 300 }}
              options={COUSTOMER_DATA}
              autoHighlight
              getOptionLabel={(option) => option.Name}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                  {...props}
                >
                  <img
                    loading="lazy"
                    width="50"
                    src={option["Img"]}
                    srcSet={option["Img"]}
                    alt=""
                  />
                  {option.Name}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Coustomer Name"
                  variant="standard"
                  placeholder="Chanaka"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: "new-password", // disable autocomplete and autofill
                  }}
                />
              )}
            />
          ) : (
            <Box sx={{ display: "flex", alignItems: "flex-end" }}>
              <AccountCircle sx={{ mr: 1, my: 0.5 }} className="text-blue" />
              <TextField
                id="input-with-sx"
                label="Coustomer Name"
                variant="standard"
                placeholder="Chanaka"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </Box>
          )}
          {/* //! ADDED COUSTOMER BILL */}
          <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <PhoneAndroid sx={{ mr: 1, my: 0.5 }} className="text-blue" />
            <TextField
              id="input-with-sx"
              label="Mobile"
              variant="standard"
              placeholder="071 0000000"
              value={mobile || ""}
              onChange={(e) => setMobile(e.target.value)}
            />
          </Box>
        </div>
        <div className="flex items-end">
          <h2>Bill From:</h2>
          <h4>{userData["Name"]}</h4>
        </div>
      </div>
      <InvoiceDataTable />
      <div className="flex justify-between">
        <button
          onClick={() => setState(true)}
          className="bg-myblue px-2 py-2 text-mywhite my-2"
        >
          Add coustom Item
        </button>

        <button
          onClick={() => {
            dispatch(clearAll());
            setMobile("");
            setchecked(false);
            setrefer(false);
            setSelectedOption("");
            setSubSelectedOption("");
          }}
          className="bg-red px-8 py-2 text-mywhite m-2"
        >
          Clear
        </button>
        <button
          onClick={handleBill}
          className="bg-greendark px-8 py-2 text-mywhite m-2"
        >
          Bill
        </button>
      </div>

      <DrawerRight
        comp={<CoustomBillItem />}
        state={state}
        setState={setState}
      />
    </div>
  );
}
