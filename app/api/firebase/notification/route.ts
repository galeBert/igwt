import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";

import { initializeFirebaseAdmin } from "@/lib/firebase-admin";

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const body = await req.json();
    const { message, title, data, token } = body;
    const admin = initializeFirebaseAdmin().messaging();

    return admin
      .send({
        notification: {
          body: message,
          title,
        },
        data,
        token,
      })
      .then((response) => NextResponse.json({ response }))
      .catch((error) => NextResponse.json({ error }));
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error });
  }
}
