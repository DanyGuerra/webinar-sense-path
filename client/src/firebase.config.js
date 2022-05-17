import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3YbiO-MpYvCJP9ppg5NSTRP0nLZKmPyI",
  authDomain: "video-chat-e6b0e.firebaseapp.com",
  projectId: "video-chat-e6b0e",
  storageBucket: "video-chat-e6b0e.appspot.com",
  messagingSenderId: "643666471194",
  appId: "1:643666471194:web:1f4629d748f4661559e4a3",
  measurementId: "G-7M701C3GSS",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore();
