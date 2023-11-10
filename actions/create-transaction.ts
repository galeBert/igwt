import { TTransactionData } from "@/hooks/use-create-transaction";
import { oneHourfromNowFlipFormat } from "@/lib/helpers";
import axios from "axios";
import { NextResponse } from "next/server";

const url = process.env.NEXT_PUBLIC_API_URL;

interface PaymentData {
  data: TTransactionData;
  userId: string;
}
export const createTransaction = async ({ data, userId }: PaymentData) => {
  try {
    const transactionData = await axios.post(
      `${url}/api/${userId}/transaction`,
      data
    );
    if (transactionData.data) {
      const data: TTransactionData = transactionData.data;
      return data;
    }
  } catch (error) {
    console.log("Error", error);
  }
};
