import { useEffect, useState } from "react";
import Container from "./Container";
import { CategoryProps } from "../../type";
import { Link } from "react-router-dom";
import Title from "./Title";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import Loading from "../ui/Loading";


const Categories = () => {
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Category"));
        const category = querySnapshot.docs.map(doc => doc.data() as CategoryProps);
        setCategories(category);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <Container>
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <Title text="Popular categories" />
          <Link
            to={"/category/businessCards"}
            className="font-medium relative group overflow-hidden"
          >
            View All Categories
            <span className="absolute bottom-0 left-0 w-full block h-[1px] bg-gray-600 -translate-x-[100%] group-hover:translate-x-0 duration-300" />
          </Link>
        </div>
        <div className="w-full h-[1px] bg-gray-200 mt-3" />
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-7">
        {loading ? (
          <Loading />
        ) : (
          categories?.map((item: CategoryProps) => (
            <Link
              to={`category/${item?._base}`}
              key={item?._id}
              className="w-full h-auto relative group overflow-hidden"
            >
              <img
                src={item?.image}
                alt="cat-image"
                className="w-full h-auto rounded-md group-hover:scale-110 duration-300"
              />
              <div className="absolute bottom-3 w-full text-center">
                <p className="text-sm md:text-base font-bold">{item?.name}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </Container>
  );
};

export default Categories;
