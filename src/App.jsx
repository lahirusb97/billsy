import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { Route, Routes } from "react-router-dom";
//LOAD COMPONENT
import Login from "./Components/Auth/Login";
import NavBar from "./Components/Navigations/NavBar";
//FIREBASE
import { doc, onSnapshot, getFirestore } from "firebase/firestore";
//Redux
import { useDispatch } from "react-redux";
import { setuserData } from "./Store/Slices/userDataSlice";
import LoginProtectedRoute from "./Components/Navigations/LoginProtectedRoute";
//ANIMATION
import LoadingAni from "./assets/Animations/LoadingAni.json";
import Lottie from "react-lottie";
import SnacBar from "./Components/Component/SnacBar";
import ConfirmModal from "./Components/Component/ConfirmModal";
//Router

function App() {
  const dispatch = useDispatch();

  const [login, setLogin] = useState(true);
  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        const db = getFirestore();
        onSnapshot(doc(db, "Users", user.uid), (doc) => {
          if (doc.exists()) {
            dispatch(setuserData({ user: doc.data(), auth: user.uid }));

            setLogin(false);
          } else {
            setLogin(true);

            dispatch(setuserData({ user: null, auth: user.null }));
          }
        });
      } else {
        setLogin(false);
      }
    });
  }, []);

  const LoadingOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAni,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div>
      {!login ? (
        <Routes>
          <Route element={<LoginProtectedRoute />}>
            <Route path="*" element={<NavBar />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div>
            <Lottie options={LoadingOptions} height={200} width={200} />

            <h1 className="relative flex justify-center -top-10">
              Loading....
            </h1>
          </div>
        </div>
      )}
      <SnacBar />
      <ConfirmModal />
    </div>
  );
}

export default App;
