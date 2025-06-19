import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "../services/firebase";

export type Bar = {
  id?: string;
  nom: string;
  lat: number;
  lng: number;
};

export const useBars = () => {
  const [bars, setBars] = useState<Bar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const q = query(collection(db, "bars"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Bar),
    }));
    console.log("Bars récupérés :", data); // 🔍 LOG ICI
    setBars(data);
    setLoading(false);
  });
  return () => unsubscribe();
}, []);


  const ajouterBar = async (bar: Omit<Bar, "id">) => {
    await addDoc(collection(db, "bars"), bar);
  };

  return { bars, ajouterBar, loading };
};
