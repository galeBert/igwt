import { UserData } from "@/hooks/use-create-transaction";
import axios from "axios";

const url = process.env.NEXT_PUBLIC_API_URL;

export const getUserData = async (userId: string) => {
  const userData = await fetch(`${url}/api/${userId}`, {
    method: "GET",
    cache: "no-cache",
  });
  const test = await userData.json();
  // const userData = await axios.get(`${url}/api/${userId}`);
  const balance = await axios.get(`${url}/api/${userId}/balance`);

  const awaitedUserData: UserData = {
    ...test,
    balance: balance.data,
  };

  return awaitedUserData;
};
