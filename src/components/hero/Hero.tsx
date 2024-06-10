"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { ProductDetailsProp, STAGES } from "../constants/type";
import ProductDetail from "./ProductDetail";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { ModalComponent } from "../Modal";
import { getheroProducts } from "../redux/slices/appConfiigSlice";
import { ProductCard } from "@/app/myproducts/page";
type Props = {};

export default function Hero({}: Props) {
  const toastData = useSelector(
    (state: any) => state.appConfigReducer.toastData
  );

  const [details, setDetails] = useState<ProductDetailsProp>({
    name: "",
    currency: "",
    price: 0,
    image: "",
    url: "",
    id: 0,
  });
  const [url, setUrl] = useState("");

  async function handleClick() {
    try {
      if (!url) return;
      let response = await axios.post("/api/scrape", {
        url,
      });
      console.log(response.data.response);
      setDetails({ ...response.data.response, url });
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    handleToast(toastData);
  }, [toastData]);

  return (
    <div className="flex flex-col px-20 w-full">
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        theme="dark"
      />
      <div className=" flex gap-4 items-center ">
        <input
          className="w-full  h-12 px-4 p-2 rounded-xl border-2 border-[#ffffff22] focus:outline outline-[#414141]"
          placeholder="Enter product URL"
          onChange={(e) => setUrl(e.target.value)}
          type="text"
        />
        <Button
          onClick={handleClick}
          variant={"secondary"}
          className="w-32 text-lg  text-white font-bold rounded-xl h-12"
        >
          Search
        </Button>
        <Button variant={"ter"} className="w-24 text-lg  rounded-xl h-12">
          Clear
        </Button>
      </div>
      <div className="flex flex-col gap-6 mt-10">

        <ProductDetail details={details} />
        <HeroProducts />
      </div>
      {/* <ModalComponent title="This is test" message="New message" /> */}
    </div>
  );
}

function HeroProducts() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("hi ther");

    //@ts-ignore
    dispatch(getheroProducts());
  }, []);
  const heroproducts = useSelector((s: any) => s.appConfigReducer.heroProducts);
  console.log("dd", heroproducts.length);
  console.log("dd", heroproducts);

  return (
    <div className="w-full flex gap-4 flex-wrap">
      {heroproducts.length > 0 &&
        heroproducts.map((prod: any, i: number) => {
          return <ProductCard key={i} {...prod} />;
        })}
    </div>
  );
}

function handleToast(toastData: any) {
  switch (toastData.type) {
    case STAGES.LOADING:
      toast.loading(toastData.message.message);
      break;

    case STAGES.SUCCESS:
      toast.success(toastData.message.message);
      break;

    case STAGES.FAILURE:
      toast.error(toastData.message.message);
      break;

    case STAGES.PROMISE:
      toast.promise(toastData.message.request, toastData.message.info);
      break;

    default:
  }
}
