"use client"
import React, { useState } from "react";
import { ProductDetailsProp, STAGES } from "../utils/type";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slices/appConfiigSlice";
import axios from "axios";
import { formatPrice } from "../utils/auxifunctions";
type Props = {
  details: ProductDetailsProp;
};

export default function ProductDetail({ details }: Props) {
  const dispatch = useDispatch();
  
  const [isTrackLoading, setIsTrackLoading] = useState<boolean>(false);

  async function handleTrack() {
    setIsTrackLoading(true)
    const request = axios.post("/api/addproduct", {
      name: details.name,
      price: details.price,
      currency: details.currency,
      image: details.image,
      provider: details.provider,
      url: details.url,
      id: details.id,
    }).finally(()=>setIsTrackLoading(false));

    dispatch(
      showToast({
        type: STAGES.PROMISE,
        message: {
          info: {
            pending: "Adding Product",
            success: "Product added 👌",
            error: "Error occured 🤯",
          },
          request,
        },
      })
    );
  }
  if (!details.name) {
    // return <div className="flex  m-10 items-center justify-center">No details</div>;
    return;
  }
  return (
    <div className="flex gap-2 border-2 w-fit mx-auto">
      <div className="flex bg-zinc-100 rounded-lg m-3 ">
        {details.image && (
          <img
            alt=""
            className="p-4  w-[300px] aspect-square object-contain mix-blend-multiply"
            src={details.image}
          />
        )}
      </div>
      <div className="flex flex-col gap-6 py-2  ">
        <div className="text-xl font-bold max-w-[500px] ">{details.name}</div>
        <Button
          variant={"secondary"}
          className="flex gap-2 py-6 w-fit  font-bold text-xl"
        >
          <div>Current price :</div>
          <div className="flex gap-1">
            <div>{details.currency}</div>
            <div className="">{formatPrice(details.price)}</div>
          </div>
        </Button>

        <Button
          onClick={handleTrack}
          variant={"destructive"}
          className=" mt-auto text-xl font-bold w-32 h-12"
          disabled={isTrackLoading}
        >
          Track
        </Button>
      </div>
      <div></div>
    </div>
  );
}
