import { Button, CircularProgress, Paper, Typography } from "@mui/material";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openScackbar } from "../../Store/Slices/SnackBarSlice";

export default function EmpList() {
  const [users, setUsrs] = useState([]);
  const [loading, setloading] = useState(true);
  const [shopAcess, setShopAcess] = useState([]);
  const ALL_SHOPS = useSelector((state) => state.all_shop.ALL_SHOPS);

  const dispatch = useDispatch();
  useEffect(() => {
    const getdata = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "Users"));
      const shopLi = [];

      const fetchAccessShops = async (userId) => {
        const accessShopsQuerySnapshot = await getDocs(
          collection(db, "Users", userId, "Accessible_shop")
        );
        const accessShops = accessShopsQuerySnapshot.docs.map(
          (accessShopDoc) => {
            const accessShopData = accessShopDoc.data();
            // Include the doc.id in the access shop data
            return { ...accessShopData, Id: accessShopDoc.id };
          }
        );
        return accessShops;
      };

      const userPromises = querySnapshot.docs
        .filter((doc) => !doc.data()["Admin"])
        .map(async (doc) => {
          const userData = doc.data();
          const userId = doc.id;
          const accessShops = await fetchAccessShops(userId);

          return { ...userData, Id: userId, access_shops: accessShops };
        });

      const usersData = await Promise.all(userPromises);
      shopLi.push(...usersData);

      setUsrs(shopLi);
      setloading(false);
    };
    getdata();
  }, []);

  const handleSave = () => {
    users.forEach(async (e) => {
      const db = getFirestore();
      const docRef = doc(db, "Users", e["Id"]);
      await updateDoc(docRef, {
        Access: e["Access"],
        Stock_manage: e["Stock_manage"],
      })
        .then(() => {
          dispatch(
            openScackbar({
              open: true,
              type: "success",
              msg: "saved",
            })
          );
        })
        .catch((e) =>
          dispatch(
            openScackbar({
              open: true,
              type: "error",
              msg: "Error Check your internet conection",
            })
          )
        );
    });
  };

  return (
    <div className=" ml-2">
      <Paper elevation={2}>
        {loading ? (
          <CircularProgress />
        ) : (
          users.map((e, i) => (
            <div className="p-4">
              <div className="flex px-2 items-baseline bg-mybluedark text-mymainbg">
                <Typography variant="h6">{e["Name"]}</Typography>
                <Typography sx={{ padding: "0 0.2rem" }} variant="caption">
                  {e["Admin"] ? "Admin" : "Employe"}
                </Typography>
              </div>
              <div className="flex flex-col my-4">
                <label className="font-semibold">
                  Allow Stock Manage{" "}
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const updatedUsers = [...users];
                      updatedUsers[i].Stock_manage = e.target.checked;
                      setUsrs(updatedUsers);
                      console.log(users[i]);
                    }}
                    defaultChecked={e["Stock_manage"]}
                  />
                </label>
                <label className="font-semibold">
                  Allow Access{" "}
                  <input
                    onChange={(e) => {
                      const updatedUsers = [...users];
                      updatedUsers[i].Access = e.target.checked;
                      setUsrs(updatedUsers);
                    }}
                    type="checkbox"
                    defaultChecked={e["Access"]}
                  />
                </label>
              </div>
              <div>
                {ALL_SHOPS.map((shop, index) => (
                  <label className="font-semibold bg-grayLite2 p-2">
                    <input
                      className="scale-150 m-2"
                      type="checkbox"
                      defaultChecked={users[i]["access_shops"].some(
                        (accessShop) =>
                          accessShop["Shop_id"] === shop["Shop_id"]
                      )}
                      onChange={async (e) => {
                        if (!e.target.checked) {
                          const db = getFirestore();
                          await deleteDoc(
                            doc(
                              db,
                              "Users",
                              users[i]["Id"],
                              "Accessible_shop",
                              users[i]["access_shops"][index]["Id"]
                            )
                          );
                        } else {
                          const db = getFirestore();

                          const docRef = await addDoc(
                            collection(
                              db,
                              "Users",
                              users[i]["Id"],
                              "Accessible_shop"
                            ),
                            {
                              Name: shop["Name"],
                              Shop_id: shop["Shop_id"],
                            }
                          );
                        }
                      }}
                    />
                    {shop["Name"]}
                  </label>
                ))}
              </div>
            </div>
          ))
        )}
        <Button className="w-full" onClick={handleSave} variant="contained">
          Save
        </Button>
      </Paper>
    </div>
  );
}
