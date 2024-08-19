import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";


export const getData = async (endpoint: string) => {
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Data fetching Error" + response?.statusText);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error while fetching data", error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const productsRef = collection(db, "Products");
    const snapshot = await getDocs(productsRef);
    const products = snapshot.docs.map(doc => doc.data());
    return products;
  } catch (error) {
    console.error("Error fetching products from Firebase:", error);
    throw error;
  }
};
