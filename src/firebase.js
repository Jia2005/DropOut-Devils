// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnVmXlBwbaRnbtGmsj8PutiYwjJIBHIRI",
  authDomain: "studyee-faba1.firebaseapp.com",
  projectId: "studyee-faba1",
  storageBucket: "studyee-faba1.appspot.com",
  messagingSenderId: "684365296242",
  appId: "1:684365296242:web:99d82173ee44f7c77988eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;