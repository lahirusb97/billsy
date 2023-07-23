import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc,
  query,
  getDocs,
  where,
  setDoc,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { openScackbar } from "../../Store/Slices/SnackBarSlice";
export default function RegisterShop() {
  const [shopName, setShopName] = useState("");
  const dispatch = useDispatch();
  const uid = useSelector((state) => state.user_data.authData);

  const registerShop = async () => {
    //!Check Name Exist
    const db = getFirestore();
    if (shopName.length > 0) {
      const citiesRef = collection(db, "Shop");

      const shopRef = query(citiesRef, where("Name", "==", shopName));

      const shopSnapshot = await getDocs(shopRef);

      // Check if any documents with the given name exist
      if (shopSnapshot.size > 0) {
        dispatch(
          openScackbar({
            open: true,
            type: "warning",
            msg: "This name already Created",
          })
        );
      } else {
        const s = await addDoc(collection(db, "Shop"), {
          Name: shopName,
          Category: [],
        });
        await updateDoc(s, {
          Shop_id: s.id,
        }).then(async () => {
          const userRef = doc(db, "Users", uid);
          const docRef = await addDoc(
            collection(db, `Users/${uid}/Accessible_shop/`),
            {
              Name: shopName,
              Shop_id: s.id,
            }
          );

          dispatch(
            openScackbar({
              open: true,
              type: "success",
              msg: "Shop Created",
            })
          );
        });
      }
    } else {
      dispatch(
        openScackbar({
          open: true,
          type: "error",
          msg: "Enter Shop Name",
        })
      );
    }
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <FormControl variant="standard">
        <InputLabel htmlFor="input-with-icon-adornment">Shop Name</InputLabel>
        <Input
          onChange={(e) => setShopName(e.target.value)}
          id="input-with-icon-adornment"
          startAdornment={
            <InputAdornment position="start">
              <AddBusinessIcon className="text-greendark" />
            </InputAdornment>
          }
        />
      </FormControl>
      <button
        onClick={registerShop}
        className="bg-mygreen px-4 py-2 font-semibold my-2"
      >
        Create Shop
      </button>
    </div>
  );
}
