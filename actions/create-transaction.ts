import { TTransactionData } from "@/hooks/use-create-transaction";
import { oneHourfromNowFlipFormat } from "@/lib/helpers";
import axios from "axios";
import { sendNotification } from "./send-notification";

const url = process.env.NEXT_PUBLIC_API_URL;

interface PaymentData {
  data: TTransactionData;
  userId: string;
}
export const createTransaction = async ({ data, userId }: PaymentData) => {
  try {
    const transactionData = await axios.post(
      `${url}/api/${userId}/transaction`,
      { ...data, notReadBy: [data.sender?.email, data.reciever?.email] }
    );

    if (transactionData.data) {
      const data: TTransactionData = transactionData.data;
      const transactionStarter =
        data.role === "sender" ? data.sender : data.reciever;

      const transactionReciever =
        data.role === "sender" ? data.reciever : data.sender;

      const fcm = await axios.get(
        `${url}/api/${transactionReciever?.email}/getToken`
      );
      console.log({ fcm, transactionReciever });

      if (fcm.data && data.id) {
        console.log(
          `Sending a push notification to ${transactionReciever?.email}`
        );

        sendNotification({
          message: `${transactionStarter?.email} has invite you to transactions`,
          token: fcm.data.fCMToken,
          data: { transactionId: data.id },
        });
      }

      return data;
    }
  } catch (error) {
    console.log("Error", error);
  }
};
