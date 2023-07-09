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
//Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function PasswordRestDialog({ inputemail, open, setOpen }) {
  const [email, setEmail] = useState(inputemail);
  const [error, setError] = useState("none");

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
        toast.success(`${email} Check Your Email`, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        handleClose();
      })
      .catch((error) => {
        const errorCode = error.code;

        if (errorCode === "auth/user-not-found") {
          toast.error(`${email} Email not found`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        } else {
          toast.error(`${email} Check your internet`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Request Password Reset"}
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
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <ToastContainer />
    </div>
  );
}
