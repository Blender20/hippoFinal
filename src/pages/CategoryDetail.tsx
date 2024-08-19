import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { ProductProps } from "../../type";
import Container from "../ui/Container";
import Loading from "../ui/Loading";
import Slider from "react-slick";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Customdata from "../constant/categories.json";
import { store } from "../lib/store";
import toast from "react-hot-toast";
import ArtModel from "./Artmodel";

const CategoryDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [itemTotalCost, setItemTotalCost] = useState<number>(0);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [categoryName, setCategoryName] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localImages, setLocalImages] = useState<string[]>([]);

  const { addCategoryToCart, currentUser } = store();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem("artimages") || "[]");
    console.log("🚀 ~ useEffect ~ storedImages:", storedImages);
    setLocalImages(storedImages.map((item: { url: string }) => item.url));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "Products"), where("_id", "==", id));
        const querySnapshot = await getDocs(q);
        const productsList = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as ProductProps),
          id: doc.id,
        }));
        setProducts(productsList);
        if (productsList.length > 0) {
          const product = productsList[0];
          setCategoryName(product.category || "");
          setBasePrice(product.discountedPrice || 0);

          // Initialize formValues with the first index values from description
          const initialFormValues: Record<string, any> = {};
          const description =
            (Customdata as any).categories[product._base] || {};

          Object.keys(description).forEach((key) => {
            initialFormValues[key] = Object.keys(description[key])[0];
          });

          setFormValues(initialFormValues);
          calculateTotalCost(initialFormValues, 1);
        }
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  useEffect(() => {
    if (Object.keys(formValues).length > 0) {
      calculateTotalCost(formValues, quantity);
    }
  }, [formValues, quantity]);

  // const calculateTotalCost = (values: Record<string, any>, qty: number) => {
  //   let cost = basePrice;
  //   const description =
  //     (Customdata as any).categories[products[0]?._base] || {};

  //   Object.keys(values).forEach((key) => {
  //     const optionCost = description[key]?.[values[key]] || 0;
  //     cost += optionCost;
  //   });
  //   setItemTotalCost(cost);
  //   setTotalCost(cost * qty);
  // };
  const calculateTotalCost = (values: Record<string, any>, qty: number) => {
    let cost = basePrice;
    const category = products[0]?._base;
    const description =
      (Customdata as any).categories[products[0]?._base] || {};

    Object.keys(values).forEach((key) => {
      const optionCost = description[key]?.[values[key]] || 0;
      cost += optionCost;
    });

    if (category === "stickerSheet") {
      const stickerSize = values["Sticker Size"];
      const stickersPerSheet = description["Sticker Size"]?.[stickerSize] || 1;

      const numberOfSheets = values["Number of Sheets"] || 1;
      const calculatedStickers = numberOfSheets * stickersPerSheet;

      values["Number of Sticker"] = calculatedStickers;

      setItemTotalCost(cost);
      setTotalCost(cost * numberOfSheets);
    }
    setItemTotalCost(cost);
    setTotalCost(cost * qty);
  };

  const handleChange = (key: string, value: any) => {
    const newFormValues = { ...formValues, [key]: value.value };
    setFormValues(newFormValues);
    calculateTotalCost(newFormValues, quantity);
  };

  const handleQuantityChange = (value: any) => {
    const qty = Number(value.value);
    setQuantity(qty);
    calculateTotalCost(formValues, qty);
  };

  const handleAddToCart = async () => {
    if (!currentUser) {
      toast.error("Please log in to add items to the cart.");
      return;
    }

    let cartProduct = { ...products[0] };
    cartProduct.details = formValues;
    cartProduct.itemCost = itemTotalCost;
    cartProduct.totalCost = totalCost;
    cartProduct.artImages = localImages;

    try {
      await addCategoryToCart(cartProduct, formValues, quantity);
      toast.success("Added to cart successfully");
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
      console.error("Error adding to cart: ", error);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const description = (Customdata as any).categories[products[0]?._base] || {};

  const convertOptions = (options: Record<string, any>) => {
    return Object.keys(options).map((option) => ({
      label: option,
      value: option,
    }));
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <h2 className="text-4xl text-center font-semibold mb-10">
            {formValues.Format} {categoryName}
          </h2>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2">
              <Slider {...settings}>
                {products.map((item: ProductProps) =>
                  item.images.map((image, index) => (
                    <div key={index}>
                      <img src={image} alt={item.name} className="w-full" />
                    </div>
                  ))
                )}
              </Slider>
            </div>
            <div className="w-full md:w-1/2 h-[100%] border rounded  ml-0 md:ml-32 md:mt-0 shadow-md">
              <div className="flex justify-between bg-gray-100 p-4">
                <h3 className="text-2xl font-bold mb-2 text-left">
                  Get Started
                </h3>
                <div className="text-right text-2xl font-bold text-gray-800">
                  ${totalCost.toFixed(2)}
                </div>
              </div>
              {Object.keys(description).map((key) => (
                <div
                  key={key}
                  className="flex justify-between items-center p-2 border-b"
                >
                  <span className="text-gray-600 font-semibold">{key}</span>
                  <Select
                    value={{ label: formValues[key], value: formValues[key] }}
                    onChange={(selectedOption) =>
                      handleChange(key, selectedOption)
                    }
                    options={convertOptions(description[key])}
                    className="w-[200px] md:w-[300px]"
                  />
                </div>
              ))}
              <div className="flex justify-between items-center p-2 border-b">
                <span className="text-gray-600 font-semibold">Quantity</span>
                <Select
                  value={{ label: quantity.toString(), value: quantity }}
                  onChange={handleQuantityChange}
                  // @ts-ignore
                  options={convertOptions({ 1: 1, 5: 5, 10: 10, 20: 20 })}
                  className="w-[200px] md:w-[300px]"
                />
              </div>
              <div className="text-center mt-4 text-lg font-semibold text-gray-800 flex justify-between p-2">
                <span className="mr-2">Printing Cost:</span>
                <span className="text-2xl font-bold text-orange-600">
                  ${totalCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mt-4 p-4">
                <button
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                  onClick={handleOpenModal}
                >
                  Upload Artwork
                </button>
                <button
                  className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                {isModalOpen && <ArtModel handleClose={handleCloseModal} />}
              </div>
            </div>
          </div>
        </Container>
      )}
    </div>
  );
};

export default CategoryDetail;
