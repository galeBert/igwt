import axios from "axios";

const url = process.env.NEXT_PUBLIC_API_URL;

interface PaymentData {
  message: string;
  title?: string;
  data?: { transactionId: string };
  token: string;
}
export const sendNotification = async ({
  message,
  title = "IGWT",
  token,
  data,
}: PaymentData) => {
  try {
    await axios.post(`${url}/api/firebase/notification`, {
      message,
      title,
      data,
      token,
    });
  } catch (error) {
    console.log("Error", error);
  }
};
