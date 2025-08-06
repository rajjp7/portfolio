import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFpJSXLTCX8PuH4iZxck7WqDJq0EA6jE4",
  authDomain: "rajjp7portofolio.firebaseapp.com",
  projectId: "rajjp7portofolio",
  storageBucket: "rajjp7portofolio.appspot.com", 
  messagingSenderId: "1031209335390",
  appId: "1:1031209335390:web:16c625fe963c9926e152cf",
  measurementId: "G-ES1LMKG8LM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
