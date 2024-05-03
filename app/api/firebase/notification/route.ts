import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { Auth } from "googleapis";
import messageKey from "@/message.json";
import axios from "axios";
export async function POST(req: Request, res: NextApiResponse) {
  try {
    const body = await req.json();
    const { message, title, data, token } = body;

    const MESSAGING_SCOPE =
      "https://www.googleapis.com/auth/firebase.messaging";
    const SCOPES = [MESSAGING_SCOPE];

    // const getAccessToken = async () => {
    //   return await new Promise(function (resolve, reject) {
    //     const jwtClient = new Auth.JWT(
    //       messageKey.client_email,
    //       undefined,
    //       messageKey.private_key,
    //       SCOPES,
    //       undefined
    //     );

    //     return jwtClient.authorize(function (err, tokens) {
    //       if (err) {
    //         reject(err);
    //         return;
    //       }
    //       return resolve(tokens?.access_token);
    //     });
    //   });
    // };

    const jwtClient = new Auth.JWT(
      messageKey.client_email,
      undefined,
      messageKey.private_key,
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

    return NextResponse.json({ result });
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
