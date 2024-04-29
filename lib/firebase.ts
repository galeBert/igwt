// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, QueryDocumentSnapshot } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// const firebaseAdminConfig = {
//   credential: cert({
//     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//     clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
//     privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY
//       ? process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
//       : undefined,
//   }),
// };

// Initialize Firebase
const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as T,
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const _admin = admin.initializeApp(firebaseAdminConfig, "igwt-admin");

const db = getFirestore(app);
const messaging = getFirestore(app);

export { db, converter, messaging };
