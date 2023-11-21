import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs";
import axios from "axios";
import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      transactionId,
      status,
      role,
      amount,
      from,
      to,
      type,
      transactionUserId,
    } = body;

    if (role === "sender") {
      await addDoc(collection(db, `user/${transactionUserId}/balance`), {
        transactionId,
        amount,
        from,
        to,
        type,
        status,
      });
    }
    if (role === "receiver") {
      const q = query(collection(db, `user`), where("email", "==", to));

      const querySnapshot = await getDocs(q);

      let sellerUser: DocumentData[] = [];

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        sellerUser.push({ ...doc.data(), id: doc.id });
      });
      if (sellerUser.length) {
        await addDoc(collection(db, `user/${sellerUser[0].id}/balance`), {
          transactionId,
          amount,
          type,
          from,
          to,
          status,
        });
      }
    }

    await addDoc(collection(db, `user/${userId}/balance`), {
      amount,
      status,
      type: "income",
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

    const q = query(collection(db, `user/${userId}/balance`));

    const querySnapshot = await getDocs(q);

    let transactionHistory: DocumentData[] = [];

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      transactionHistory.push({ ...doc.data(), id: doc.id });
    });

    const income = transactionHistory
      .filter((value) => value.type === "income" && value.status === "DONE")
      .reduce(function (acc, obj) {
        return acc + obj.amount;
      }, 0);

    const outcome = transactionHistory
      .filter((value) => value.type === "outcome" && value.status === "DONE")
      .reduce(function (acc, obj) {
        return acc + obj.amount;
      }, 0);

    return NextResponse.json(income - outcome);
  } catch (error) {
    return NextResponse.json(error);
  }
}
