import { db } from "@/lib/firebase";

import { sha512 } from "js-sha512";
import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    // const transaction = await req.json();
    // const { order_id, status_code, gross_amount, signature_key } = transaction;
    // const hashed = sha512(
    //   `${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`
    // );
    // if (hashed === signature_key) {
    //   await setDoc(doc(db, "transactions", order_id), transaction);
    // }
    const data = await fetch(
      "https://api.biteship.com/v1/maps/areas?countries=ID",
      {
        headers: {
          Authorization:
            "biteship_test.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCBrdXJpciIsInVzZXJJZCI6IjY1MDNmZDNiMWI2NDI1MWNiOWQ5NmU4NiIsImlhdCI6MTY5NTkzMzYzOX0.sAGBBCynEHDzw1flpZFy7vsvFwg5jtIW_EIE-zdGmFs",
        },
      }
    );

    return NextResponse.json({ hell0: "world" }, { status: 200 });
  } catch (error) {
    return new NextResponse(null);
  }
}
