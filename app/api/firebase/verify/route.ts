import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { getIdToken } from "firebase/auth";

// import { cert, getApps, initializeApp } from "firebase-admin/app";
import * as admin from "firebase-admin";
import { clerkClient } from "@clerk/nextjs";
// // Your web app's Firebase configuration

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
// admin.initializeApp(firebaseAdminConfig);
export async function POST(req: Request, res: NextApiResponse) {
  try {
    const a = headers().get("authorization");
    if (a) {
      admin
        .auth()
        .verifyIdToken(
          "eyJhbGciOiJSUzI1NiIsImtpZCI6IjBiYmQyOTllODU2MmU3MmYyZThkN2YwMTliYTdiZjAxMWFlZjU1Y2EiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vaWd3dC0zYjFhNyIsImF1ZCI6Imlnd3QtM2IxYTciLCJhdXRoX3RpbWUiOjE3MDE2MTU5NjQsInVzZXJfaWQiOiI5RDVxYjZxRnZ3aEp0QXp3TVpkcldadkVXQWoyIiwic3ViIjoiOUQ1cWI2cUZ2d2hKdEF6d01aZHJXWnZFV0FqMiIsImlhdCI6MTcwMTYxNTk2NCwiZXhwIjoxNzAxNjE5NTY0LCJlbWFpbCI6InRlc3QxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ0ZXN0MUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.eHOKYvxW6Dt2oTkS1A5pq2RRl0alXFIS60AR-Kw0wE6C-0lJ6VPQqXL9MZqykypnhgdL1L0J3D5kr64ZfAhc_H4pVPdhDYpAvYOEYagtDpxDHiseTqUniu5w9vCeU5kcjMKU3A3nq49VxHjG9nEJWuqoEnzLyHR6mflG4YZAeEInfBIjTK9Qa7NWkiQnsW-nVb9M5gVolcKAg8sHfR8AGXM2s6Hy-9QnN5hRHt9xfGUef-pvK85P6AHsIFRnwrNA2K-G42KJdgcdARR8N0-q2yozNVIO7sdeXOB5qha2dkLX_XjIKyCPMncFYQpU6b5OqjgwNIXk1IHwP2Zla_lVTw"
        )
        .then((decodedToken) => {
          const uid = decodedToken.uid;
          console.log("asdsaddassadsa", uid, decodedToken);
          clerkClient.users
            .createUser({
              emailAddress: [decodedToken.email ?? ""],
            })
            .then((dataclerk) => console.log(dataclerk));
        })
        .catch((error) => {
          console.log("asdsaddsa", error);
        });
    }

    return NextResponse.json(a);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error });
  }
}
