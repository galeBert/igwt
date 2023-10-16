import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

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
export const useContact = () => {
  const { user } = useUser();
  const [contacts, setContacts] = useState<ContactData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getContact = async () => {
      setLoading(true);
      if (user) {
        const contactData = await axios.get(`/api/${user.id}/contact`);
        setContacts(contactData.data);
        setLoading(false);
      }
    };

    getContact();
  }, [user]);
  return { contacts, loading };
};
