import midtransClient from "midtrans-client";

const midtrans = new midtransClient.CoreApi({
  isProduction: process.env.NODE_ENV === "production",
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export { midtrans };
