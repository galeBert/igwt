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
    const transactionRef = doc(db, "transactions", params.transactionId);

    const singleTransaction = await getDoc(transactionRef);

    if (singleTransaction.exists()) {
      const test: any = {
        ...singleTransaction.data(),
        id: singleTransaction.id,
      };
      if (typeof test === undefined) {
        return NextResponse.json(null);
      }
      return NextResponse.json(test);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { transactionId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();

    const { transactionId, ...rest } = body;

    const transactionRef = doc(db, "transactions", transactionId);

    await updateDoc(transactionRef, rest);
    return NextResponse.json(rest);
  } catch (error: any) {
    console.log(error);
  }
}
