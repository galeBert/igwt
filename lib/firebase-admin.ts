// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { cert, getApps, initializeApp } from "firebase-admin/app";
import * as admin from "firebase-admin";
// Your web app's Firebase configuration

const firebaseAdminConfig = {
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY
      ? process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
      : undefined,
  }),
};

// Initialize Firebase
admin.initializeApp(firebaseAdminConfig);
