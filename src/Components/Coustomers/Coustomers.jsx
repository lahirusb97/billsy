import { Tab } from "@headlessui/react";
import AnimateRoute from "../Navigations/AnimateRoute";
import CoustomerDashboard from "./CoustomerDashboard";
import CoustomerList from "./CoustomerList";

export default function Coustomers() {
  return (
    <AnimateRoute>
      <div className="ml-2 mt-2">
        <Tab.Group>
          <Tab.List className="border-2 w-72 flex border-grayLite shadow-lg  rounded-md">
            <Tab className="py-2 w-full ui-selected:text-purple ui-selected:bg-purplelite font-semibold text-black ">
              Dashboard
            </Tab>
            <Tab className=" w-full ui-selected:text-purple ui-selected:bg-purplelite font-semibold text-black">
              CoustomerList
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <CoustomerDashboard />
            </Tab.Panel>
            <Tab.Panel>
              <CoustomerList />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </AnimateRoute>
  );
}
