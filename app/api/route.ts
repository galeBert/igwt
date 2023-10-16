import { db } from "@/lib/firebase";
import { midtrans } from "@/lib/midtrans.d";
import axios from "axios";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import qs from "query-string";

export async function POST(req: Request, res: Response) {
  try {
    // const secretKey =
    //   "JDJ5JDEzJHhGSnpuaEhxbVBYT09yRFY3ZDcyZU9pVG4wUVFjaGx3VC9YaldtR3J1dmJaMGxUZlpTcWxt";
    // const encodedAuth = Buffer.from(`${secretKey}:`).toString("base64");

    // const details: any = {
    //   account_number: "1122333300",
    //   bank_code: "bni",
    //   amount: "10000",
    // };
    // let formBody: any = [];
    // for (var property in details) {
    //   var encodedKey = encodeURIComponent(property);
    //   var encodedValue = encodeURIComponent(details[property]);
    //   formBody.push(encodedKey + "=" + encodedValue);
    // }
    // formBody = formBody.join("&")

    // const instance = await axios.post(
    //   "https://bigflip.id/big_sandbox_api/v3/disbursement",
    //   { data: formBody },
    //   {
    //     headers: {
    //       Authorization: `Basic ${encodedAuth}`,
    //       idempotency_key: "8anU9saqIU798wOo1",
    //       "Content-Type": "application/x-www-form-urlencoded",
    //       Accept: "/",
    //     },
    //   }
    // );

    //TODO: create payment
    // const newDate = new Date();

    // let details: any = {
    //   account_number: "1122333300",
    //   bank_code: "bni",
    //   amount: 10000,
    //   remark: "some remark2222",
    //   recipient_name: "sapto",
    //   recipient_city: 391,
    //   beneficiary_email: "test@mail.com,user@mail.com",
    // };

    // const details: any = {
    //   account_number: "1122333300",
    //   bank_code: "bni",
    //   amount: "100001",
    // };

    // let formBody: any = [];
    // for (let property in details) {
    //   let encodedKey = encodeURIComponent(property);
    //   let encodedValue = encodeURIComponent(details[property]);
    //   formBody.push(encodedKey + "=" + encodedValue);
    // }
    // formBody = formBody.join("&");

    // const secretKey: string =
    //   "JDJ5JDEzJHhGSnpuaEhxbVBYT09yRFY3ZDcyZU9pVG4wUVFjaGx3VC9YaldtR3J1dmJaMGxUZlpTcWxt";
    // let encodedAuth: string = Buffer.from(`${secretKey}:`).toString("base64");

    // const response = await axios(
    //   "https://bigflip.id/big_sandbox_api/v2/disbursement",
    //   {
    //     method: "POST",
    //     headers: {
    //       Authorization: "Basic " + encodedAuth,
    //       "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    //       "idempotency-key": "idem-key-2 12211 3",
    //       "X-TIMESTAMP": "2023-12-28T16:04:15+0700",
    //     },
    //     data: formBody,
    //   }
    // );

    //TODO: create bill
    const newDate = new Date();

    let details: any = {
      title: "sapi",
      type: "SINGLE",
      amount: 10001,
      expired_date: "2023-09-28 23:53",
      redirect_url: "https://someurl.com",
      is_address_required: 0,
      is_phone_number_required: 0,
      step: 1,
    };

    let formBody: any = [];
    for (let property in details) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const secretKey: string =
      "JDJ5JDEzJHhGSnpuaEhxbVBYT09yRFY3ZDcyZU9pVG4wUVFjaGx3VC9YaldtR3J1dmJaMGxUZlpTcWxt";
    let encodedAuth: string = Buffer.from(`${secretKey}:`).toString("base64");

    const response = await axios(
      "https://bigflip.id/big_sandbox_api/v2/pwf/bill",
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + encodedAuth,
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "idempotency-key": "idem-key-151",
        },
        data: formBody,
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.log("error", error);

    return NextResponse.json(error);
  }
}

export async function GET(req: Request, res: Response) {
  try {
    const data = await axios.get(
      "https://api.biteship.com/v1/maps/areas?countries=ID",
      {
        headers: {
          Authorization:
            "biteship_test.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCBrdXJpciIsInVzZXJJZCI6IjY1MDNmZDNiMWI2NDI1MWNiOWQ5NmU4NiIsImlhdCI6MTY5NTkzMzYzOX0.sAGBBCynEHDzw1flpZFy7vsvFwg5jtIW_EIE-zdGmFs",
        },
      }
    );

    return NextResponse.json(data.data);
  } catch (error) {
    return NextResponse.json(error);
  }
}
