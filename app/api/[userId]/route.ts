import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  try {
    if (!userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    const docRef = doc(db, "user", userId);
    const userData = await getDoc(docRef);

    if (userData.exists()) {
      return NextResponse.json(userData.data());
    }
    return NextResponse.json(null);
  } catch (error) {
    return NextResponse.json(error);
  }
}
