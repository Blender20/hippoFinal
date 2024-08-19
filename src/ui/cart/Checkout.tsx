import React, { useState } from "react";
import toast from 'react-hot-toast';
import Debiticon from "../../../public/debititicon.svg";
import { store } from "../../lib/store";
// import CheckoutBtn from "./CheckoutBtn";
import Paybill from "./Paybill"

const Checkout = () => {
    const { cartProduct } = store();
    console.log("🚀 ~ Checkout ~ cartProduct:", cartProduct);

    const shippingAmt = 20;
    const taxAmt = 15;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        country: '',
        streetAddress: '',
        apartment: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        email: '',
        newsUpdates: false,
        shipDifferentAddress: false,
    });

    const [formCompleted, setFormCompleted] = useState(false);
    const [ShowaddressForm, setAddressForm] = useState(false);
    const [paymentDetail, setPaymentDetail] = useState(null)


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleAddress = () => {
        setAddressForm((prevState) => !prevState);
        setFormData((prevState) => ({
            ...prevState,
            shipDifferentAddress: !prevState.shipDifferentAddress,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const requiredFields = [
            'firstName',
            'lastName',
            'country',
            'streetAddress',
            'city',
            'state',
            'zip',
            'phone',
            'email',
        ];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields?.length > 0) {
            toast.error(
                `Please fill in the following fields: ${missingFields.join(', ')}`
            );
            setFormCompleted(false);
        } else {
            setFormCompleted(true);
        }
    };

    const totalAmt = cartProduct?.reduce(
        (acc, item) => acc + (item.totalCost || item.discountedPrice) * item.quantity,
        0
    );
    return (
        <div className='flex flex-col md:flex-row bg-gray-100'>
            <div className='w-full md:max-w-[50%] px-8 py-6'>
                <h2 className='text-xl font-semibold mb-4'>Billing Details</h2>
                <form>
                    {/* Form fields here */}
                    <div className='mb-4 flex'>
                        <div className='w-1/2 pr-2'>
                            <label htmlFor='firstName' className='block text-sm font-medium text-gray-700'>
                                First Name <span className='text-red-600'>*</span>
                            </label>
                            <input
                                type='text'
                                id='firstName'
                                name='firstName'
                                className='mt-1 p-2 w-full border bg-gray-100 focus:outline-none focus:border-gray-300'
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='w-1/2 pl-2'>
                            <label htmlFor='lastName' className='block text-sm font-medium text-gray-700'>
                                Last Name <span className='text-red-600'>*</span>
                            </label>
                            <input
                                type='text'
                                id='lastName'
                                name='lastName'
                                className='mt-1 p-2 w-full border bg-gray-100 focus:outline-none focus:border-gray-300'
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='country' className='block text-sm font-medium text-gray-700'>
                            Country / Region <span className='text-red-600'>*</span>
                        </label>
                        <input
                            type='text'
                            id='country'
                            name='country'
                            className='mt-1 p-2 w-full border bg-gray-100 focus:outline-none focus:border-gray-300'
                            value={formData.country}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='streetAddress' className='block text-sm font-medium text-gray-700'>
                            Street Address <span className='text-red-600'>*</span>
                        </label>
                        <input
                            type='text'
                            id='streetAddress'
                            name='streetAddress'
                            className='mt-1 p-2 w-full border bg-gray-100 focus:outline-none focus:border-gray-300 placeholder-gray-500'
                            value={formData.streetAddress}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mb-4'>
                        <input
                            type='text'
                            id='apartment'
                            name='apartment'
                            className='mt-1 p-2 w-full border bg-gray-100 focus:outline-none focus:border-gray-300 placeholder-gray-500'
                            placeholder='Apartment, suite, unit, etc. (optional)'
                            value={formData.apartment}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='city' className='block text-sm font-medium text-gray-700'>
                            Town / City <span className='text-red-600'>*</span>
                        </label>
                        <input
                            type='text'
                            id='city'
                            name='city'
                            className='mt-1 p-2 w-full border bg-gray-100 focus:outline-none focus:border-gray-300'
                            value={formData.city}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='state' className='block text-sm font-medium text-gray-700'>
                            State / Country <span className='text-red-600'>*</span>
                        </label>
                        <input
                            type='text'
                            id='state'
                            name='state'
                            className='mt-1 p-2 w-full border bg-gray-100 focus:outline-none focus:border-gray-300'
                            value={formData.state}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='zip' className='block text-sm font-medium text-gray-700'>
                            Postcode / ZIP <span className='text-red-600'>*</span>
                        </label>
                        <input
                            type='text'
                            id='zip'
                            name='zip'
                            className='mt-1 p-2 w-full border bg-gray-100 focus:outline-none focus:border-gray-300'
                            value={formData.zip}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                            Phone <span className='text-red-600'>*</span>
                        </label>
                        <input
                            type='tel'
                            id='phone'
                            name='phone'
                            className='mt-1 p-2 w-full border bg-gray-100 focus:outline-none focus:border-gray-300'
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                            Email Address <span className='text-red-600'>*</span>
                        </label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            className='mt-1 p-2 w-full border bg-gray-100 focus:outline-none focus:border-gray-300'
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='mb-4'>
                        <div className='flex items-center'>
                            <input
                                type='checkbox'
                                id='newsUpdates'
                                name='newsUpdates'
                                className='mr-2'
                                checked={formData.newsUpdates}
                                onChange={handleChange}
                            />
                            <label
                                htmlFor='newsUpdates'
                                className='block text-sm font-medium text-gray-700'
                            >
                                Keep me up-to-date with news & exclusive offers (optional)
                            </label>
                        </div>
                    </div>
                    <div className='mb-4'>
                        <div className='flex items-center'>
                            <input
                                type='checkbox'
                                id='shipDifferentAddress'
                                name='shipDifferentAddress'
                                className='mr-2'
                                onChange={handleAddress}
                                checked={formData.shipDifferentAddress}
                            />
                            <label
                                htmlFor='shipDifferentAddress'
                                className='block text-sm font-medium text-gray-700'
                            >
                                Ship to a different address?
                            </label>
                        </div>
                    </div>
                    <div className='mb-4'>
                        <label
                            htmlFor='orderNotes'
                            className='block text-sm font-medium text-gray-700'
                        >
                            Order notes (optional)
                        </label>
                        <textarea
                            id='orderNotes'
                            name='orderNotes'
                            className='mt-1 p-2 w-full border bg-gray-100 focus:outline-none focus:border-gray-300 '
                        ></textarea>
                    </div>
                </form>
            </div>

            <div className='md:ml-4 flex-grow'>
                <div className='mx-6 md:mx-10 md:px-10 py-5'>
                    <h2 className='text-xl font-semibold mb-4 text-center'>YOUR ORDER</h2>
                    <div className='flex flex-col bg-white px-5 py-5'>
                        <div className='border-b border-gray-300 mt-5'>
                            <div className='flex justify-between mb-5'>
                                <h3 className='palanquin-dark-regular text-3xs'>PRODUCT</h3>
                                <p className='palanquin-regular'>SUBTOTAL</p>
                            </div>
                        </div>
                        {cartProduct?.map((item) => (
                            <div className='mt-4' key={item.id}>
                                <div className='flex flex-row justify-between'>
                                    <div className='w-2/3'>
                                        <h3 className='palanquin-dark-regular text-lg'>
                                            {item.name} &nbsp;
                                            <span className='text-lg font-extralight '>
                                                × {item.quantity}
                                            </span>
                                        </h3>
                                    </div>
                                    <div className='text-right'>
                                        <p className='palanquin-regular text-xl text-right'>
                                            ${(item.totalCost || item.discountedPrice) * item.quantity}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className='border-b border-gray-300 mt-5'>
                            <div className='flex justify-between mb-5'>
                                <h3 className='palanquin-dark-regular text-3xs'>SHIPPING</h3>
                                <p className='palanquin-regular text-xl'>
                                    ${shippingAmt.toFixed(2)}
                                </p>
                            </div>
                            <div className='flex justify-between mb-5'>
                                <h3 className='palanquin-dark-regular text-3xs'>Tax</h3>
                                <p className='palanquin-regular text-xl'>
                                    ${taxAmt.toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <div className='border-b border-gray-300 mt-5'>
                            <div className='flex justify-between mb-5'>
                                <h3 className='palanquin-dark-regular text-3xs'>SUBTOTAL</h3>
                                <p className='palanquin-regular text-xl font-bold'>
                                    ${(totalAmt + shippingAmt + taxAmt).toFixed(2)}
                                </p>
                            </div>
                            <button
                                className={`mt-3 w-full bg-[#2C2E2F] text-white py-2 rounded focus:outline-none focus:shadow-outline 
                    ${formCompleted ? 'hidden' : ''}`}
                                type='button'
                                onClick={handleSubmit}
                            >
                                <span className='flex justify-center gap-2 items-center'>
                                    <img src={Debiticon} className='w-5 h-5' alt='' />
                                    Debit or Credit Card
                                </span>
                            </button>
                            {/* {formCompleted && (
                                <CheckoutBtn
                                    products={cartProduct}
                                    totalAmt={totalAmt + shippingAmt + taxAmt}
                                />
                            )} */}
                            {formCompleted && (
                                <Paybill
                                    Subtotal={totalAmt + shippingAmt + taxAmt}
                                    address={formData}
                                    setPaymentDetail={setPaymentDetail}
                                    setFormData={setFormData}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Checkout;
