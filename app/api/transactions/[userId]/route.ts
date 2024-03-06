import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const q = query(
      collection(db, "transactions"),
      or(
        where("sender.email", "==", params.userId),
        where("reciever.email", "==", params.userId)
      ),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    let transactions: any[] = [];
    querySnapshot.forEach((doc) => {
      transactions.push({ ...doc.data(), id: doc.id });
    });

    return NextResponse.json(transactions);
  } catch (error: any) {
    throw new Error("TRANSACTION_USER_ID", error);
  }
}
