"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { ProductDetails, STAGES } from "../constants/type";
import ProductDetail from "./ProductDetail";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
type Props = {};

export default function Hero({}: Props) {
  const toastData = useSelector(
    (state: any) => state.appConfigReducer.toastData
  );

  const [details, setDetails] = useState<ProductDetails>({
    name: "SAMSUNG GT-1200  (Black)",
    price: "₹6,380",
    img: "",
    // const [details, setDetails] = useState<ProductDetails>({
    //   name: "",
    //   price: "",
    //   img: "",
  });
  const [url, setUrl] = useState("");

  async function handleClick() {
    try {
      if (!url) return;
      let response = await axios.post("/api/scrape", {
        url,
      });
      console.log(response.data.response);
      setDetails(response.data.response);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
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


      default:
    }
  }, [toastData]);

  return (
    <div className="flex flex-col ">
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="dark"
      />
      <div className="w-full flex gap-4 items-center ">
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

      <ProductDetail details={details} />
    </div>
  );
}
