import { UserData } from "@/hooks/use-create-transaction";
import axios from "axios";

export type ContactData = {
  city: string;
  district: string;
  province: string;
  postalCode: string;
  street_name: string;
  description: string;
  id: string;
  address_id: string;
  formated_address: string;
  name: string;
  phoneNumber: string;
};

const url = process.env.NEXT_PUBLIC_API_URL;

export const getContact = async (userId: string) => {
  const getContacts = await fetch(`${url}/api/${userId}/contact`, {
    method: "GET",
  });
  const contactData = await getContacts.json();

  const awaitedContactData: ContactData[] = contactData;

  return awaitedContactData;
};
