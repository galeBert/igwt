import { db } from "@/lib/firebase";
import { midtrans } from "@/lib/midtrans.d";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    let parameter = {
      payment_type: "bank_transfer",
      transaction_details: {
        gross_amount: 241415,
        order_id: "test-transact11acc511116434123",
      },
      bank_transfer: {
        bank: "bca",
      },
    };

    const test = await midtrans
      .charge(parameter)
      .then((chargeResponse: any) => {
        return chargeResponse;
      })
      .catch((e: any) => {
        console.log("Error occured:", e.message);
      });
    return NextResponse.json(test);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function GET(req: Request, res: Response) {
  try {
    // const querySnapshot = await getDocs(collection(db, "users"));

    // querySnapshot.forEach((doc) => {
    //   console.log(`${doc.id} => ${doc.data()}`);
    // });
    return NextResponse.json("hi");
  } catch (error) {
    return NextResponse.json(error);
  }
}
