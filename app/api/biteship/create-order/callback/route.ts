import { db } from "@/lib/firebase";
import axios from "axios";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const data = await req.json();
    if (!data.courier_tracking_id) {
      throw new Error("order not found");
    }

    const orderTrack = await axios.get(
      `https://api.biteship.com/v1/trackings/${data.courier_tracking_id}`,

      {
        headers: {
          Authorization: process.env.BITESHIP_API_KEY,
        },
      }
    );

    if (!orderTrack.data) {
      throw new Error("order not found");
    }

    let transaction: any;
    const q = query(
      collection(db, `transactions`),
      where("shipping_status.tracking_id", "==", data.courier_tracking_id)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      transaction = { fbaseId: doc.id, ...doc.data() };
    });
    const index = orderTrack.data.history.length
      ? orderTrack.data.history.length - 1
      : 0;
    const docRef = doc(db, "transactions", transaction.fbaseId);
    await updateDoc(docRef, {
      "shipping_status.history": orderTrack.data.history,
    });

    const status = orderTrack.data.status.split("_").join(" ");
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/transaction/${transaction.fbaseId}/transaction-log`,
      {
        role: orderTrack.data.courier.company,
        description: orderTrack.data.history[index].note.split("_").join(" "),
        status: orderTrack.data.status.split("_").join(" "),
      }
    );
    await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/transaction/${transaction.fbaseId}`,
      {
        transactionId: transaction.fbaseId,
        status: status === "allocated" ? "003" : "014",
      }
    );

    return NextResponse.json(null);
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(error);
  }
}
