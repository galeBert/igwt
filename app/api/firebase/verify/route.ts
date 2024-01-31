import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { clerkClient } from "@clerk/nextjs";
import { initializeFirebaseAdmin } from "@/lib/firebase-admin";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const header = headers().get("authorization");
    if (header) {
      const admin = initializeFirebaseAdmin();
      console.log(header);

      const token = header.split(" ")[1];

      admin
        .auth()
        .verifyIdToken(token)
        .then((decodedToken: any) => {
          const uid = decodedToken.uid;
          clerkClient.users
            .createUser({
              emailAddress: [decodedToken.email ?? ""],
            })
            .then(async (dataclerk) => {
              const { id } = dataclerk;

              const transactionRef = doc(db, "user", id);

              await setDoc(transactionRef, {
                email: decodedToken.email,
              });
            });
        })
        .catch((error: any) => {
          console.log("asdsaddsa", error);
        });
    }

    return NextResponse.json(header);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error });
  }
}
