import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAC1uD_K87Uo_yeMguJ0hsuYpZAscuSj8Y",
  authDomain: "billing-d8390.firebaseapp.com",
  databaseURL:
    "https://billing-d8390-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "billing-d8390",
  storageBucket: "billing-d8390.appspot.com",
  messagingSenderId: "263017367167",
  appId: "1:263017367167:web:aae570a2ae3a19c98c614a",
  measurementId: "G-LH0D5HB5XX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);
