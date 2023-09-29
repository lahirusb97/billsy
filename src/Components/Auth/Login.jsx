import { useState, useRef, useEffect } from "react";
//UI
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
//Icons
import LockIcon from "@mui/icons-material/Lock";
import { Password, Person } from "@mui/icons-material";
//Other
import { motion } from "framer-motion";
//Firebase
import "../firebaseConfig";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
//animations
import Lottie from "react-lottie";
import LoginAni from "../../assets/Animations/LoginAni.json";
import LoadingAni from "../../assets/Animations/LoadingAni.json";
//Imgs
import bgimg from "../../assets/Images/bgimg.jpg";
import useWindowDimensions from "../ViewPortSize";
import PasswordRestDialog from "./PasswordRestDialog";
//Redux
import { useDispatch } from "react-redux";
import { setuserData } from "../../Store/Slices/userDataSlice";
//* Firebase
import { doc, onSnapshot, getFirestore } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AnimateRoute from "../Navigations/AnimateRoute";
import { CircularProgress, Paper, Typography, makeStyles } from "@mui/material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { height, width } = useWindowDimensions();
  const [loginWidth, setloginWidth] = useState();
  const [loginHeight, setloginHeight] = useState();
  const [error, setError] = useState("none");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  //Redux
  const dispatch = useDispatch();

  //todo: Window Height

  //todo: Window Height

  const forgotPS = () => {
    setOpen(true);
  };

  //*! get auth and user data
  const singinUser = () => {
    setLoading(true);
    const auth = getAuth();

    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            const db = getFirestore();
            onSnapshot(doc(db, "Users", user.uid), (doc) => {
              if (doc.exists()) {
                const data = doc.data();
                dispatch(setuserData({ user: data, auth: user.uid }));
                navigate("/");
              }
            });
            setLoading(false);
            setError("none");
            // ...
          })
          .catch((error) => {
            setLoading(false);

            const errorCode = error.code;

            if (errorCode === "auth/wrong-password") {
              setError("password");
            } else if (errorCode === "auth/user-not-found") {
              setError("email");
            } else {
              setError("network ");
            }
          });
      })
      .catch(() => {
        // Handle Errors here.
      });
  };
  //*! get auth and user data

  //todo lottie Animations
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoginAni,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const LoadingOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAni,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <AnimateRoute>
      <div className="flex justify-center items-center h-screen">
        <Paper
          className="flex items-center md:flex-row flex-col"
          sx={{
            width: width < 768 ? width - 20 : width - 50,
            height: width < 768 ? "auto" : height - 50,
          }}
          elevation={4}
        >
          <div
            style={{
              width: width < 768 ? width - 50 : width / 2 - 50,
              height: width < 768 ? "auto" : height - 50,
              background: "black",
            }}
            className=" flex items-center justify-center"
          >
            <img src="./images/bestway.png" />
          </div>

          <div className="md:m-auto flex flex-col">
            <Typography
              color={"primary.dark"}
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                fontSize: width < 426 ? "1.5rem" : "3rem",
                marginTop: "1rem",
              }}
              variant="h3"
              component="h3"
            >
              Welcome back !
            </Typography>
            <Typography
              sx={{ textAlign: "center" }}
              color={"primary.dark"}
              variant="subtitle1"
              component="h3"
            >
              Please enter your details.
            </Typography>
            <FormControl sx={{ marginTop: "2rem" }} variant="standard">
              <InputLabel htmlFor="input-with-icon-adornment">Email</InputLabel>
              <Input
                error={error === "email" ? true : false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                id="input-with-icon-adornment"
                type="email"
                startAdornment={
                  <InputAdornment position="start">
                    <Person className="text-myblue" />
                  </InputAdornment>
                }
              />
            </FormControl>
            <p className="text-myred font-bold italic">
              {error === "email" ? "Invalid Email" : ""}
            </p>
            <FormControl
              sx={{
                marginTop: "1rem",
                width: width < 768 ? width - 50 : "auto",
              }}
              variant="standard"
            >
              <InputLabel htmlFor="input-with-icon-adornment">
                Password
              </InputLabel>
              <Input
                error={error === "password" ? true : false}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                id="input-with-icon-adornment"
                type="Password"
                startAdornment={
                  <InputAdornment position="start">
                    <Password className="text-myblue" />
                  </InputAdornment>
                }
              />
            </FormControl>
            <p className="text-myred font-bold italic">
              {error === "password" ? "Invalid Email" : ""}
            </p>
            <a
              onClick={forgotPS}
              href="#"
              className={`text-myred font-semibold mt-4 ${
                loading ? "invisible" : "visible"
              }`}
            >
              Forgot Password ?
            </a>
            {loading ? (
              <div className="m-auto my-2 ">
                <CircularProgress size={60} />
              </div>
            ) : (
              <motion.button
                onClick={singinUser}
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-mybluedark font-semibold text-mywhite md:py-4 py-2 w-full hover:bg-myblue mt-4 mb-2"
              >
                Login
              </motion.button>
            )}
          </div>

          <PasswordRestDialog
            inputemail={email}
            open={open}
            setOpen={setOpen}
          />
        </Paper>
      </div>
    </AnimateRoute>
  );
}
