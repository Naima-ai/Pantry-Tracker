// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGRsAPAU2bk1ui0oicDBSWBFcEaRjQPBk",
  authDomain: "hspantryapp-72964.firebaseapp.com",
  projectId: "hspantryapp-72964",
  storageBucket: "hspantryapp-72964.appspot.com",
  messagingSenderId: "657766695651",
  appId: "1:657766695651:web:bb8f8624a87b960f017bd6",
  measurementId: "G-X02FHYJ7NM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
export {app, firestore};