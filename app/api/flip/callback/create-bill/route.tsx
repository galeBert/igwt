import { db } from "@/lib/firebase";
import { translateToURLencoded } from "@/lib/helpers";
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
import qs from "query-string";
// {
//     id: 'FT226',
//     bill_link_id: 8274,
//     bill_link: 'flip.id/$test/#successresponse',
//     bill_title: 'Success Response',
//     sender_name: 'PT Fliptech Lentera Inspirasi Pertiwi',
//     sender_email: 'sender@email.com',
//     sender_bank: 'bri',
//     amount: 10000,
//     status: 'SUCCESSFUL',
//     created_at: '2023-11-01 10:02:41'
//   }

export async function POST(req: Request, res: Response) {
  try {
    const data = await req?.text();
    const translatedData = qs.parse(data).data as string;

    if (translatedData) {
      const data = JSON.parse(translatedData);
      const q = query(
        collection(db, "transactions"),
        where("payment.bill_payment.id", "==", data.id)
      );
      let selectedTransaction: any;
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        selectedTransaction = { ...doc.data(), fBaseId: doc.id };
      });
      if (selectedTransaction) {
        const washingtonRef = doc(
          db,
          "transactions",
          selectedTransaction?.fBaseId
        );
        const newData = {
          payment: {
            ...selectedTransaction.payment,
            bill_payment: {
              ...selectedTransaction.payment.bill_payment,
              status: data.status,
            },
          },
          status: data.status === "SUCCESSFUL" ? "002" : "022",
        };

        await updateDoc(washingtonRef, newData);

        if (data.status === "SUCCESSFUL") {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/transaction/${selectedTransaction?.fBaseId}/transaction-log`,
            {
              role: "reciever",
              description: `payment paid`,
              status: "complete",
            }
          );
        } else {
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/transaction/${selectedTransaction?.fBaseId}/transaction-log`,
            {
              role: "reciever",
              description: `payment failed, reciever need to try again`,
              status: "failed",
            }
          );
          await axios.patch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/transaction/${selectedTransaction?.fBaseId}`,
            {
              transactionId: selectedTransaction?.fBaseId,
              status: "022",
            }
          );
        }

        const newResponse = { ...selectedTransaction, newData };

        const reFetchData = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/transaction/${selectedTransaction?.fBaseId}`,
          { method: "GET" }
        );

        return NextResponse.json(reFetchData);
      }
    }
    return NextResponse.json(null);
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(error);
  }
}
