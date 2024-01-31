// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { cert, getApps } from "firebase-admin/app";
import * as admin from "firebase-admin";
import { auth } from "firebase-admin";
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
// Function to initialize the Firebase Admin SDK if not already initialized
// export const initializeFirebaseAdmin = () => {
//   const test2 = getApps();
//   const test = admin.app("igwt-admin-app2").appCheck().app.name;
//   console.log("test12312312312", test, "aaasasdasdasd", test2);

//   if (admin.apps.length == 1) {
//     return admin.initializeApp(firebaseAdminConfig, "igwt-admin-app2");
//   }
//   return admin.app("igwt-admin-app2");
// };
export const initializeFirebaseAdmin = () => {
  console.log(admin.apps.length);

  if (!admin.apps.length) {
    return admin.initializeApp(firebaseAdminConfig, "igwt-admin");
  }
  return admin.app("igwt-admin");
};

// Export the initialized Firebase Admin instance
// export const getFirebaseAdminInstance = () => {
//   if (!adminInstance) {
//     throw new Error("Firebase Admin SDK is not initialized.");
//   }
//   return adminInstance;
// };

// Initialize Firebase
// const _admin = admin.initializeApp(firebaseAdminConfig, "igwt-admin");
// const adminAuth = auth(_admin);
// export { adminAuth };
