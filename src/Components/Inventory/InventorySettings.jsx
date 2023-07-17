import React from "react";
import { useSelector } from "react-redux";
import CategoryTable from "./CategoryTable";
export default function InventorySettings() {
  const ALL_STOCKS = useSelector((state) => state.stock_data.CATEGORY_DATA);
  const CURRENT_SHOP = useSelector((state) => state.user_data.CURRENT_SHOP);

  return (
    <div>
      <CategoryTable />
      {/* <div>
        <h1>Add New Category</h1>
      </div>
      <div>
        <h1>Add New Sub Category</h1>
      </div> */}
    </div>
  );
}
