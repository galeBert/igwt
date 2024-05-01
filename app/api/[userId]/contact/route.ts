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
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    // const { userId } = auth();

    if (!params.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      postalcode,
      email,
      address_id,
      formated_address,
      district,
      city,
      province,
      name,
      fCMToken,
      street_name,
      description,
    } = body;

    if (fCMToken) {
      await addDoc(collection(db, `user/${params.userId}/contact`), {
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
        fCMToken,
      });
    } else {
      await addDoc(collection(db, `user/${params.userId}/contact`), {
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
    }

    return NextResponse.json({ hello: "world" });
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(error);
  }
}

export async function GET(
  req: Request,
  {
    params,
    searchParams,
  }: {
    params: { userId: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  }
) {
  const { userId } = params;
  try {
    if (!userId) {
      return new NextResponse("User id is required", { status: 400 });
    }
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const email = searchParams.get("email");
    //get single contact
    if (email) {
      const q = query(collection(db, "user"), where("email", "==", email));

      let singleContact = null;
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        singleContact = doc.data();
      });
      return NextResponse.json(singleContact);
    }
    //get multiple contact
    const q = query(collection(db, `user/${userId}/contact`));

    const querySnapshot = await getDocs(q);

    let contacts: DocumentData[] = [];

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      contacts.push({ ...doc.data(), id: doc.id });
    });

    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json(error);
  }
}
