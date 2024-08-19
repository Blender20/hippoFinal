import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { OrderTypes, ProductProps } from "../../type";
import { db } from "../lib/firebase";
import { store } from "../lib/store";
import Container from "../ui/Container";
import Loading from "../ui/Loading";
import FormattedPrice from "../ui/FormattedPrice";
import { Link, useNavigate } from "react-router-dom";

const Orders = () => {
  const { currentUser } = store();
  const [orders, setOrders] = useState<OrderTypes[]>([]);
  console.log("🚀 ~ Orders ~ orders:", orders)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        if (currentUser?.email) {
          // Reference to the orders collection
          const ordersCollectionRef = collection(db, "orders");

          // Query to fetch orders for the current user
          const q = query(ordersCollectionRef, where("Useremail", "==", currentUser.email));

          // Get the documents
          const querySnapshot = await getDocs(q);

          // Extract the data from the documents
          const ordersList = querySnapshot.docs.map((doc) => doc.data() as OrderTypes);
          console.log("🚀 ~ getData ~ ordersList:", ordersList)
          setOrders(ordersList);
        } else {
          console.log("No user is logged in");
        }
      } catch (error) {
        console.log("Data fetching error", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [currentUser?.email]);

  return (
    <Container>
      {loading ? (
        <Loading />
      ) : orders.length > 0 ? (
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mt-1">Customer order details</h2>
          <p className="text-gray-600">
            Customer Name:{" "}
            <span className="text-black font-semibold">
              {currentUser?.firstName} {currentUser?.lastName}
            </span>
          </p>
          <p className="text-gray-600">
            Total Orders:{" "}
            <span className="text-black font-semibold">{orders.length}</span>
          </p>
          <p className="text-sm max-w-[600px] tracking-wide text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem iste
            nostrum voluptate, accusantium cum officia aliquid? Laboriosam
            dolores neque est?
          </p>
          <div className="flex flex-col gap-3">
            <div className="space-y-6 divide-y divide-gray-900/10">
              {orders.map((order) => {
                // const totalAmount = order?.orderItems.reduce(
                //   (acc, item) =>
                //     acc + (item.discountedPrice * item.quantity || 0),
                //   0
                // );
                return (
                  <Disclosure as="div" key={order.paymentIntentId} className="pt-6">
                    {({ open }) => (
                      <>
                        <dt>
                          <DisclosureButton className="flex w-full items-start justify-between text-left text-gray-900">
                            <span className="text-base font-semibold leading-7">
                              Tracking number :{" "}
                              <span className="font-normal">
                                {order.paymentIntentId}
                              </span>
                            </span>
                            <span className="ml-6 flex h-7 items-center">
                              {open ? (
                                <FaMinus className="h-6 w-6" aria-hidden="true" />
                              ) : (
                                <FaPlus className="h-6 w-6" aria-hidden="true" />
                              )}
                            </span>
                          </DisclosureButton>
                        </dt>
                        <DisclosurePanel as="dd" className="mt-5 pr-12">
                          <div className="flex flex-col gap-2 bg-[#f4f4f480] p-5 border border-gray-200">
                            <p className="text-base font-semibold">
                              Your order{" "}
                              <span className="text-skyText">
                                #{order?.paymentIntentId.substring(0, 20)}...
                              </span>{" "}
                              has shipped and will be with you soon.
                            </p>
                            <div className="flex flex-col gap-1">
                              <p className="text-gray-600">
                                Order Item Count:{" "}
                                <span className="text-black font-medium">
                                  {order.orderItems.length}
                                </span>
                              </p>
                              <p className="text-gray-600">
                                Payment Status:{" "}
                                <span className="text-black font-medium">
                                  {order.paymentStatus}
                                </span>
                              </p>
                              <p className="text-gray-600">
                                Order Amount:{" "}
                                <span className="text-black font-medium">
                                  <FormattedPrice amount={order.subTotal} />
                                </span>
                              </p>
                            </div>
                            {order.orderItems.map((item) => (
                              <div
                                key={item.productId}
                                className="flex space-x-6 border-b border-gray-200 py-3"
                              >
                                <Link
                                  to={`/product/${item.productId}`}
                                  className="h-20 w-20 flex-none sm:h-40 sm:w-40 rounded-lg bg-gray-100 border border-gray-300 hover:border-skyText overflow-hidden"
                                >
                                  <img
                                    src={item.productimage || '/path/to/default/image.jpg'}
                                    alt="productImage"
                                    className="h-full w-full object-cover object-center hover:scale-110 duration-300"
                                  />
                                </Link>
                                <div className="flex flex-auto flex-col">
                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      <Link to={`/product/${item.productId}`}>
                                        {item.name}
                                      </Link>
                                    </h4>
                                    <p className="mt-2 text-sm text-gray-600">
                                      {item.description}
                                    </p>
                                  </div>
                                  <div className="mt-6 flex flex-1 items-end">
                                    <dl className="flex space-x-4 divide-x divide-gray-200 text-sm sm:space-x-6">
                                      <div className="flex">
                                        <dt className="font-medium text-gray-900">
                                          Quantity
                                        </dt>
                                        <dd className="ml-2 text-gray-700">
                                          {item.quantity}
                                        </dd>
                                      </div>
                                      <div className="flex pl-4 sm:pl-6">
                                        <dt className="text-black font-bold">
                                          Price
                                        </dt>
                                        <dd className="ml-2 text-gray-700">
                                          <span className="text-black font-bold">
                                            <FormattedPrice amount={item.price} />
                                          </span>
                                        </dd>
                                      </div>
                                      <div className="flex pl-4 sm:pl-6">
                                        <dt className="font-medium text-gray-900">
                                          SubTotal
                                        </dt>
                                        <dd className="ml-2 text-gray-700">
                                          <span className="text-black font-bold">
                                            <FormattedPrice amount={item.price * item.quantity} />
                                          </span>
                                        </dd>
                                      </div>
                                    </dl>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-2xl font-semibold">No orders yet</p>
          <p>You did not create any purchase from us</p>
          <Link
            to={"/product"}
            className="mt-2 bg-gray-800 text-gray-100 px-6 py-2 rounded-md hover:bg-black hover:text-white duration-200"
          >
            Go to Shopping
          </Link>
        </div>
      )}
    </Container>
  );
};

export default Orders;
