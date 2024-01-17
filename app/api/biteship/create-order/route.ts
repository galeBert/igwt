import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const {
      transactionId,
      shipper_contact_name,
      shipper_contact_phone,
      origin_contact_name,
      origin_contact_phone,
      origin_address,
      origin_postal_code,
      origin_area_id,
      destination_contact_name,
      destination_contact_phone,
      destination_address,
      destination_postal_code,
      destination_area_id,
      courier_company,
      courier_type,
      items,
    } = body;

    const order = await axios.post(
      "https://api.biteship.com/v1/orders",
      {
        shipper_contact_name,
        shipper_contact_phone,
        origin_contact_name,
        origin_contact_phone,
        origin_address,
        origin_postal_code,
        origin_area_id,
        destination_contact_name,
        destination_contact_phone,
        destination_address,
        destination_postal_code,
        destination_area_id,
        courier_company,
        courier_type,
        delivery_type: "now",
        items,
      },
      {
        headers: {
          Authorization: process.env.BITESHIP_API_KEY,
        },
      }
    );
    const orderTrack = await axios.get(
      `https://api.biteship.com/v1/trackings/${order.data.courier.tracking_id}`,

      {
        headers: {
          Authorization: process.env.BITESHIP_API_KEY,
        },
      }
    );

    return NextResponse.json({
      tracking_id: order.data.courier.tracking_id,
      ...orderTrack.data,
    });
  } catch (error: any) {
    console.log(error);

    throw new Error("BITESHIP_CREATE_ORDER", error);
  }
}
