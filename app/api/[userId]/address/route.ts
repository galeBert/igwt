import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    await setDoc(doc(db, "user", userId), body);

    return NextResponse.json(body);
  } catch (error) {
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
