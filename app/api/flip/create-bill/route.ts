import { db } from "@/lib/firebase";
import { translateToURLencoded } from "@/lib/helpers";
import axios from "axios";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { NextResponse } from "next/server";
import qs from "query-string";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { transactionId, ...rest } = body;

    const requestData = translateToURLencoded(rest);

    const idempotencyKey = `igwt-${transactionId}-${Date.now()}`;
    let encodedAuth: string = Buffer.from(
      `${process.env.FLIP_API_KEY}:`
    ).toString("base64");

    const response = await axios(
      "https://bigflip.id/big_sandbox_api/v2/pwf/bill",
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + encodedAuth,
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "idempotency-key": idempotencyKey,
        },
        data: requestData,
      }
    );
    const { expired_date, ...createBillResponse } = response.data;

    const transactionRef = doc(db, "transactions", transactionId);

    await updateDoc(transactionRef, {
      payment: {
        ...createBillResponse,
        expired_date: new Date(
          new Date().getTime() + 60 * 60 * 1000
        ).toISOString(),
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(error);
  }
}
