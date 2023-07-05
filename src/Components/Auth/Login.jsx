import { useState, useRef, useEffect } from "react";
//UI
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
//Icons
import mainIng from "../../assets/Images/mainimg.png";
import LockIcon from "@mui/icons-material/Lock";
import { Password, Person } from "@mui/icons-material";
//Other
import { motion } from "framer-motion";
//Firebase
import "../firebaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { CircularProgress } from "@mui/material";
//animations
import Lottie from "react-lottie";
import LoginAni from "../../assets/Animations/LoginAni.json";
import LoadingAni from "../../assets/Animations/LoadingAni.json";
//Imgs
import bgimg from "../../assets/Images/bgimg.jpg";
import useWindowDimensions from "../ViewPortSize";

export default function Login() {
  const [email, setEmail] = useState("lahirushirant@gmail.com");
  const [password, setPassword] = useState("qwertyu");
  const [loading, setLoading] = useState(true);
  const loginRef = useRef(null);
  const { height, width } = useWindowDimensions();
  const [loginWidth, setloginWidth] = useState();
  const [loginHeight, setloginHeight] = useState();

  useEffect(() => {
    // setloginWidth(loginRef.current.offsetWidth);
    // setloginHeight(loginRef.current.offsetHeight);
  }, [width, height]);

  const forgotPS = () => {
    console.log(width);
  };
  const singinUser = () => {
    setLoading(true);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        setLoading(false);

        // ...
      })
      .catch((error) => {
        setLoading(false);

        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/wrong-password") {
          console.log("Invalid password");
        } else if (errorCode === "auth/user-not-found") {
          console.log("User not found");
        } else {
          console.log(errorMessage);
        }
      });
  };
  //Animations
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
    <div className="w-full h-screen flex justify-center items-center max-w-screen-xl m-auto">
      <img
        className="absolute w-full h-screen object-cover bg-center opacity-50"
        src={bgimg}
      />
      <div className="border-2 p-4 sm:w-1/2 w-full sm:h-auto h-screen bg-mywhite bg-opacity-75 backdrop-blur-sm flex flex-col justify-center relative z-50 ">
        <div className="flex item- justify-center items-center flex-col">
          <LockIcon />
          <h1 className="text-2xl text-mybluedark font-semibold">Sing In</h1>
          <Lottie options={defaultOptions} height={200} width={200} />
        </div>
        {loading ? (
          <Lottie
            options={LoadingOptions}
            height={loginHeight}
            width={loginWidth}
          />
        ) : (
          <div ref={loginRef} className="flex flex-col ">
            <FormControl variant="standard">
              <InputLabel htmlFor="input-with-icon-adornment">Email</InputLabel>
              <Input
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
            <FormControl style={{ marginTop: "2rem" }} variant="standard">
              <InputLabel htmlFor="input-with-icon-adornment">
                Password
              </InputLabel>
              <Input
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
            <a
              onClick={forgotPS}
              href="#"
              className="text-myred font-semibold my-8"
            >
              Forgot Password ?
            </a>

            <motion.button
              onClick={singinUser}
              whileHover={{ scale: 1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-mybluedark font-semibold text-mywhite py-4 w-full hover:bg-myblue mt-4"
            >
              Login
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}