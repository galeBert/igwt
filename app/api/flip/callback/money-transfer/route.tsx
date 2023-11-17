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
    const data = await req.text();
    const translatedData = qs.parse(data).data as string;

    if (translatedData) {
      const data = JSON.parse(translatedData);
      const userId = data.idempotency_key.split("-")[3];

      const q = query(
        collection(db, `user/${userId}/balance`),
        where("flipId", "==", data.id)
      );
      let selectedTransaction: any;
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        selectedTransaction = { ...doc.data(), fBaseId: doc.id };
      });
      console.log(selectedTransaction, data, {
        test: userId,
      });

      if (selectedTransaction) {
        const washingtonRef = doc(
          db,
          `user/${userId}/balance`,
          selectedTransaction?.fBaseId
        );
        const newData = {
          ...selectedTransaction.payment,
          status: data.status,
        };

        await updateDoc(washingtonRef, newData);

        // const reFetchData = await fetch(
        //   `${process.env.NEXT_PUBLIC_API_URL}/api/transaction/${selectedTransaction?.fBaseId}`,
        //   { method: "GET" }
        // );

        return NextResponse.json(newData);
      }
      return NextResponse.json(null);
    }
    return NextResponse.json(null);
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(error);
  }
}
