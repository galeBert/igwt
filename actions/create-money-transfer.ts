import { TTransactionData } from "@/hooks/use-create-transaction";
import { oneHourfromNowFlipFormat } from "@/lib/helpers";
import axios from "axios";

const url = process.env.NEXT_PUBLIC_API_URL;

interface TransferData {
  userId?: string;
  account_number?: string;
  bank_code?: string;
  amount?: number;
  beneficiary_email?: string;
}
export async function createCashout(_url: any, { arg }: { arg: TransferData }) {
  const { account_number, amount, bank_code, beneficiary_email, userId } = arg;
  const transactionData = await axios.post(`${url}/api/flip/money-transfer`, {
    userId,
    amount,
    account_number,
    bank_code,
    beneficiary_email,
    sender_country: 100252,
    sender_name: "igwt",
    sender_address: "Some Address Street 123",
    sender_job: "company",
    direction: "DOMESTIC_SPECIAL_TRANSFER",
  });
  const awaitedTransactionData: TTransactionData = await transactionData.data;

  return awaitedTransactionData;
}
