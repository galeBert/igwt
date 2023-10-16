// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING,
  appId: process.env.FIREBASE_APP_ID,
};
// const firebaseConfig = {
//   apiKey: "AIzaSyAl8pvx3PyGbTx--2X3-e5uU5iTNWhC15s",
//   authDomain: "igwt-3b1a7.firebaseapp.com",
//   projectId: "igwt-3b1a7",
//   storageBucket: "igwt-3b1a7.appspot.com",
//   messagingSenderId: "34401954376",
//   appId: "1:34401954376:web:837a37854660c2fe88c67d",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
