import { Button, Divider, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { useTheme } from "@emotion/react";
export default function Accounting() {
  const [users, setUsrs] = useState([]);
  const [loading, setloading] = useState(true);

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
  console.log(users);
  return (
    <div className="flex items-center justify-center">
      <Paper sx={{ padding: "0.5rem" }} elevation={1} variant="elevation">
        <Typography variant="h5">Today Report</Typography>
        <div className="flex">
          <Typography variant="subtitle1">Total Revenu</Typography>
          <Typography variant="subtitle1">RS: 1000</Typography>
        </div>
        <div className="flex">
          <Typography variant="subtitle1">Total Cost</Typography>
          <Typography variant="subtitle1">RS: 800</Typography>
        </div>
        <Divider />
        <Typography sx={{ margin: "0.5rem 0" }} variant="subtitle1">
          Expencess
        </Typography>

        <div className="flex flex-col">
          <TextField label="Other" type="number" placeholder="0.00" />
          <TextField
            sx={{ margin: "0.5rem 0" }}
            label="Stock Buy"
            type="number"
            placeholder="0.00"
          />
        </div>
        <Divider />

        <Typography sx={{ margin: "0.5rem 0" }} variant="subtitle1">
          Sallery
        </Typography>
        <div>
          {users.map((e) => (
            <div>
              <Typography sx={{ margin: "0.5rem 0" }} variant="body1">
                {e["Name"]}
              </Typography>
              <TextField label="Amount" placeholder="00.00" />
            </div>
          ))}
        </div>
        <Button color="primary" variant="contained">
          Save
        </Button>
      </Paper>
    </div>
  );
}
