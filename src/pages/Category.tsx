import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductProps } from "../../type";
import CategoryFilters from "../ui/CategoryFilters";
import Container from "../ui/Container";
import Loading from "../ui/Loading";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import CategoryCard from "../ui/CategoryCard";

const Category = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductProps[]>([]);
console.log("products",products)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "Products"), where("_base", "==", id));
        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as ProductProps),
          id: doc.id,
        }));
        setProducts(productsList);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  const formatId = (id: string) => {
    return id
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase());
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <h2 className="text-4xl text-center font-semibold mb-10">
            {formatId(id!)}
          </h2>
          <div className="flex items-start gap-10">
            <CategoryFilters id={id} />
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.length === 0 ? (
                <div className="col-span-full text-center ">
                  <p className="font-semibold">No products found for this category.</p>
                </div>
              ) : (
                products.map((item: ProductProps) => (
                  <CategoryCard item={item} key={item?._id} />
                ))
              )}
            </div>
          </div>
        </Container>
      )}
    </div>
  );
};

export default Category;

