import axios from "axios";
import { NextResponse } from "next/server";

// {
//     "origin_area_id": "IDNP9IDNC53IDND6407IDZ17133",
//     "destination_area_id":"IDNP9IDNC22IDND2071IDZ40111",
//     "couriers":"jne",
//     "items": [{
//       "name": "Shoes",
//       "description": "Black colored size 45",
//       "value": 199000,
//       "length": 30,
//       "width": 15,
//       "height": 20,
//       "weight": 200,
//       "quantity": 2
//     }]
//   }
export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { origin_area_id, destination_area_id, items } = body;

    const rates = await axios.post(
      "https://api.biteship.com/v1/rates/couriers",
      {
        origin_area_id,
        destination_area_id,
        couriers: "jne,jnt,sicepat,ninja",
        items,
      },
      {
        headers: {
          Authorization: process.env.BITESHIP_API_KEY,
        },
      }
    );
    return NextResponse.json(rates.data);
  } catch (error) {
    throw new Error("BITESHIP_COURIER_RATE_ERROR", error);
  }
}
