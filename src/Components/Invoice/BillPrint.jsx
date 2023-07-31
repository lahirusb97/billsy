import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function BillPrint() {
  const COUSTOMER_DATA = useSelector(
    (state) => state.coustomer_data.COUSTOMER_DATA["Coustomers"]
  );
  const Shop_Data = useSelector((state) => state.user_data.CURRENT_SHOP);
  const CATEGORY_DATA = useSelector((state) => state.stock_data.CATEGORY_DATA);
  const INVOICE_ITEMS = useSelector(
    (state) => state.invoice_data.INVOICE_ITEMS
  );
  const TOTAL = useSelector((state) => state.invoice_data.TOTAL_PRICE);
  const TOTAL_COST = useSelector((state) => state.invoice_data.TOTAL_COST);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  return (
    <div>
      <div>
        <h1 className="text-lg font-bold text-center">{Shop_Data[["Name"]]}</h1>
        <h3 className="text-lg font-bold text-center">
          {Shop_Data[["Sub_title"]]}
        </h3>
      </div>
      <h1 className="font-bold">
        Bill No.
        <span className="text-black capitalize">
          {`${CATEGORY_DATA["Bill_char"]}${CATEGORY_DATA["Bill_number"] + 1}`}
        </span>
      </h1>
      <h5>
        Date:{currentDateTime.getFullYear()}/{currentDateTime.getMonth() + 1}/
        {currentDateTime.getDate()}
      </h5>
      <h5>Name:</h5>
      <hr></hr>
    </div>
  );
}
