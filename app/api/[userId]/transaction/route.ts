import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs";
import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { transactionId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();

    await addDoc(collection(db, `transactions`), {
      ...body,
      userId,
      createdAt: Date.now(),
    });

    return NextResponse.json({ hello: "word" });
  } catch (error: any) {
    console.log(error);
  }
}