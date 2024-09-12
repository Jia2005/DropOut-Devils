import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getStorage} from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCnVmXlBwbaRnbtGmsj8PutiYwjJIBHIRI",
  authDomain: "studyee-faba1.firebaseapp.com",
  projectId: "studyee-faba1",
  storageBucket: "studyee-faba1.appspot.com",
  messagingSenderId: "684365296242",
  appId: "1:684365296242:web:99d82173ee44f7c77988eb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage=getStorage(app);
export {app,db,storage,auth};