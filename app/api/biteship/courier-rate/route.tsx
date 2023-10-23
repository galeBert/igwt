import axios from "axios";

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
    const { origin_area_id, destination_area_id, couriers, items } = body;
    const rates = await axios.post(
      "https://api.biteship.com/v1/rates/couriers"
    );
  } catch (error) {
    console.log(error);
  }
}
