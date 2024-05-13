import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { Auth } from "googleapis";
import axios from "axios";
import messageKey from "@/message.json";

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const body = await req.json();
    const { message, title, data, token } = body;
    const credential = JSON.parse(
      Buffer.from(process.env?.ENCODE_FCM_KEY ?? "", "base64").toString()
    );

    const MESSAGING_SCOPE =
      "https://www.googleapis.com/auth/firebase.messaging";
    const SCOPES = [MESSAGING_SCOPE];

    const jwtClient = new Auth.JWT(
      process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      undefined,
      credential.private_key,
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
  } catch (error) {
    console.log({ qqqqqq: error });

    return NextResponse.json({ error });
  }
}
