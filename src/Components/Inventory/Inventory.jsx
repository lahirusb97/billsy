import AnimateRoute from "../Navigations/AnimateRoute";
import { Tab } from "@headlessui/react";
import Stocks from "./Stocks";
import InventorySettings from "./InventorySettings";
import { Settings } from "@mui/icons-material";

export default function Inventory() {
  return (
    <AnimateRoute>
      {
        <div className="ml-2 mt-2">
          <Tab.Group>
            <Tab.List className="border-2 w-44 flex border-grayLite shadow-lg  rounded-md">
              <Tab className=" w-full ui-selected:text-purple ui-selected:bg-purplelite font-semibold text-black">
                Stocks
              </Tab>
              <Tab className="py-2 w-full ui-selected:text-purple ui-selected:bg-purplelite font-semibold text-black ">
                <Settings />
              </Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <Stocks />
              </Tab.Panel>
              <Tab.Panel>
                <InventorySettings />
                {/* <div>
                <h1 className="text-myblue font-semibold text-lg">
                  Manage Category
                </h1>
                <TextField
                  id="outlined-basic"
                  label="Category Name"
                  variant="outlined"
                  placeholder="Apple Mobile"
                />
                <buttton className="bg-red-200">Add Category</buttton>
              </div> */}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      }
    </AnimateRoute>
  );
}
