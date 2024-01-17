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
    console.log({ data });

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
    console.log({ querySnapshot: querySnapshot.docs });
    if (!querySnapshot.empty) {
      console.log("for each", {
        querySnapshot: querySnapshot.forEach((doc) => {
          transaction = { fbaseId: doc.id, ...doc.data() };
        }),
      });

      querySnapshot.forEach((doc) => {
        transaction = { fbaseId: doc.id, ...doc.data() };
      });
      const index = orderTrack.data.history.length
        ? orderTrack.data.history.length - 1
        : 0;
      const docRef = doc(db, "transactions", transaction.fbaseId);
      const status = orderTrack.data.status.split("_").join(" ");
      console.log("body", {
        "shipping_status.history": orderTrack.data.history.map(
          (historyList: any) => ({
            ...historyList,
            status: historyList.status.split("_").join(" "),
          })
        ),
        status:
          status === "allocated"
            ? "003"
            : status === "picking up"
            ? "114"
            : status === "picked"
            ? "214"
            : status === "dropping off"
            ? "314"
            : status === "delivered"
            ? "004"
            : "",
        transaction_status:
          status === "delivered"
            ? {
                status: "DONE",
                expired_at: new Date(
                  new Date().getTime() + 60 * 60 * 1000
                ).toISOString(),
              }
            : undefined,
      });

      await updateDoc(docRef, {
        "shipping_status.history": orderTrack.data.history.map(
          (historyList: any) => ({
            ...historyList,
            status: historyList.status.split("_").join(" "),
          })
        ),
        status:
          status === "allocated"
            ? "003"
            : status === "picking up"
            ? "114"
            : status === "picked"
            ? "214"
            : status === "dropping off"
            ? "314"
            : status === "delivered"
            ? "004"
            : "",
        transaction_status: {
          status: status === "delivered" ? "DONE" : "ONPROGRESS",
          expired_at:
            status === "delivered"
              ? new Date(new Date().getTime() + 60 * 60 * 1000).toISOString()
              : null,
        },
      });

      const transactionData = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transaction/${transaction.fbaseId}/transaction-log`,
        {
          role: orderTrack.data.courier.company,
          description: orderTrack.data.history[index].note.split("_").join(" "),
          status: orderTrack.data.status.split("_").join(" "),
        }
      );

      return NextResponse.json(transactionData);
    }
    return new NextResponse("no found");
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(error);
  }
}
