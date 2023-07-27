import AnimateRoute from "../Navigations/AnimateRoute";
import { Tab } from "@headlessui/react";

import { History } from "@mui/icons-material";
import NewBill from "./NewBill";
import BillHistory from "./BillHistory";

export default function Invoice() {
  return (
    <AnimateRoute>
      <div className="ml-2 mt-2">
        <Tab.Group>
          <Tab.List className="border-2 w-44 flex border-grayLite shadow-lg  rounded-md">
            <Tab className=" w-full ui-selected:text-purple ui-selected:bg-purplelite font-semibold text-black">
              New Bill
            </Tab>
            <Tab className="py-2 w-full ui-selected:text-purple ui-selected:bg-purplelite font-semibold text-black ">
              Histoty <History />
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <NewBill />
            </Tab.Panel>
            <Tab.Panel>
              <BillHistory />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </AnimateRoute>
  );
}
