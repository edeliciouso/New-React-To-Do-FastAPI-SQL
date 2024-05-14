// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHPBEs3-dSNtLV0eKpXMF4wQ6QvkAdcrM",
  authDomain: "todolist-290f7.firebaseapp.com",
  projectId: "todolist-290f7",
  storageBucket: "todolist-290f7.appspot.com",
  messagingSenderId: "987383370700",
  appId: "1:987383370700:web:754b7f6f8d435474030369"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };