import {
  CloseRounded,
  MobileScreenShare,
  Phone,
  PhoneAndroid,
  PhoneAndroidOutlined,
  Print,
} from "@mui/icons-material";
import { Backdrop, Box, Modal } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
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
export default function BillPrint({
  setOpen,
  open,
  name,
  ClearAllData,
  payment,
}) {
  const COUSTOMER_DATA = useSelector(
    (state) => state.coustomer_data.COUSTOMER_DATA["Coustomers"]
  );
  const Shop_Data = useSelector((state) => state.shop_data.SELECTED_SHOP);
  const CATEGORY_DATA = useSelector((state) => state.stock_data.CATEGORY_DATA);
  const INVOICE_ITEMS = useSelector(
    (state) => state.invoice_data.INVOICE_ITEMS
  );
  const TOTAL = useSelector((state) => state.invoice_data.TOTAL_PRICE);
  const userData = useSelector((state) => state.user_data.userData);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentDateTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const componentRef = useRef();

  const handleClose = (event, reason) => {
    if (reason && reason == "backdropClick") {
      return false;
    }

    // Close the modal
    handleClose();
  };
  const handleClose2 = () => {
    setOpen(false);
    ClearAllData();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropProps={{
        // Set the clickable attribute to true to enable backdrop click
        clickable: true,
      }}
    >
      <Box sx={style}>
        <CloseRounded
          onClick={handleClose2}
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
                {`${CATEGORY_DATA["Bill_char"]}${
                  CATEGORY_DATA["Bill_number"] + 1
                }`}
              </span>
            </h1>
            <h5>
              Date:{currentDateTime.getFullYear()}/
              {currentDateTime.getMonth() + 1}/{currentDateTime.getDate()}
            </h5>
            <h5>Name:{name}</h5>
          </div>
          <hr></hr>
          <div className="">
            <div>
              <div className="grid grid-cols-3 bg-black text-mywhite px-2">
                <h4 className="">Discription</h4>
                <h4 className="justify-self-center">Qty</h4>
                <h4 className="justify-self-end">Price Rs.</h4>
              </div>
              {INVOICE_ITEMS.map((e, i) => (
                <div key={("item", i)} className="grid grid-cols-3 px-2 py-1">
                  <h4 className="capitalize">{e["Product_name"]}</h4>
                  <h4 className="justify-self-center">{e["Qty"]}</h4>
                  <h4 className="justify-self-end">{e["Price"]}</h4>
                </div>
              ))}
              <hr></hr>
              <div className="grid">
                <h1 className="text-end px-2 font-black">Grand Total Rs.</h1>
              </div>
              <h1 className="text-end px-2 font-black">
                Grand Total Rs. <span className="font-semibold">{TOTAL}</span>
              </h1>
              <h1 className="text-end px-2 font-semibold">
                Payment Rs. <span className="font-semibold">{payment}</span>
              </h1>
              <h1 className="text-end px-2 font-semibold">
                Payment Left.{" "}
                <span className="font-semibold">{TOTAL - payment}</span>
              </h1>
              <hr></hr>
            </div>
            <div className="flex justify-center">
              <p className="text-center text-xs">
                Billed by: {userData["Name"]} -{" "}
              </p>
              <p className="text-center text-xs">{formattedTime}</p>
            </div>
            <p className="text-center text-xs font-black">
              Techway systems: 071-6320662
            </p>
          </div>
        </div>

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
    </Modal>
  );
}
