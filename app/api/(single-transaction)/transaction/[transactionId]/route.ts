import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Error from "next/error";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { transactionId: string } }
) {
  try {
    const transactionRef = doc(db, "transactions", params.transactionId);
    // const ref = doc(db, "cities", "LA").withConverter(cityConverter);
    const singleTransaction = await getDoc(transactionRef);
    if (singleTransaction.exists()) {
      //   // Convert to City object
      //   const city = docSnap.data();
      //   // Use a City instance method
      //   console.log(city.toString());
      return NextResponse.json({
        ...singleTransaction.data(),
        id: singleTransaction.id,
      });
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
  }
}
