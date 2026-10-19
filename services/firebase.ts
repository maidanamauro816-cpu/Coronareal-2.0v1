import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCHL_QMm60jDnChDVIUjckhxi2hc57zfqM",
  authDomain: "coronareal2v1.firebaseapp.com",
  projectId: "coronareal2v1",
  storageBucket: "coronareal2v1.firebasestorage.app",
  messagingSenderId: "180396928287",
  appId: "1:180396928287:android:d92bed3f0130969012d42a",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let authInstance;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const db = getFirestore(app);