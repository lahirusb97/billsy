import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Container, InputAdornment, Stack, TextField } from "@mui/material";
import { AccountCircle, PhoneAndroid } from "@mui/icons-material";
import profileimg from "../../assets/Images/profile.png";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";

import {
  getDownloadURL,
  getStorage,
  ref as storeRef,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { useDispatch } from "react-redux";
import { openScackbar } from "../../Store/Slices/SnackBarSlice";

export default function AddCoustomerModal({ open, setOpen }) {
  const dispatch = useDispatch();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [imageUrl, setImageUrl] = React.useState(null);
  const [name, setName] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [mobileError, setMobileError] = React.useState(false);
  const [currentDateTime, setCurrentDateTime] = React.useState(
    new Date().getFullYear()
  );

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

  const newCoustomer = async () => {
    if (name.length > 0) {
      if (mobile.length === 10) {
        setMobileError(false);
        setMobileError(false);

        try {
          const db = getFirestore();
          const storage = getStorage();
          const querySnapshot = await getDocs(
            query(collection(db, "Coustomers"), where("Name", "==", name))
          );

          if (querySnapshot.empty) {
            //Step 1: Add a new customer document in Firestore
            const docRef = await addDoc(collection(db, "Coustomers"), {
              [currentDateTime]: {
                Bills: {},
              },
              Name: name,
              Mobile: mobile,
            });
            const ID = docRef.id;

            // Step 2: Upload the image to Firebase Storage
            if (imageUrl !== null) {
              const customerImagesRef = storeRef(storage, `Customers/${ID}/`);
              await uploadString(customerImagesRef, imageUrl, "data_url");
              const downloadURL = await getDownloadURL(customerImagesRef);

              updateDoc(docRef, {
                Img: downloadURL,
              });
              const Customers_mapRef = collection(db, "Customers_map");
              const documentRef = doc(Customers_mapRef, "List");

              const updatedFields = {
                Coustomers: {
                  [ID]: {
                    Img: downloadURL,
                    ID: ID,
                    Name: name,
                    Mobile: mobile,
                    Total: 0,
                    Cost: 0,
                  },
                },

                // Add other fields you want to update
              };

              await updateDoc(documentRef, updatedFields).then(() => {
                setImageUrl(null);
                setMobile("");
                setName("");
                setOpen(false);
                dispatch(
                  openScackbar({
                    open: true,
                    type: "success",
                    msg: "New Coustomer Added",
                  })
                );
              });
            } else {
              const URL =
                "https://firebasestorage.googleapis.com/v0/b/billing-d8390.appspot.com/o/Customers%2Fprofile.png?alt=media&token=e28e8762-1005-41d3-9a51-1dbe08f3a7b1";

              updateDoc(docRef, {
                Img: URL,
              });
              const Customers_mapRef = collection(db, "Customers_map");
              const documentRef = doc(Customers_mapRef, "List");

              const updatedFields = {
                Coustomers: {
                  [ID]: {
                    Img: URL,
                    ID: ID,
                    Name: name,
                    Mobile: mobile,
                    Total: 0,
                    Cost: 0,
                  },
                },

                // Add other fields you want to update
              };

              await updateDoc(documentRef, updatedFields).then(() => {
                setImageUrl(null);
                setMobile("");
                setName("");
                setOpen(false);
                dispatch(
                  openScackbar({
                    open: true,
                    type: "success",
                    msg: "New Coustomer Added",
                  })
                );
              });
            }
          } else {
            setNameError(true);
            dispatch(
              openScackbar({
                open: true,
                type: "error",
                msg: `${name} already Added change name`,
              })
            );
          }
        } catch (error) {
          dispatch(
            openScackbar({
              open: true,
              type: "error",
              msg: error,
            })
          );
        }
      } else {
        setMobileError(true);
      }
    } else {
      setNameError(true);
    }
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add New Coustomer</DialogTitle>
        <DialogContent>
          <div className="my-2 flex flex-col w-96">
            <Container maxWidth="md">
              <Stack direction="column" alignItems="center" spacing={2}>
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
            </Container>
            <TextField
              id="input-with-icon-textfield"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />
            <TextField
              style={{ margin: "1rem 0" }}
              id="input-with-icon-textfield"
              label="Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneAndroid />
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={newCoustomer} autoFocus>
            Add Coustomer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
