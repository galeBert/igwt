import { TTransactionData, UserData } from "@/hooks/use-create-transaction";

import { ShippingPriceListData } from "@/lib/types";
import axios from "axios";
import { sendNotification } from "./send-notification";

const url = process.env.NEXT_PUBLIC_API_URL;

interface OrderData {
  transactionId: string;
  sender: UserData;
  reciever: UserData;
  selectedShipper: ShippingPriceListData;
  packageItems: {
    name: string;
    height: number;
    weight: number;
    description?: string;
  }[];
}
export const createOrder = async ({
  transactionId,
  packageItems,
  reciever,
  selectedShipper,
  sender,
}: OrderData) => {
  try {
    const transactionData = await axios.post(
      `${url}/api/biteship/create-order`,
      {
        transactionId,
        courier_company: selectedShipper.company,
        courier_type: selectedShipper.type,
        destination_address: `${reciever.street_name}, ${reciever.formatted_address}`,
        destination_area_id: reciever.address_id,
        destination_contact_name: reciever.name,
        destination_contact_phone: "08123123",
        destination_postal_code: reciever.postalCode,
        items: packageItems,
        origin_address: `${reciever.street_name}, ${reciever.formatted_address}`,
        origin_area_id: sender.address_id,
        origin_contact_name: sender.name,
        origin_contact_phone: "081232131",
        origin_postal_code: sender.postalCode.text,
        shipper_contact_name: sender.name,
      }
    );
    const awaitedTransactionData: TTransactionData = await transactionData.data;

    if (transactionData) {
      const data: TTransactionData = transactionData.data;
      const transactionStarter =
        data.role === "sender" ? data.sender : data.reciever;

      const transactionReciever =
        data.role === "sender" ? data.reciever : data.sender;

      const fcm = await axios.get(
        `${url}/api/${data.reciever?.fCMToken}/getToken`
      );
      if (fcm.data && data.id) {
        console.log(
          `Sending a push notification to ${transactionReciever?.email}`
        );

        sendNotification({
          message: `${data.sender?.email} requeting to pick up`,
          token: fcm.data.fCMToken,
          data: { transactionId: data.id },
        });
      }
    }
    await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`, {
      transactionId,
      shipping_status: { ...awaitedTransactionData },
      status: "013",
    });

    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/transaction/${transactionId}/transaction-log`,
      {
        role: "sender",
        description: `already start for courier for pick up the package`,
        status: "waiting for courier",
      }
    );

    return awaitedTransactionData;
  } catch (error) {
    console.log(error);
  }
};
