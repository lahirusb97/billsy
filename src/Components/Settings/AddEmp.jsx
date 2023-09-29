import {
  CheckBox,
  Email,
  Password,
  Person,
  PhoneAndroid,
} from "@mui/icons-material";
import {
  Button,
  Container,
  FormControl,
  FormControlLabel,
  Input,
  InputAdornment,
  InputLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
export default function AddEmp() {
  const ALL_SHOPS = useSelector((state) => state.all_shop.ALL_SHOPS);

  const [imageUrl, setImageUrl] = React.useState(null);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [empName, setEmpName] = React.useState("");
  const [allowShops, setallowShops] = React.useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      // Create a new image element to hold the uploaded image
      const img = new Image();
      img.onload = () => {
        // Create a canvas element to resize the image
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 200; // Set the maximum width you want for the image
        const MAX_HEIGHT = 200; // Set the maximum height you want for the image
        let width = img.width;
        let height = img.height;

        // Check if resizing is necessary
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          // Calculate the new width and height while preserving the aspect ratio
          if (width > height) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          } else {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        // Set the canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw the image on the canvas
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Get the resized image data URL and update the state
        const resizedImageUrl = canvas.toDataURL(file.type);
        setImageUrl(resizedImageUrl);
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };
  const addnewEmp = async () => {
    if (
      email.length > 5 &&
      password.length > 6 &&
      imageUrl &&
      empName.length > 2 &&
      mobile.length === 10 &&
      allowShops.length > 0
    ) {
      try {
        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const db = getFirestore();

        // Create user document
        await setDoc(doc(db, "Users", user.uid), {
          Access: true,
          Admin: false,
          Name: empName,
          Email: email,
          Stock_manage: true,
        });

        // Create "Accessible_shop" subcollection and add documents
        const employeeDataCollectionRef = collection(
          db,
          "Users",
          user.uid,
          "Accessible_shop"
        );
        await Promise.all(
          allowShops.map(async (e) => {
            await addDoc(employeeDataCollectionRef, {
              Name: e["Name"],
              Shop_id: e["Shop_id"],
            });
          })
        );

        console.log("Employee added successfully");
      } catch (error) {
        console.error("Error adding employee:", error);
      }
    } else {
      console.log("Invalid data");
    }
  };

  return (
    <div>
      <Paper
        sx={{ width: "400px", marginLeft: "1rem", marginTop: ".5rem" }}
        elevation={2}
        variant="elevation  "
      >
        <div className="flex flex-col max-w-sm p-4">
          <div className="self-center">
            <Typography variant="h6">Add New Employee</Typography>
            <div className="flex justify-center mb-2">
              <Stack direction="column">
                {imageUrl ? (
                  <img
                    style={{
                      borderRadius: "50%",
                      width: "6rem",
                      height: "6rem",
                      objectFit: "cover",
                    }}
                    src={imageUrl}
                    alt="Uploaded Image"
                    className="w-52 bg-center"
                  />
                ) : (
                  <img
                    style={{
                      borderRadius: "50%",
                      width: "6rem",
                      height: "6rem",
                      objectFit: "cover",
                    }}
                    src={
                      "https://firebasestorage.googleapis.com/v0/b/billing-d8390.appspot.com/o/Customers%2Fprofile.png?alt=media&token=e28e8762-1005-41d3-9a51-1dbe08f3a7b1"
                    }
                    alt="Uploaded Image"
                    className="w-52 bg-center"
                  />
                )}
                <label htmlFor="upload-image">
                  <Button variant="contained" component="span">
                    Upload
                  </Button>
                  <input
                    id="upload-image"
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleFileUpload}
                  />
                </label>
              </Stack>
            </div>
          </div>
          <div className="flex flex-col">
            <FormControl variant="standard">
              <InputLabel htmlFor="input-with-icon-adornment">
                Employe Name
              </InputLabel>
              <Input
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                id="input-with-icon-adornment"
                startAdornment={
                  <InputAdornment position="start">
                    <PhoneAndroid />
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl sx={{ marginTop: "1rem" }} variant="standard">
              <InputLabel htmlFor="input-with-icon-adornment">
                Mobile Number
              </InputLabel>
              <Input
                type="number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                id="input-with-icon-adornment"
                startAdornment={
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl variant="standard" sx={{ margin: "1rem 0" }}>
              <InputLabel htmlFor="input-with-icon-adornment">Email</InputLabel>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="input-with-icon-adornment"
                startAdornment={
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl variant="standard">
              <InputLabel htmlFor="input-with-icon-adornment">
                Password
              </InputLabel>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="input-with-icon-adornment"
                startAdornment={
                  <InputAdornment position="start">
                    <Password />
                  </InputAdornment>
                }
              />
            </FormControl>

            {ALL_SHOPS.map((shop, i) => (
              <label>
                <input
                  className="scale-150 m-2"
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setallowShops([...allowShops, shop]);
                    } else {
                      setallowShops(
                        allowShops.filter(
                          (s) => s["Shop_id"] !== shop["Shop_id"]
                        )
                      );
                    }
                  }}
                />
                {shop["Name"]}
              </label>
            ))}
            <Button
              sx={{ margin: "1rem 0" }}
              onClick={addnewEmp}
              variant="contained"
            >
              Add
            </Button>
          </div>
        </div>
      </Paper>
    </div>
  );
}
