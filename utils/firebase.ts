// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeFirestore, memoryLocalCache } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSIpLNlVfjJDId46EuYadP1fn1dii7nBk",
  authDomain: "delek-app.firebaseapp.com",
  projectId: "delek-app",
  storageBucket: "delek-app.appspot.com",
  messagingSenderId: "705869388128",
  appId: "1:705869388128:web:ce9d8c4a22f5fa303ba605"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = initializeFirestore(app, {localCache: memoryLocalCache()});
const auth = getAuth(app)

export { app, db, auth }