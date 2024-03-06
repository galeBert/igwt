import { db } from "@/lib/firebase";
import { removeDuplicateObjectFromArray } from "@/lib/helpers";
import { auth } from "@clerk/nextjs";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { transactionId: string } }
) {
  try {
    if (!params.transactionId) {
      return new NextResponse("transaction id is required", { status: 400 });
    }
    const transactionRef = doc(db, "transactions", params.transactionId);

    const singleTransaction = await (await getDoc(transactionRef)).data();
    const check = new Set();
    const shipperList =
      singleTransaction?.shipping?.pricing.map(
        (
          obj: { [x: string]: unknown; courier_name: any },
          idx: number,
          arr: any[]
        ) => {
          if (!check.has(obj["courier_name"])) {
            check.add(obj["courier_name"]);
          } else {
            return {
              name: obj.courier_name,
              shipping: [obj, arr[idx - 1]],
            };
          }
          return { name: obj.courier_name, shipping: [obj] };
        }
      ) ?? [];

    const shipperListFilltered = removeDuplicateObjectFromArray(
      shipperList.reverse(),
      "name"
    );

    if (singleTransaction) {
      const editedPricing = {
        ...singleTransaction,
        shipping: {
          ...singleTransaction.shipping,
          pricing: shipperListFilltered,
        },
      };
      return NextResponse.json(editedPricing);
    }
    return NextResponse.json(null);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { transactionId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();

    const { ...rest } = body;

    const transactionRef = doc(db, "transactions", params.transactionId);

    await updateDoc(transactionRef, rest);
    return NextResponse.json(rest);
  } catch (error: any) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
