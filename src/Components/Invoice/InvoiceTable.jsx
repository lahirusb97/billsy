import { AccountCircle, PhoneAndroid } from "@mui/icons-material";
import { Autocomplete, Box, Switch, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InvoiceDataTable from "./InvoiceDataTable";
import DrawerRight from "../Component/DrawerRight";
import CoustomBillItem from "./CoustomBillItem";
import { clearAll } from "../../Store/Slices/InvoiceSlice";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { openScackbar } from "../../Store/Slices/SnackBarSlice";
export default function InvoiceTable() {
  const userData = useSelector((state) => state.user_data.userData);
  const dispatch = useDispatch();
  const [state, setState] = useState(false);
  const [checked, setchecked] = useState(false);
  const [refer, setrefer] = useState(false);
  const COUSTOMER_DATA = useSelector(
    (state) => state.coustomer_data.COUSTOMER_DATA["Coustomers"]
  );
  const CATEGORY_DATA = useSelector((state) => state.stock_data.CATEGORY_DATA);
  const INVOICE_ITEMS = useSelector(
    (state) => state.invoice_data.INVOICE_ITEMS
  );
  const TOTAL = useSelector((state) => state.invoice_data.TOTAL_PRICE);
  const TOTAL_COST = useSelector((state) => state.invoice_data.TOTAL_COST);
  const [selectedOption, setSelectedOption] = useState("");
  const [subselectedOption, setSubSelectedOption] = useState("");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  //ERROS
  const [nameError, setNameError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [subselectedOptionError, setSubSelectedOptionError] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update the date and time every second

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  const handleBill = () => {
    if (INVOICE_ITEMS.length > 0) {
      if (!checked && !refer) {
        if (name.length > 0 && mobile.length === 10) {
          const productItems = INVOICE_ITEMS.map((e) => {
            return {
              Product_name: e["Product_name"],
              Qty: e["Qty"],
              Cost: e["Cost"],
              Price: e["Price"],
              Warranty: e["Warranty"],
            };
          });

          normalCoustomerBill(productItems);
        } else {
          if (name.length === 0) {
            setNameError(true);
            dispatch(
              openScackbar({
                open: true,
                type: "error",
                msg: "Coustomer name is empty",
              })
            );
          } else {
            setNameError(false);
          }
          if (mobile.length < 10 || mobile.length > 10) {
            setMobileError(true);
            dispatch(
              openScackbar({
                open: true,
                type: "error",
                msg: "Invalid Mobile Number",
              })
            );
          } else {
            setMobileError(false);
          }
        }
      } else {
        if (checked && !refer) {
          if (subselectedOption) {
            if (mobile.length === 10) {
              //!ADD BILL
              console.log(subselectedOption);
            } else {
              setMobileError(true);
            }
          } else {
            setSubSelectedOptionError(true);
          }
        } else if (!checked && refer) {
          console.log("refer checked");
        } else {
          console.log("both");
        }
      }
    } else {
      dispatch(
        openScackbar({ open: true, type: "error", msg: "No Item Added" })
      );
    }
  };

  const myCoustomerChecked = () => {};
  const normalCoustomerBill = (data) => {
    const db = getFirestore();
    const userDocRef = doc(
      db,
      `/bills/${
        CATEGORY_DATA["Shop_id"]
      }/${currentDateTime.getFullYear()}/${currentDateTime.getFullYear()}${
        currentDateTime.getMonth() + 1
      }${currentDateTime.getDate()}`
    );

    getDoc(userDocRef).then((snapshot) => {
      if (snapshot.exists()) {
        const newBillId = `${CATEGORY_DATA["Bill_char"]}${
          CATEGORY_DATA["Bill_number"] + 1
        }`;

        const newBillData = {
          Items: data,
          Total: TOTAL,
          Cost: TOTAL_COST,
          Name: name,
          Mobile: mobile,
          Date: currentDateTime,
        };
        //!
        updateDoc(userDocRef, {
          [`Bills.${newBillId}`]: newBillData,
        })
          .then(() => {
            const shopDocRef = doc(db, `/Shop/${CATEGORY_DATA["Shop_id"]}`);

            updateDoc(shopDocRef, {
              Bill_number: CATEGORY_DATA["Bill_number"] + 1,
            });
          })
          .then(() => {
            dispatch(
              openScackbar({ open: true, type: "success", msg: "Bill Added" })
            );
            ClearAllData();
          });
      } else {
        setDoc(userDocRef, {
          Bills: {
            [`${CATEGORY_DATA["Bill_char"]}${
              CATEGORY_DATA["Bill_number"] + 1
            }`]: {
              Items: data,
              Total: TOTAL,
              Cost: TOTAL_COST,
              Name: name,
              Mobile: mobile,
              Date: currentDateTime,
            },
          },
        });
      }
    });
  };
  const ClearAllData = () => {
    dispatch(clearAll());
    setMobile("");
    setchecked(false);
    setrefer(false);
    setSelectedOption("");
    setSubSelectedOption("");
  };

  return (
    <div className="max-w-5xl border-2 border-bluedark p-4 m-auto">
      <h1 className="font-bold">
        Bill
        <span className="text-blue">
          {` #${CATEGORY_DATA["Bill_char"]}${CATEGORY_DATA["Bill_number"] + 1}`}
        </span>
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
            options={Object.values(COUSTOMER_DATA).map((e) => e)}
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
              options={Object.values(COUSTOMER_DATA).map((e) => e)}
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
                  error={subselectedOptionError}
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
                error={nameError}
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
              error={mobileError}
              InputProps={{
                readOnly: checked || refer ? true : false,
              }}
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
          onClick={ClearAllData}
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
