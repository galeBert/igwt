import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs";
import { doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { transactionId: string } }
) {
  try {
    const { userId } = auth();
    console.log("aaaa");

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    console.log("vbbbbb");

    const { transactionId, ...rest } = body;
    console.log(transactionId, rest);

    const transactionRef = doc(db, "transactions", transactionId);

    await updateDoc(transactionRef, rest);
    return NextResponse.json({ hello: "word" });
  } catch (error: any) {
    console.log(error);
  }
}
