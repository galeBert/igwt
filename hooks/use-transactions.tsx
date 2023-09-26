import { db } from "@/lib/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

export async function useTransactions() {
  let input;
  const q = query(collection(db, "transactions"));
  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      return (input = doc.data());
    });
  });

  return input;
}
