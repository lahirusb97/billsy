import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Route, Routes } from "react-router-dom";
//LOAD COMPONENT
import Login from "./Components/Auth/Login";
import NavBar from "./Components/Navigations/NavBar";
//FIREBASE
import { doc, onSnapshot, getFirestore } from "firebase/firestore";
//Redux
import { useSelector, useDispatch } from "react-redux";
import { setuserData } from "./Store/Slices/userDataSlice";
import LoginProtectedRoute from "./Components/Navigations/LoginProtectedRoute";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      const db = getFirestore();
      const unsub = onSnapshot(doc(db, "Users", user.uid), (doc) => {
        if (doc.exists()) {
          dispatch(setuserData({ user: doc.data(), auth: user.uid }));
        }
      });
    });
  }, []);
  return (
    <div>
      <Routes>
        <Route element={<LoginProtectedRoute />}>
          <Route path="*" element={<NavBar />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
