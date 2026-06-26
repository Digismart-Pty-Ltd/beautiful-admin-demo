import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDDBixfjibs_YCXqcq7afvYRcDN95_QqRE",
  authDomain: "wavenharperfitness-app.firebaseapp.com",
  projectId: "wavenharperfitness-app",
  storageBucket: "wavenharperfitness-app.firebasestorage.app",
  messagingSenderId: "758777495621",
  appId: "1:758777495621:web:56252e64f1e8b94643a32c",
  measurementId: "G-MXDE9F0YYG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

