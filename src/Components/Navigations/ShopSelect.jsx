import { useDispatch, useSelector } from "react-redux";
import { setCurrentShop } from "../../Store/Slices/userDataSlice";
//     <div className="w-full h-screen flex justify-center items-center">
//       {/* <button
//         onClick={() => {
//           dispatch(setCurrentShop({ curentShop: "ok", Spswitch: true }));
//         }}

import { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckCircle } from "@mui/icons-material";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import { setStock } from "../../Store/Slices/stockData";
const plans = [
  {
    name: "Startup",
  },
  {
    name: "Business",
  },
  {
    name: "Enterprise",
  },
];

export default function ShopSelect() {
  const authId = useSelector((state) => state.user_data.authData);
  const [shopList, setShopList] = useState([]);
  const [selected, setSelected] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const getNestedDocs = async () => {
      try {
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
        // Access the nested documents data array
      } catch (error) {
        console.error("Error retrieving nested documents:", error);
      }
    };

    getNestedDocs();
  }, []);
  const handleShopSelect = (e) => {
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
      }
    });
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
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
    </div>
  );
}
