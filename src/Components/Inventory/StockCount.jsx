import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Category } from "@mui/icons-material";
export default function StockCount() {
  return (
    <div className="flex flex-wrap mt-4">
      <div className="mr-2 h-20 flex items-center justify-center border-2 border-grayLite bg-mywhite w-52 rounded-lg">
        <div>
          <ShoppingCartIcon
            style={{ scale: "1.5" }}
            className="text-mygraylite"
          />
        </div>
        <div>
          <h1 className="font-semibold mx-4 text-mygraydark">Total Product</h1>
          <h1 className="font-semibold mx-4 text-greendark">200</h1>
        </div>
      </div>
      <div className="mr-2 h-20 flex items-center justify-center border-2 border-grayLite bg-mywhite w-52 rounded-lg">
        <div>
          <Category style={{ scale: "1.5" }} className="text-mygraylite" />
        </div>
        <div>
          <h1 className="font-semibold mx-4 text-mygraydark">Total Category</h1>
          <h1 className="font-semibold mx-4 text-greendark">200</h1>
        </div>
      </div>
      <div className="mr-2 h-20 flex items-center justify-center border-2 border-grayLite bg-mywhite w-52 rounded-lg">
        <div>
          <ShoppingCartIcon
            style={{ scale: "1.5" }}
            className="text-mygraylite"
          />
        </div>
        <div>
          <h1 className="font-semibold mx-4 text-mygraydark ">Total Cost</h1>
          <h1 className="font-semibold mx-4 text-greendark p-1 rounded-md">
            Rs 100200
          </h1>
        </div>
      </div>
    </div>
  );
}
