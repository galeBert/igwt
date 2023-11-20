import { TTransactionData } from "@/hooks/use-create-transaction";
import { oneHourfromNowFlipFormat } from "@/lib/helpers";
import axios from "axios";
import { NextResponse } from "next/server";

const url = process.env.NEXT_PUBLIC_API_URL;

interface PaymentData {
  inviteLink?: string;
  productName?: string;
  recieverName?: string;
  recieverEmail?: string;
  senderEmail?: string;
  senderName?: string;
  senderPhoto?: string;
}
export const createTransactionEmail = async ({
  inviteLink,
  productName,
  recieverEmail,
  recieverName,
  senderEmail,
  senderName,
  senderPhoto,
}: PaymentData) => {
  try {
    const transactionData = await axios.post(
      `${url}/api/create-transaction-email`,
      {
        inviteLink,
        productName,
        recieverEmail,
        recieverName,
        senderEmail,
        senderName,
        senderPhoto,
      }
    );
    if (transactionData.data) {
      const data: TTransactionData = transactionData.data;
      return data;
    }
  } catch (error) {
    console.log("Error", error);
  }
};
