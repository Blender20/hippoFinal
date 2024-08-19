import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    useStripe,
    useElements,
    CardElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { store } from "../../lib/store";
import { db } from "../../lib/firebase";
import { addDoc, collection } from "firebase/firestore";


const stripePromise = loadStripe("pk_test_51NpKQwCBm5BqwGDQTu91jprlfOGZ7Kx8uaoePyRajcrJWprV2Orog1YSuxDF3GJSZZm2nbBVUzgp1vOZVnBzSmNC00fPq4vqyV");

const CheckoutForm = ({ address, setPaymentDetail }) => {
    // const subtotal = store((state) => state.cartProduct.reduce((acc, item) => acc + item.discountedPrice * item.quantity, 0));
    const subtotal = store((state) => state.cartProduct?.reduce((acc, item) => acc + (item.totalCost || item.discountedPrice) * item.quantity, 0));
    const stripe = useStripe();
    const elements = useElements();
    const { currentUser } = store();
    const cart = store((state) => state.cartProduct);
    console.log("🚀 ~ CheckoutForm ~ cart:", cart)

    const [paymentData, setPaymentData] = useState({ name: "" });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPaymentData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const orderData = {
            shippingInfo: {
                Customername: address?.firstName || '',
                Customerlastname: address?.lastName || '',
                email: address?.email || '',
                shippingcountry: address?.country || '',
                shippingstate: address?.state || '',
                address: address?.streetAddress || '',
                phone: address?.phone || '',
                city: address?.city || '',
                zip: address?.zip || '',
            },
            creditCardDetails: {
                nameOnCard: address?.firstName || '',
            },
            billingAddress: {
                streetAddress: address?.streetAddress || '',
                city: address?.city || '',
                state: address?.state || '',
                zipCode: address?.zip || '',
            },
            subTotal: (parseFloat(subtotal) + 35).toFixed(2),
            orderItems: cart?.map((item) => ({
                name: item?.name || '',
                quantity: item?.quantity || 0,
                productId: item?._id || '',
                productimage: item?.images?.[0] || '',
                category: item?.category || '',
                price: item?.regularPrice || 0,
                discountprice: item?.discountedPrice || 0,
                artImages: item?.artImages || [],
            })),
            Categoryitems: cart?.map((item) => ({
                sticker: item?.selectedOptions || '',
            })),
            orderStatus: "pending",
            Useremail: currentUser?.email || '',
        };

        // Check if stripe and elements are ready
        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);
        setIsLoading(true);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
            billing_details: {
                name: paymentData.name || '',
                address: {
                    line1: address?.streetAddress || '',
                    line2: address?.unitNumber || '',
                    city: address?.city || '',
                    state: address?.state || '',
                    postal_code: address?.zip || '',
                    country: "US",
                },
            },
        });

        if (error) {
            toast.error("Create Payment Method Error:", error.message);
            setIsLoading(false);
        } else {
            const totalAmount = (parseFloat(subtotal) + 35).toFixed(2);

            const { data } = await axios.post(
                `https://hippo-be.onrender.com/create-payment-intent`,
                {
                    paymentMethodId: paymentMethod.id,
                    amount: Math.floor(totalAmount * 100),
                }
            );
            const { clientSecret } = data;

            const { paymentIntent, error: confirmError } =
                await stripe.confirmCardPayment(clientSecret, {
                    payment_method: paymentMethod.id,
                });

            if (confirmError) {
                toast.error("Confirm Payment Error:", confirmError.message);
                setIsLoading(false);
            } else {
                setIsLoading(false);
                setPaymentDetail(paymentIntent);
                store.getState().resetCart();
                toast.success("Order Placed successfully");
                localStorage.removeItem("cartProduct");
                localStorage.removeItem("persist:root");
                localStorage.removeItem("artImages")

                // Save order to Firebase
                try {
                    await addDoc(collection(db, "orders"), {
                        ...orderData,
                        paymentIntentId: paymentIntent.id,
                        paymentStatus: paymentIntent.status,
                        createdAt: new Date(),
                    });
                    setPaymentDetail("")
                    navigate('/');
                } catch (firebaseError) {
                    toast.error("Firebase Error: " + firebaseError.message);
                }
            }
        }
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="w-full mx-auto p-4 bg-white border-t border-gray-300"
        >
            <h2 className="text-2xl font-bold mb-4">Pay with your credit card.</h2>
            <div className="mb-4">
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    Name on Card
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={paymentData.name}
                    onChange={handleInputChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                    required
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="card-element"
                    className="block text-sm font-medium text-gray-700"
                >
                    Card Details
                </label>
                <CardElement
                    id="card-element"
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#000",
                                "::placeholder": {
                                    color: "#ccc",
                                },
                            },
                        },
                    }}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                    required
                />
            </div>
            {isLoading ? (
                <div className="flex items-center justify-center h-[50px] mt-10">
                    <div className="loader"></div>
                </div>
            ) : (
                <button
                    onClick={handleSubmit}
                    type="submit"
                    className="w-full bg-black text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2  focus:ring-offset-2"
                    disabled={!stripe}
                >
                    Pay ${(parseFloat(subtotal) + 35).toFixed(2)}
                </button>
            )}
        </form>
    );
};

const Billing = ({ address, setPaymentDetail }) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm address={address} setPaymentDetail={setPaymentDetail} />
        </Elements>
    );
};

export default Billing;
