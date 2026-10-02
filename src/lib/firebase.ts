import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBFjjxE5fhAgX-bK_-BeFliUO2V0v_5SRQ",
  authDomain: "jeeprep-a5262.firebaseapp.com",
  projectId: "jeeprep-a5262",
  storageBucket: "jeeprep-a5262.firebasestorage.app",
  messagingSenderId: "561222521164",
  appId: "1:561222521164:web:9027539f986036e4e5bfe9",
  measurementId: "G-7TGQC91RHY"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
