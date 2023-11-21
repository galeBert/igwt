import EmailTemplate from "@/components/email-template";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request, res: NextApiResponse) {
  try {
    const body = await req.json();
    const {
      inviteLink,
      productName,
      recieverName,
      recieverEmail,
      senderEmail,
      senderName,
    } = body;
    if (
      inviteLink &&
      productName &&
      recieverEmail &&
      recieverName &&
      senderName &&
      senderEmail
    ) {
      const data = await resend.emails.send({
        from: "albert@igwt.space",
        to: [recieverEmail],
        subject: `Join ${senderEmail} on IGWT`,
        react: EmailTemplate({
          inviteLink,
          productName,
          recieverName,
          senderEmail,
          senderName,
        }),
      });

      return NextResponse.json(data);
    }
    return NextResponse.json(null);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error });
  }
}
