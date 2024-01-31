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
    console.log({ header });

    if (header) {
      const admin = initializeFirebaseAdmin();

      const token = header.split(" ")[1];

      const decodedToken = await admin.auth().verifyIdToken(token);

      const clerkUser = await clerkClient.users.createUser({
        emailAddress: [decodedToken.email ?? ""],
      });
      const { id } = clerkUser;

      const transactionRef = doc(db, "user", id);

      await setDoc(transactionRef, {
        email: decodedToken.email,
      });

      return NextResponse.json({ email: decodedToken.email });
    } else {
      throw Error("Unauthorized");
    }
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error });
  }
}
