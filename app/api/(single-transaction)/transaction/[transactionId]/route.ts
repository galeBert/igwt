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
    // const ref = doc(db, "cities", "LA").withConverter(cityConverter);
    const singleTransaction = await getDoc(transactionRef);
    if (singleTransaction.exists()) {
      const test: any = {
        ...(singleTransaction.data() ?? { hello: "world" }),
        id: singleTransaction.id,
      };
      return NextResponse.json(test);
    }
    return NextResponse.json(null);
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
