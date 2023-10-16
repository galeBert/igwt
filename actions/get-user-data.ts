import { AddressData } from "@/components/form/address-form";
import axios from "axios";

const url = process.env.NEXT_PUBLIC_API_URL;

export const getUserData = async (userId: string) => {
  const userData = await axios.get(`${url}/api/${userId}`);
  const awaitedUserData: AddressData = userData.data;

  return awaitedUserData;
};
