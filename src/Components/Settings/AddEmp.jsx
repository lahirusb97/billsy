import { Person, PhoneAndroid } from "@mui/icons-material";
import {
  Button,
  Container,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";

export default function AddEmp() {
  const [imageUrl, setImageUrl] = React.useState(null);

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
  return (
    <div>
      <div className="flex flex-col max-w-sm ">
        <div className="self-center">
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
        <div className="flex flex-col">
          <FormControl variant="standard">
            <InputLabel htmlFor="input-with-icon-adornment">
              Mobile Number
            </InputLabel>
            <Input
              id="input-with-icon-adornment"
              startAdornment={
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl variant="standard">
            <InputLabel htmlFor="input-with-icon-adornment">
              Employe Name
            </InputLabel>
            <Input
              id="input-with-icon-adornment"
              startAdornment={
                <InputAdornment position="start">
                  <PhoneAndroid />
                </InputAdornment>
              }
            />
          </FormControl>
          <Button  variant="contained">
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
