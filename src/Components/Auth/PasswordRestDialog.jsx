import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
//
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { Person } from "@mui/icons-material";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
export default function PasswordRestDialog({ inputemail, open, setOpen }) {
  const [email, setEmail] = useState(inputemail);
  const [error, setError] = useState("none");

  console.log(open);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const resetPs = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Password reset email sent successfully");
        handleClose();
      })
      .catch((error) => {
        console.log("Error sending password reset email:", error);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Use Google's location service?"}
      </DialogTitle>
      <DialogContent>
        <FormControl variant="standard">
          <InputLabel htmlFor="input-with-icon-adornment">Email</InputLabel>
          <Input
            error={error === "email" ? true : false}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            id="input-with-icon-adornment"
            type="email"
            className="w-96"
            startAdornment={
              <InputAdornment position="start">
                <Person className="text-myblue" />
              </InputAdornment>
            }
          />
        </FormControl>
        <p className="text-myred font-bold italic">
          {error === "fail"
            ? "Invalid Email"
            : error === "pass"
            ? `${email} Check Inbox`
            : ""}
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
        <Button onClick={resetPs} autoFocus>
          Reset Password
        </Button>
      </DialogActions>
    </Dialog>
  );
}
