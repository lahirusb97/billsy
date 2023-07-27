import React, { useState } from "react";
import StockTable from "./StockTable";
import ItemSearch from "./ItemSearch";
import InvoiceTable from "../Invoice/InvoiceTable";
export default function NewBill() {
  return (
    <div>
      <InvoiceTable />
      <ItemSearch />
      <StockTable />
    </div>
  );
}
