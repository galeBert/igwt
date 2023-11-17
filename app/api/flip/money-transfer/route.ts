import { db } from "@/lib/firebase";
import { translateToURLencoded } from "@/lib/helpers";
import axios from "axios";
import {
  addDoc,
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
    const { userId, ...rest } = body;

    const requestData = translateToURLencoded(rest);

    const idempotencyKey = `igwt-mny-trf-${userId}-${Date.now()}`;
    let encodedAuth: string = Buffer.from(
      `${process.env.FLIP_API_KEY}:`
    ).toString("base64");

    const response = await axios(
      "https://bigflip.id/big_sandbox_api/v3/special-disbursement",
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
    const { amount, status, id } = response.data;
    const test = "asdas";

    await addDoc(collection(db, `user/${userId}/balance`), {
      transactionId: "",
      amount,
      from: "igwt",
      to: userId,
      type: "outcome",
      status,
      flipId: id,
      remark: userId,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(error);
  }
}

export async function GET(req: Request, res: Response) {
  try {
    let encodedAuth: string = Buffer.from(
      `${process.env.FLIP_API_KEY}:`
    ).toString("base64");

    const response = await axios(
      "https://bigflip.id/big_sandbox_api/v3/disbursement?pagination=20&page=1&sort=id",
      {
        method: "GET",
        headers: {
          Authorization: "Basic " + encodedAuth,
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(error);
  }
}
