import React, { useEffect, useRef, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { useDispatch, useSelector } from "react-redux";
import { openclose } from "../../Store/Slices/billlSlice";
import { CloseRounded, PhoneAndroidOutlined, Print } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import ReactToPrint from "react-to-print";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { openScackbar } from "../../Store/Slices/SnackBarSlice";

export default function BillModal() {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.bill_data.OPEN_MODAL);
  const OPENED_BILL_ID = useSelector((state) => state.bill_data.OPENED_BILL);

  const Shop_Data = useSelector((state) => state.shop_data.SELECTED_SHOP);
  const CATEGORY_DATA = useSelector((state) => state.stock_data.CATEGORY_DATA);
  const userData = useSelector((state) => state.user_data.userData);
  //
  const BILLHISTORY = useSelector((state) => state.bill_data.BILLHISTORY);
  const [OPENED_BILL, setOPENED_BILL] = useState([]);
  //
  useEffect(() => {
    const selected = BILLHISTORY.filter((e) => e["id"] === OPENED_BILL_ID);
    setOPENED_BILL(selected);
  }, [BILLHISTORY, OPENED_BILL_ID]);

  const componentRef = useRef();
  const [payment, setPayment] = useState(0);
  const [currPayment, setCurrPayment] = useState(0);
  const [payList, setPayList] = useState([0]);
  const handleClose = () => dispatch(openclose(false));
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const formattedTime = currentDateTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const handleAdd = async () => {
    const db = getFirestore();
    const washingtonRef = doc(
      db,
      `bills/${
        CATEGORY_DATA["Shop_id"]
      }/${currentDateTime.getFullYear()}/${OPENED_BILL_ID}`
    );

    // Set the "capital" field of the city 'DC'
    await updateDoc(washingtonRef, {
      ...OPENED_BILL[0],
      Date: new Date(OPENED_BILL[0]["Date"]),
      Payment: OPENED_BILL[0]["Payment"] + payment,
    }).then(() => {
      dispatch(
        openScackbar({ open: true, type: "success", msg: "Bill Updated" })
      );
    });
  };
  const dateConvert = () => {
    const Datez = new Date(OPENED_BILL.length > 0 && OPENED_BILL[0]["Date"]);
    return `${Datez.getFullYear()}/${Datez.getMonth() + 1}/${Datez.getDay()}`;
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <CloseRounded
              onClick={handleClose}
              className="text-red my-2 cursor-pointer scale-125"
            />
            <div ref={componentRef}>
              <div className="mt-1 mb-3 border-4 border-black p-2">
                <h1 className=" font-black text-4xl text-center">
                  {Shop_Data[["Name"]]}
                </h1>
                <h3 className="font-bold text-center capitalize">
                  {Shop_Data[["Sub_title"]]}
                </h3>

                <div className="flex justify-center items-center">
                  <PhoneAndroidOutlined />
                  {Shop_Data["Contact_num"].map((e, i) => (
                    <h6 className="ml-2" key={e}>
                      {e}
                      {Shop_Data["Contact_num"].length - 1 === i ? "" : " /"}
                    </h6>
                  ))}
                </div>
              </div>
              <div className="ml-2">
                <h1 className="font-bold">
                  Bill No:
                  <span className="text-black capitalize">
                    {OPENED_BILL.length > 0 && OPENED_BILL[0]["Bill_id"]}
                  </span>
                </h1>
                <h5>Date:{dateConvert()}</h5>
                <h5>Name:{OPENED_BILL.length > 0 && OPENED_BILL[0]["Name"]}</h5>
              </div>
              <hr></hr>
              <div className="">
                <div>
                  <div className="grid grid-cols-3 bg-black text-mywhite px-2">
                    <h4 className="">Discription</h4>
                    <h4 className="justify-self-center">Qty</h4>
                    <h4 className="justify-self-end">Price Rs.</h4>
                  </div>
                  {OPENED_BILL.length > 0 &&
                    OPENED_BILL[0]["Items"].map((e, i) => (
                      <div
                        key={("item", i)}
                        className="grid grid-cols-3 px-2 py-1"
                      >
                        <h4 className="capitalize">{e["Product_name"]}</h4>
                        <h4 className="justify-self-center">{e["Qty"]}</h4>
                        <h4 className="justify-self-end">{e["Price"]}</h4>
                      </div>
                    ))}

                  <hr></hr>

                  <h1 className="text-end px-2 font-black">
                    Grand Total Rs.{" "}
                    <span className="font-semibold">
                      {OPENED_BILL.length > 0 && OPENED_BILL[0]["Total"]}
                    </span>
                  </h1>
                  <h1 className="text-end px-2 font-semibold">
                    Paid Total Rs.{" "}
                    <span className="font-semibold">
                      {OPENED_BILL.length > 0 && OPENED_BILL[0]["Payment"]}
                    </span>
                  </h1>
                  <hr />
                  {/* <div className="flex px-2 justify-between font-semibold">
                    <h5>
                      Date:
                      {currentDateTime.getFullYear()}/
                      {currentDateTime.getMonth() + 1}/
                      {currentDateTime.getDay()}
                    </h5>
                    <h5>Rs. {currPayment}</h5>
                  </div> */}
                  <hr />

                  <h1 className="text-end px-2 font-semibold">
                    Payment Left.{" "}
                    <span className="font-semibold">
                      {OPENED_BILL.length > 0 &&
                        OPENED_BILL[0]["Total"] - OPENED_BILL[0]["Payment"]}
                    </span>
                  </h1>

                  <hr></hr>
                </div>
                <div className="flex justify-center">
                  <p className="text-center text-xs">
                    Billed by: {userData["Name"]} -{" "}
                  </p>
                  <p className="text-center text-xs"> {formattedTime}</p>
                </div>
                <p className="text-center text-xs font-black">
                  Techway systems: 071-6320662
                </p>
              </div>
            </div>
            <div>
              <TextField
                placeholder="Payment"
                label="Payment"
                style={{ marginTop: "1em" }}
                size="small"
                type="number"
                value={payment}
                onChange={(e) => setPayment(parseInt(e.target.value))}
              />
              <Button
                onClick={handleAdd}
                style={{ margin: "1em" }}
                variant="contained"
              >
                Add
              </Button>
            </div>{" "}
            *
            <ReactToPrint
              trigger={() => (
                <button className="bg-purple text-mywhite px-2 py-1 my-2 float-right">
                  <Print className="mr-2 " />
                  Print
                </button>
              )}
              content={() => componentRef.current}
            />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
