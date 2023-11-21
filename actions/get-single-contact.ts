import { UserData } from "@/hooks/use-create-transaction";
import axios from "axios";

export type ContactData = {
  email: string;
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

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// const fetcher = (url: string, { arg }: { arg?: { email: string } }) => {
//   const newUrl = arg?.email ? `${url}?email=${arg?.email}` : url;
//   console.log(newUrl);

//   fetch(newUrl, { method: "GET" }).then((res) => res.json());
// };
export const getSingleContact = async (
  url: string,
  { arg }: { arg?: { email: string } }
) => {
  const newUrl = arg?.email ? `${url}?email=${arg?.email}` : url;

  const getContacts = await fetch(`${baseUrl}${newUrl}`, {
    method: "GET",
  });
  const contactData = await getContacts.json();

  const awaitedContactData: ContactData = contactData;

  return awaitedContactData;
};
