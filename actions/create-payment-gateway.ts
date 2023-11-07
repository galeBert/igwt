import { TTransactionData } from "@/hooks/use-create-transaction";
import { oneHourfromNowFlipFormat } from "@/lib/helpers";
import axios from "axios";

const url = process.env.NEXT_PUBLIC_API_URL;

interface PaymentData {
  transactionId: string;
  bank: string;
  amount: number;
  title: string;
  name: string;
}
export const createPaymentGateway = async ({
  amount,
  bank,
  name,
  title,
  transactionId,
}: PaymentData) => {
  const transactionData = await axios.post(`${url}/api/flip/create-bill`, {
    transactionId,
    title,
    type: "SINGLE",
    amount,
    expired_date: oneHourfromNowFlipFormat(),
    redirect_url: "https://someurl.com",
    is_address_required: 0,
    is_phone_number_required: 0,
    step: 3,
    sender_name: name,
    sender_email: "ggalilea007@gmail.com",
    sender_phone_number: "085163005121",
    sender_address: "jl.batu",
    sender_bank: bank,
    sender_bank_type: "virtual_account",
  });
  const awaitedTransactionData: TTransactionData = await transactionData.data;

  return awaitedTransactionData;
};
