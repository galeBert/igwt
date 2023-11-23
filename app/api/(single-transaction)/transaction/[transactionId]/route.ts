import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Error from "next/error";
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
    // const { userId } = auth();

    // if (!userId) {
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }
    const body = await req.json();

    const { transactionId, ...rest } = body;

    const transactionRef = doc(db, "transactions", transactionId);

    await updateDoc(transactionRef, rest);
    return NextResponse.json(rest);
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
