import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { Auth } from "googleapis";
import axios from "axios";
import messageKey from "@/message.json";

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const body = await req.json();
    const { message, title, data, token } = body;

    const MESSAGING_SCOPE =
      "https://www.googleapis.com/auth/firebase.messaging";
    const SCOPES = [MESSAGING_SCOPE];

    const jwtClient = new Auth.JWT(
      process.env.FIREBASE_CLIENT_EMAIL,
      undefined,
      process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
        : undefined,
      SCOPES,
      undefined
    );

    const oauthToken = await jwtClient.authorize();

    const result = await axios.post(
      "https://fcm.googleapis.com/v1/projects/igwt-3b1a7/messages:send",
      {
        message: {
          token,
          notification: {
            title: title ?? "IGWT",
            body: message,
          },
          data,
        },
      },
      { headers: { Authorization: `Bearer ${oauthToken.access_token}` } }
    );

    return NextResponse.json({ result: await result.data });
    // const admin = initializeFirebaseAdmin().messaging();

    // return admin
    //   .send({
    //     notification: {
    //       body: message,
    //       title,
    //     },
    //     data,
    //     token,
    //   })
    //   .then((response) => NextResponse.json({ response }))
    //   .catch((error) => NextResponse.json({ error }));
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error });
  }
}
