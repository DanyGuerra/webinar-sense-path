import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//

const firebaseConfig = {
  apiKey: "AIzaSyAwmN595qUOukzDcBGkjjMmFsG9B3Q-Sdg",
  authDomain: "sense-path-webinar.firebaseapp.com",
  projectId: "sense-path-webinar",
  storageBucket: "sense-path-webinar.appspot.com",
  messagingSenderId: "947965647958",
  appId: "1:947965647958:web:0d74fbb42a7400c17baff7",
  measurementId: "G-ZESMXD0578",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore();
