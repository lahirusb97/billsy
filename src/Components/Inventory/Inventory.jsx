import AnimateRoute from "../Navigations/AnimateRoute";
import { Tab } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import { TextField } from "@mui/material";
import Stocks from "./Stocks";
import InventorySettings from "./InventorySettings";
import { Settings } from "@mui/icons-material";
import {
  collection,
  query,
  where,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../Store/Slices/stockData";

export default function Inventory() {
  const dispatch = useDispatch();
  const shop_Id = useSelector(
    (state) => state.user_data.CURRENT_SHOP["Shop_id"]
  );

  useEffect(() => {
    const getShopData = async () => {
      const db = getFirestore();
      const q = query(collection(db, "Shop"), where("Shop_id", "==", shop_Id));
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const docId = doc.id;
          dispatch(setCategory({ id: docId, ...data }));
        });

        // console.log(shops);
      });
    };
    getShopData();
  }, [shop_Id]);

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
