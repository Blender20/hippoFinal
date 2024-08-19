import { IoClose } from "react-icons/io5";
import { ProductProps } from "../../../type";
import AddToCardBtn from "../AddToCardBtn";
import FormattedPrice from "../FormattedPrice";
import { store } from "../../lib/store";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const CartProduct = ({ product }: { product: ProductProps }) => {
  const { removeFromCart } = store();

  const handleRemoveProduct = () => {
    if (product) {
      removeFromCart(product?._id);
      toast.success(`${product?.name.substring(0, 20)} deleted successfully!`);
    }
  };

  return (
    <div key={product?._id} className="flex py-6 sm:py-10">
      <Link to={`/product/${product?._id}`}>
        <img
          src={product?.images[0]}
          alt="productImage"
          className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48 border border-skyText/30 hover:border-skyText duration-300"
        />
      </Link>

      <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="relative pr-9 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:pr-0">
          <div className="flex flex-col gap-1 col-span-3">
            <h3 className="text-base font-semibold w-full">{product?.name}</h3>
            {/* <p className="text-xs">
              Brand: <span className="font-medium">{product?.brand}</span>
            </p> */}
            <p className="text-xs">
              Category: <span className="font-medium">{product?.category}</span>
            </p>
            <div className="flex items-center gap-6 mt-2">
              <p className="text-base font-semibold">
                <FormattedPrice
                  amount={(product?.itemCost || product.discountedPrice) * product.quantity}
                />
              </p>
              <AddToCardBtn product={product} showPrice={false} />
            </div>
          </div>

          <div className="mt-4 sm:mt-0 sm:pr-9">
            <div className="absolute right-0 top-0">
              <button
                onClick={handleRemoveProduct}
                type="button"
                className="-m-2 inline-flex p-2 text-gray-600 hover:text-red-600"
              >
                <span className="sr-only">Remove</span>
                <IoClose className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs">
            {product.details?.Format && (
              <>
                Format: <span className="font-medium mr-2">{product.details?.Format}</span>
              </>
            )}
            {product.details?.Material && (
              <>
                Material: <span className="font-medium mr-2">{product.details?.Material}</span>
              </>
            )}
            {product.details?.["Printed Sides"] && (
              <>
                Printed Sides: <span className="font-medium mr-2">{product.details?.["Printed Sides"]}</span>
              </>
            )}
            {product.details?.Paper && (
              <>
                Paper: <span className="font-medium mr-2">{product.details?.Paper}</span>
              </>
            )}
            {product.details?.Shape && (
              <>
                Shape: <span className="font-medium mr-2">{product.details?.Shape}</span>
              </>
            )}
            {product.details?.Size && (
              <>
                Size: <span className="font-medium mr-2">{product.details?.Size}</span>
              </>
            )}
            {product.details?.["Rounded Corner"] && (
              <>
                Rounded Corners: <span className="font-medium mr-2">{product.details?.["Rounded Corner"]}</span>
              </>
            )}
            {product.details?.Ink && (
              <>
                Ink: <span className="font-medium mr-2">{product.details?.Ink}</span>
              </>
            )}
            {product.details?.Direction && (
              <>
                Direction: <span className="font-medium mr-2">{product.details?.Direction}</span>
              </>
            )}
            {product.details?.Colors && (
              <>
                Color: <span className="font-medium mr-2">{product.details?.Colors}</span>
              </>
            )}
          </p>
          <p>
            You are saving{" "}
            <span className="text-sm font-semibold text-green-500">
              <FormattedPrice
                amount={product?.regularPrice! - product?.discountedPrice!}
              />
            </span>{" "}
            upon purchase
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
