import { Paper, Typography } from "@mui/material";
import AnimateRoute from "../Navigations/AnimateRoute";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import EmpSaleChart from "./EmpSaleChart";
export default function Employees() {
  const [users, setUsrs] = useState([]);
  const [loading, setloading] = useState(true);
  const [shopAcess, setShopAcess] = useState([]);
  const ALL_SHOPS = useSelector((state) => state.all_shop.ALL_SHOPS);

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

  return (
    <AnimateRoute>
      <div>
        <div className="flex md:flex-row flex-col items-center justify-center mt-8">
          {users.map((e) => (
            <Paper elevation={1} className=" p-2 flex m-2">
              <div>
                <img
                  style={{ borderRadius: "50%" }}
                  alt="avatar"
                  src={e["Img"]}
                  loading="lazy"
                  className="w-14 h-14 object-cover bg-center border-rad rounded-s-full mr-2 "
                />
                <Typography variant="subtitle1">{e["Name"]}</Typography>
              </div>
              <div>
                <div className="flex "></div>
                <EmpSaleChart />
              </div>
            </Paper>
          ))}
        </div>
      </div>
    </AnimateRoute>
  );
}
