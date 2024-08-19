import { Link } from "react-router-dom";
import Container from "./Container";
import Title from "./Title";
import {
  discountImgOne,
  discountImgTwo,
} from "../assets";

const DiscountBanner = () => {
  const popularSearchItems = [
    { title: "Business Cards", link: "businessCards" },
    { title: "Clear Stickers", link: "clearStickers" },
    { title: "Sticker Sheet", link: "stickerSheet" },
    { title: "Square Label", link: "squareLabel" },
    { title: "Die-Cut", link: "dieCut" },
    { title: "Bumper Stickers", link: "bumperStickers" },
  ];
  return (
    <Container>
      <div>
        <Title text="Popular Search" />

        <div className="w-full h-[1px] bg-gray-200 mt-3" />
      </div>
      <div className="my-7 flex items-center flex-wrap gap-4">
        {popularSearchItems?.map(({ title, link }) => (
          <Link
            to={`/category/${link}`}
            key={title}
            className="border-[1px] border-gray-300 px-8 py-3 rounded-full capitalize font-medium hover:bg-black hover:text-white duration-200"
          >
            {title}
          </Link>
        ))}
      </div>
      <div className="w-full py-5 md:py-0 bg-[#F6F6F6] rounded-lg flex items-center justify-between overflow-hidden">
        <img
          src={discountImgOne}
          alt="discountImgOne"
          className="hidden lg:inline-flex h-36"
        />
        <div className="flex flex-1 flex-col gap-1 items-center">
          <div className="flex items-center justify-center gap-x-3 text-xl md:text-4xl font-bold">
            <h2>Business Cards Sticker</h2>
            <Link
              to={"/product"}
              className="border border-red-600 px-4 py-2 text-xl md:text-3xl text-red-600 rounded-full"
            >
              Discount 20%
            </Link>
          </div>
          <p className="text-sm text-gray-600 font-medium">
            You’re out to play or stepping out to make
          </p>
        </div>
        <img
          src={discountImgTwo}
          alt="discountImgTwo"
          className="hidden lg:inline-flex h-36"
        />
      </div>
      <div className="mt-7">
        <p className="font-bold text-2xl">Categories We Distribute</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mt-7">
          <div className="border border-r-0 border-gray-300 flex items-center justify-center px-6 py-2 cursor-pointer group">
            <img
              src="https://i.ibb.co/CQHVZTQ/img12.jpg"
              alt="brandOne"
              className="w-36 h-auto group-hover:opacity-50 duration-200"
            />
          </div>
          <div className="border border-r-0 border-gray-300 flex items-center justify-center px-6 py-2 cursor-pointer group">
            <img
              src="https://i.ibb.co/nB77bGW/img10.jpg"
              alt="brandTwo"
              className="w-36 h-auto group-hover:opacity-50 duration-200"
            />
          </div>
          <div className="border border-r-0 border-gray-300 flex items-center justify-center px-6 py-2 cursor-pointer group">
            <img
              src="https://i.ibb.co/B3MmXXc/img8.jpg"
              alt="brandThree"
              className="w-36 h-auto group-hover:opacity-50 duration-200"
            />
          </div>
          <div className="border border-r-0 border-gray-300 flex items-center justify-center px-6 py-2 cursor-pointer group">
            <img
              src="https://i.ibb.co/F7hvhm7/img2.jpg"
              alt="brandFour"
              className="w-36 h-auto group-hover:opacity-50 duration-200"
            />
          </div>
          <div className="border border-r-0 border-gray-300 flex items-center justify-center px-6 py-2 cursor-pointer group">
            <img
              src="https://i.ibb.co/ssSdwR3/img4.jpg"
              alt="brandFive"
              className="w-36 h-auto group-hover:opacity-50 duration-200"
            />
          </div>
          <div className="border border-gray-300 flex items-center justify-center px-6 py-2 cursor-pointer group">
            <img
              src="https://i.ibb.co/whbkrX4/img9.jpg"
              alt="brandSix"
              className="w-36 h-auto group-hover:opacity-50 duration-200"
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default DiscountBanner;
