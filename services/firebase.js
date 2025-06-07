import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  getReactNativePersistence,
  GoogleAuthProvider,
  initializeAuth,
} from "firebase/auth";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyDc1kSuoyw8d1GaEL_1JMhFQEVJYED5kA8",
  authDomain: "cookmaster07.firebaseapp.com",
  projectId: "cookmaster07",
  storageBucket: "cookmaster07.firebasestorage.app",
  messagingSenderId: "65924769556",
  appId: "1:65924769556:web:51df6e2972c9c924b98401",
  measurementId: "G-H30YB3ZLD1",
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();

const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

export { auth, provider };
