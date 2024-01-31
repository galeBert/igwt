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

      const token = header.split(" ")[1];

      admin
        .auth()
        .verifyIdToken(token)
        .then((decodedToken: any) => {
          clerkClient.users
            .createUser({
              emailAddress: [decodedToken.email ?? ""],
            })
            .then(async (dataclerk) => {
              const { id } = dataclerk;

              const transactionRef = doc(db, "user", id);
              console.log("clerk jalan", dataclerk);

              await setDoc(transactionRef, {
                email: decodedToken.email,
              });
            })
            .catch((error) => console.log("clerk error", error));
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
