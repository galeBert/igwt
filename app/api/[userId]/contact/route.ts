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
  setDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      province,
      district,
      city,
      address_id,
      postalcode,
      name,
      formated_address,
      street_name,
      description,
      email,
    } = body;
    console.log(body);

    await addDoc(collection(db, `user/${userId}/contact`), {
      province,
      district,
      city,
      address_id,
      postalcode,
      name,
      formated_address,
      street_name,
      description: description ?? "",
      email,
    });

    return NextResponse.json({ hello: "world" });
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(error);
  }
}

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  try {
    if (!userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    const q = query(collection(db, `user/${userId}/contact`));

    const querySnapshot = await getDocs(q);

    let test: DocumentData[] = [];

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      test.push({ ...doc.data(), id: doc.id });
    });

    return NextResponse.json(test);
  } catch (error) {
    return NextResponse.json(error);
  }
}
