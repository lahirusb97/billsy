import {
  AccountCircle,
  PaymentRounded,
  Payments,
  PhoneAndroid,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Switch,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InvoiceDataTable from "./InvoiceDataTable";
import DrawerRight from "../Component/DrawerRight";
import CoustomBillItem from "./CoustomBillItem";
import { clearAll } from "../../Store/Slices/InvoiceSlice";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { openScackbar } from "../../Store/Slices/SnackBarSlice";
import { getDatabase, ref, child, push, update } from "firebase/database";
import BillPrint from "./BillPrint";
import ReactToPrint from "react-to-print";

export default function InvoiceTable() {
  const [openmodal, setOpenmodal] = React.useState(false);

  const userData = useSelector((state) => state.user_data.userData);
  const dispatch = useDispatch();
  const [state, setState] = useState(false);
  const [checked, setchecked] = useState(false);
  const [refer, setrefer] = useState(false);
  const COUSTOMER_DATA = useSelector(
    (state) => state.coustomer_data.COUSTOMER_DATA["Coustomers"]
  );
  const COUSTOMER_DATA_DOC = useSelector(
    (state) => state.coustomer_data.COUSTOMER_DATA_DOC
  );

  const CATEGORY_DATA = useSelector((state) => state.shop_data.SELECTED_SHOP);

  const INVOICE_ITEMS = useSelector(
    (state) => state.invoice_data.INVOICE_ITEMS
  );
  const TOTAL = useSelector((state) => state.invoice_data.TOTAL_PRICE);
  const TOTAL_COST = useSelector((state) => state.invoice_data.TOTAL_COST);
  const [selectedOption, setSelectedOption] = useState("");
  const [subselectedOption, setSubSelectedOption] = useState("");
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [payment, setPayment] = useState("");
  const [paymentError, setPaymentError] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  //ERROS
  const [nameError, setNameError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [subselectedOptionError, setSubSelectedOptionError] = useState(false);
  const [loading, setloading] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update the date and time every second

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  const handleBill = () => {
    if (INVOICE_ITEMS.length > 0 && payment.length > 0) {
      if (name.length > 0 && mobile.length === 10) {
        //TODO BILL
        normalCoustomerBill(INVOICE_ITEMS);
      }
      if (!checked && !refer) {
        if (name.length > 0 && mobile.length === 10) {
          //TODO BILL
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
              //TODO BILL
            } else {
              setMobileError(true);
            }
          } else {
            setSubSelectedOptionError(true);
          }
        }
      }
    } else {
      if (INVOICE_ITEMS.length === 0) {
        dispatch(
          openScackbar({ open: true, type: "error", msg: "No Item Added" })
        );
      }
      if (payment.length === 0) {
        dispatch(
          openScackbar({
            open: true,
            type: "error",
            msg: "Enter Coustomer Payment",
          })
        );
        setPaymentError(true);
      }
    }
  };

  const normalCoustomerBill = async (data) => {
    const db = getFirestore();
    setloading(true);
    try {
      const collectionRef = collection(
        db,
        "bills",
        CATEGORY_DATA["Shop_id"],
        currentDateTime.getFullYear().toString()
      );

      const BILL_ITEM = data.map((e) => {
        const modifiedObject = {};
        modifiedObject.Product_name = e["Product_name"];
        modifiedObject.Qty = e["Qty"];
        modifiedObject.Cost = e["Cost"];
        modifiedObject.Price = e["Price"];
        modifiedObject.Warranty = e["Warranty"];
        modifiedObject.productID = e["productID"];
        modifiedObject.Stock_count = e["Stock_count"];

        return modifiedObject;
      });

      // TODO: UPDATE
      const docRef = await addDoc(collectionRef, {
        Items: BILL_ITEM.map((e) => {
          const modifiedObject = { ...e };
          delete modifiedObject["productID"];
          delete modifiedObject["Stock_count"];
          return modifiedObject;
        }),
        Total: TOTAL,
        Billed_by: userData["Name"],
        Cost: TOTAL_COST,
        Name: name,
        Coustomer_Id: checked ? subselectedOption["ID"] : "none",
        Mobile: mobile.toString(),
        Date: currentDateTime,
        Payment: parseInt(payment),
        Ref_id: refer ? selectedOption["ID"] : "none",
        Bill_id: `${CATEGORY_DATA["Bill_char"]}${
          CATEGORY_DATA["Bill_number"] + 1
        }`,
      }).then(async () => {
        // TODO: Update Stock
        const washingtonRef = doc(db, "Shop", CATEGORY_DATA["Shop_id"]);
        const updateData = {
          Bill_number: CATEGORY_DATA["Bill_number"] + 1,
        };

        await updateDoc(washingtonRef, updateData);

        reduceStock(BILL_ITEM);
        if (!checked) {
          setloading(false);
        }
        if (checked) {
          myCoustomerUpdate();
        }
      });
      //TODO REF UPDATE MANUAL COSTOMER
      if (refer) {
        const CheckRefID = COUSTOMER_DATA_DOC.filter(
          (coustomer) => coustomer["id"] === selectedOption["ID"]
        );

        if (CheckRefID.length > 0) {
          const refcoustomerRef = doc(db, "Coustomers", selectedOption["ID"]);
          await updateDoc(refcoustomerRef, {
            Ref_total: CheckRefID[0]["Ref_total"] + TOTAL,
            Ref_cost: CheckRefID[0]["Cost"] + TOTAL_COST,
          }).then(() => {
            console.log("LOADED REFCOSTOMER UPDATED ");
          });
        } else {
          selectedOption["ID"];
          const docRef = doc(db, "Coustomers", selectedOption["ID"]);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            await updateDoc(docRef, {
              Ref_total: data["Ref_total"] + TOTAL,
              Ref_cost: data["Ref_cost"] + TOTAL_COST,
            }).then(() => {
              console.log("GET REFCOSTOMER UPDATED ");
            });
          }
        }
      }
      //TODO REF UPDATE MANUAL COSTOMER
    } catch (error) {
      setloading(false);

      dispatch(
        openScackbar({
          open: true,
          type: "error",
          msg: "Check your internet conection",
        })
      );
    }
  };

  const myCoustomerUpdate = async () => {
    try {
      const CheckoustomerID = COUSTOMER_DATA_DOC.filter(
        (coustomer) => coustomer["id"] === subselectedOption["ID"]
      );

      const db = getFirestore();
      const coustomerRef = doc(db, "Coustomers", subselectedOption["ID"]);
      if (CheckoustomerID.length > 0) {
        await updateDoc(coustomerRef, {
          Total: CheckoustomerID[0]["Total"] + TOTAL,
          Cost: CheckoustomerID[0]["Cost"] + TOTAL_COST,
          Debt: CheckoustomerID[0]["Debt"] + (TOTAL - payment),
        }).then(() => setloading(false));
      } else {
        const docRef = doc(db, "Coustomers", subselectedOption["ID"]);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          await updateDoc(docRef, {
            Total: data["Total"] + TOTAL,
            Cost: data["Cost"] + TOTAL_COST,
            Debt: data["Debt"] + (TOTAL - payment),
          }).then(() => setloading(false));
        } else {
          // docSnap.data() will be undefined in this case
        }
      }
      if (refer) {
        const CheckRefID = COUSTOMER_DATA_DOC.filter(
          (coustomer) => coustomer["id"] === selectedOption["ID"]
        );

        if (CheckRefID.length > 0) {
          const refcoustomerRef = doc(db, "Coustomers", selectedOption["ID"]);
          await updateDoc(refcoustomerRef, {
            Ref_total: CheckRefID[0]["Ref_total"] + TOTAL,
            Ref_cost: CheckRefID[0]["Cost"] + TOTAL_COST,
          }).then(() => {
            setloading(false);
          });
        } else {
          selectedOption["ID"];
          const docRef = doc(db, "Coustomers", selectedOption["ID"]);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();

            await updateDoc(docRef, {
              Ref_total: data["Ref_total"] + TOTAL,
              Ref_cost: data["Ref_cost"] + TOTAL_COST,
            }).then(() => {
              setloading(false);
            });
          } else {
            // docSnap.data() will be undefined in this case
            setloading(false);
          }
        }
      }
    } catch (err) {
      setloading(false);

      dispatch(
        openScackbar({ open: true, type: "error", msg: "Network Error" })
      );
    }
  };
  const reduceStock = (BILL_ITEM) => {
    const dbrealtime = getDatabase();

    const stock_IDs = BILL_ITEM.filter((e) => e["productID"] !== "none");
    const coustom_Items = BILL_ITEM.filter((e) => e["productID"] === "none");
    if (stock_IDs.length === 0) {
      setOpenmodal(true);
      dispatch(
        openScackbar({ open: true, type: "success", msg: "Bill Added" })
      );
    }
    stock_IDs.forEach((element) => {
      const stockUpdate = {
        Stock_count: element["Stock_count"] - element["Qty"],
      };
      update(
        ref(
          dbrealtime,
          `/System/Inventory/${CATEGORY_DATA["Shop_id"]}/${element["productID"]}`
        ),
        stockUpdate
      )
        .then(() => {
          setOpenmodal(true);

          dispatch(
            openScackbar({ open: true, type: "success", msg: "Bill Added" })
          );
        })
        .catch((err) => {
          setloading(false);
        });
    });
  };
  const ClearAllData = () => {
    dispatch(clearAll());
    setMobile("");
    setchecked(false);
    setrefer(false);
    setSelectedOption("");
    setSubSelectedOption("");
    setPayment("");
  };

  return (
    <div className="max-w-5xl border-2 border-bluedark p-4 m-auto">
      <h1 className="font-bold">
        Bill
        <span className="text-blue capitalize">
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
            if (!checked) {
              setMobile("");
              setName("");
            }
          }}
          aria-label=""
        />
        <span className="text-purple">Referal Coustomer</span>
        {refer ? (
          <Autocomplete
            onChange={(event, val) => {
              setSelectedOption(val);

              if (val === null && !checked) {
                setMobile("");
                setName("");
              } else if (checked && val !== null) {
                // setMobile(val["Mobile"]);
                // setName(val["Name"]);
              }
            }}
            id="country-select-demo"
            sx={{ width: 300 }}
            options={Object.values(COUSTOMER_DATA).filter((e) =>
              subselectedOption ? e["Name"] !== subselectedOption["Name"] : e
            )}
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
          setName("");
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
                  setName("");
                } else {
                  setMobile(val["Mobile"]);
                  setName(val["Name"]);
                }
              }}
              id="country-select-demo"
              sx={{ width: 300 }}
              options={Object.values(COUSTOMER_DATA).filter((e) =>
                selectedOption ? e["Name"] !== selectedOption["Name"] : e
              )}
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
              type="number"
              variant="standard"
              placeholder="071 0000000"
              value={mobile || ""}
              onChange={(e) => setMobile(e.target.value)}
              error={mobileError}
              InputProps={{
                readOnly: checked ? true : false,
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
      <div className="flex justify-end mb-4 ">
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <Payments sx={{ mr: 1, my: 0.5 }} className="text-purple" />
          <TextField
            type="number"
            id="input-with-sx"
            label="Payment"
            variant="standard"
            placeholder="10000"
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            error={paymentError}
          />
        </Box>
      </div>
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
        {!loading ? (
          <button
            onClick={handleBill}
            className="bg-greendark px-8 py-2 text-mywhite m-2"
          >
            Bill
          </button>
        ) : (
          <CircularProgress />
        )}
      </div>

      <DrawerRight
        comp={<CoustomBillItem />}
        state={state}
        setState={setState}
      />

      <BillPrint
        ClearAllData={ClearAllData}
        setOpen={setOpenmodal}
        open={openmodal}
        name={name}
        payment={payment}
      />
    </div>
  );
}
