import { useDispatch, useSelector } from "react-redux";
import { setCurrentShop } from "../../Store/Slices/userDataSlice";

import { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircle } from "@mui/icons-material";
import { getDatabase, ref, onValue } from "firebase/database";
import {
  setCategory,
  setStock,
  stockFilter,
} from "../../Store/Slices/stockData";
import {
  collection,
  query,
  where,
  onSnapshot,
  getFirestore,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import RegisterShop from "../Settings/RegisterShop";
import { openScackbar } from "../../Store/Slices/SnackBarSlice";
import { addCustomerData } from "../../Store/Slices/CoustomerData";
import { shopselect } from "../../Store/Slices/shopData";
import "../firebaseConfig";
import { setAllShops } from "../../Store/Slices/shopSlice";
export default function ShopSelect() {
  const authId = useSelector((state) => state.user_data.authData);
  const userData = useSelector((state) => state.user_data.userData);

  const [shopList, setShopList] = useState([]);
  const [shops, setshops] = useState(false);
  const [selected, setSelected] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const getNestedDocs = async () => {
      try {
        if (userData["Admin"]) {
          const db = getFirestore();
          const querySnapshot = await getDocs(collection(db, "Shop"));
          const shopLi = [];
          querySnapshot.forEach((doc) => {
            shopLi.push({ ...doc.data(), Id: doc.id });
          });

          dispatch(setAllShops(shopLi));
        }
        const db = getFirestore();
        const parentDocRef = collection(db, `Users/${authId}/Accessible_shop`);
        const nestedDocsSnapshot = await getDocs(parentDocRef);

        const nestedDocsData = [];
        nestedDocsSnapshot.forEach((nestedDocSnapshot) => {
          const nestedDocData = nestedDocSnapshot.data();
          // Access the nested document data
          const isDuplicate = nestedDocsData.some((doc) => {
            return JSON.stringify(doc) === JSON.stringify(nestedDocData);
          });
          if (!isDuplicate) {
            nestedDocsData.push({
              id: nestedDocSnapshot.id,
              ...nestedDocData,
            });
          }
        });
        setShopList(nestedDocsData);
        setshops(nestedDocsData.length > 0 ? false : true);
        // Access the nested documents data array

        const docRef = doc(db, "/Customers_map", "List");
        onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            dispatch(addCustomerData(docSnap.data()));
          } else {
            // docSnap.data() will be undefined in this case
            dispatch(addCustomerData([]));
          }
        });
      } catch (error) {
        console.log(error);
        dispatch(
          openScackbar({
            open: true,
            type: "error",
            msg: "Check Your Internet",
          })
        );
      }
    };

    getNestedDocs();
  }, []);
  const handleShopSelect = (e) => {
    const getShopData = async () => {
      const db = getFirestore();
      const q = query(
        collection(db, "Shop"),
        where("Shop_id", "==", e["Shop_id"])
      );
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const docId = doc.id;

          dispatch(setCategory({ id: docId, ...data }));
          dispatch(shopselect({ id: docId, ...data }));
        });
      });
    };
    getShopData();

    const db = getDatabase();
    const starCountRef = ref(db, "/System/Inventory/" + e["Shop_id"]);
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allStocks = [];

        Object.values(data).map((e) => allStocks.push(e));

        dispatch(
          setCurrentShop({ curentShop: e, Spswitch: true, shopList: shopList })
        );
        dispatch(setStock(allStocks));
        dispatch(stockFilter(allStocks));
      } else {
        dispatch(
          setCurrentShop({ curentShop: e, Spswitch: true, shopList: shopList })
        );
        dispatch(setStock([]));
        dispatch(stockFilter([]));
      }
    });
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      {shopList.length > 0 ? (
        <div className="mx-auto w-full max-w-md">
          <h1 className="font-bold uppercase text-4xl text-black text-center mb-4">
            Seclect Your Shop
          </h1>
          <RadioGroup value={selected} onChange={handleShopSelect}>
            <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
            <div className="space-y-2">
              {shopList.map((plan) => (
                <RadioGroup.Option
                  key={plan.Name}
                  value={plan}
                  className={({ active, checked }) =>
                    `${
                      active
                        ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                        : ""
                    }
                  ${
                    checked ? "bg-sky-900 bg-opacity-75 text-white" : "bg-white"
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                  }
                >
                  {({ active, checked }) => (
                    <>
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-sm">
                            <RadioGroup.Label
                              as="p"
                              className={`font-medium  ${
                                checked ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {plan.Name}
                            </RadioGroup.Label>
                            <RadioGroup.Description
                              as="span"
                              className={`inline ${
                                checked ? "text-sky-100" : "text-gray-500"
                              }`}
                            ></RadioGroup.Description>
                          </div>
                        </div>
                        {checked && (
                          <div className="shrink-0 text-white">
                            <CheckCircle className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
      ) : shopList.length === 0 && shops ? (
        <RegisterShop />
      ) : (
        <></>
      )}
    </div>
  );
}
