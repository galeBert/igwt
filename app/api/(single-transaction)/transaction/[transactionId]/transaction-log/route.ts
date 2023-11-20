import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs";
import axios from "axios";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { transactionId: string } }
) {
  const { userId } = auth();
  try {
    const body = await req.json();

    const { role, description, status } = body;

    const ref = collection(
      db,
      `transactions/${params.transactionId}/transaction-log`
    );
    await addDoc(ref, {
      createdAt: new Date(Date.now()).toISOString(),
      role,
      description,
      status,
      userId,
    });
    const id = doc(ref).id;

    return NextResponse.json({ id, userId, ...body });
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(error);
  }
}

export async function GET(
  req: Request,
  { params }: { params: { transactionId: string } }
) {
  try {
    const ref = collection(
      db,
      `transactions/${params.transactionId}/transaction-log`
    );

    const querySnapshot = await getDocs(ref);
    let data: any[] = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data.push(doc.data());
    });

    if (data) {
      return NextResponse.json(data);
    }
    return NextResponse.json(null);
  } catch (error) {
    return NextResponse.json(error);
  }
}
