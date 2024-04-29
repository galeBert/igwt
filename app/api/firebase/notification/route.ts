import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { clerkClient } from "@clerk/nextjs";
import { initializeFirebaseAdmin } from "@/lib/firebase-admin";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(req: Request, res: NextApiResponse) {
  try {
    // const header = headers().get("authorization");
    // console.log({ header });

    const admin = initializeFirebaseAdmin().messaging();
    let message = {};
    admin.send({
      notification: {
        body: "test",
        title: "Test Notification",
      },
      token:
        "fbW70EiFSKKfkEgP3yJJdV:APA91bHI8uYSXjGFYG2OUNiWBxUaG7ip1IxQStoxd21RisKaCMjteV-9nFkkwxUSXpC79Wp0QTbgeWLcL_9mIK1J2YtqUAsS1slEd3UDx-rHragrmrzLzlILxk8qHr_rvtPuJ9gtTRB0",
    });

    return NextResponse.json({ hello: "wolrd" });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error });
  }
}
