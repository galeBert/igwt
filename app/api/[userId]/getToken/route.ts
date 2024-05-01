import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  //user id stand for email for this function only
  const { userId } = params;
  try {
    if (!userId) {
      return new NextResponse("User id is required", { status: 400 });
    }
    const q = query(collection(db, "user"), where("email", "==", userId));

    const querySnapshot = await getDocs(q);
    let data: DocumentData[] = [];

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      data.push({ fCMToken: doc.data().fCMToken });
    });
    if (data.length) {
      return NextResponse.json(data[0]);
    } else {
      return NextResponse.json(undefined);
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}
