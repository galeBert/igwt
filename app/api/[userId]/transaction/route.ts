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

    const data = {
      ...body,
      userId,
      createdAt: Date.now(),
      status: "000",
    };
    const newDoc = await addDoc(collection(db, `transactions`), data);
    return NextResponse.json({ id: newDoc.id, ...data });
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
