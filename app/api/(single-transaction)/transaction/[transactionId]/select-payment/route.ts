import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { transactionId: string } }
) {
  try {
    if (!params.transactionId) {
      return new NextResponse("transaction id is required", { status: 400 });
    }
    const transactionRef = doc(db, "transactions", params.transactionId);

    const singleTransaction = await (await getDoc(transactionRef)).data();
    if (singleTransaction) {
      return NextResponse.json(singleTransaction);
    }
    return NextResponse.json(null);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { transactionId: string } }
) {
  try {
    const body = await req.json();
    console.log(body);

    const { ...rest } = body;

    const transactionRef = doc(db, "transactions", params.transactionId);
    console.log(transactionRef.id);

    await updateDoc(transactionRef, rest);
    return NextResponse.json(rest);
  } catch (error: any) {
    console.log(console.log(error));

    return NextResponse.json({ error }, { status: 500 });
  }
}
