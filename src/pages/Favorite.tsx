import { store } from "../lib/store";
import Container from "../ui/Container";
import ProductCard from "../ui/ProductCard";

const Favorite = () => {
  const favoriteProduct = store((state) => state.favoriteProduct);

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-4">Your Favorite Items</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteProduct.length > 0 ? (
          favoriteProduct.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))
        ) : (
          <p>You have no favorite items.</p>
        )}
      </div>
    </Container>
  );
};

export default Favorite;
