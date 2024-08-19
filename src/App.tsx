import { useEffect, useState } from "react";
import BannerCategories from "./ui/BannerCategories";
// import Blog from "./ui/Blog";
import Categories from "./ui/Categories";
import DiscountBanner from "./ui/DiscountBanner";
import Highlights from "./ui/Highlights";
import HomeBanner from "./ui/HomeBanner";
import ProductList from "./ui/ProductList";
import { collection, getDocs } from 'firebase/firestore';
import { ProductProps } from "../type";
import { db } from "./lib/firebase";

function App() {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCol = collection(db, "Products");
        const productSnapshot = await getDocs(productsCol);
        const productsList = productSnapshot.docs.map((doc) => ({
          ...(doc.data() as ProductProps),
          id: doc.id,
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(); 
  }, []); 

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <BannerCategories />
      <HomeBanner />
      <Highlights />
      <Categories />
      <ProductList products={products} />
      <DiscountBanner />
      {/* <Blog /> */}
    </div>
  );
}

export default App;
