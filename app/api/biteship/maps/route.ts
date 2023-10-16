import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { query } = body;

    const data = await axios.get(
      `https://api.biteship.com/v1/maps/areas?countries=ID&input=${query}&type=single`,
      {
        headers: {
          Authorization: process.env.BITESHIP_API_KEY,
        },
      }
    );
    const addressDetail = data.data.areas;
    if (addressDetail.length) {
      const translatedAddress = {
        province: addressDetail[0].administrative_division_level_1_name,
        city: addressDetail[0].administrative_division_level_2_name,
        district: addressDetail[0].administrative_division_level_3_name,
        address_id: addressDetail[0].id,
        formated_address: addressDetail[0].name,
        postalcode: addressDetail[0].postal_code,
      };
      return NextResponse.json([translatedAddress]);
    }

    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json(error);
  }
}
