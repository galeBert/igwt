import { db } from "@/lib/firebase";

import { sha512 } from "js-sha512";
import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const transaction = await req.json();
    const { order_id, status_code, gross_amount, signature_key } = transaction;
    const hashed = sha512(
      `${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`
    );
    if (hashed === signature_key) {
      await setDoc(doc(db, "transactions", order_id), transaction);
    }

    return NextResponse.json(transaction);
  } catch (error) {
    return new NextResponse(null);
  }
}
