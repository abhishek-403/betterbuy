import React from "react";
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

  async function handleTrack() {
    let request = axios.post("/api/addproduct", {
      name: details.name,
      price: details.price,
      currency: details.currency,
      image: details.image,
      provider: details.provider,
      url: details.url,
    });

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
    <div className="flex gap-2 ">
      <div className="flex  ">
        {details.image && (
          <img alt="" className="p-4  w-[350px] mix- " src={details.image} />
        )}
      </div>
      <div className="flex flex-col gap-4 p-4 mt-4  ">
        <div className="text-xl font-bold max-w-[500px] ">{details.name}</div>
        <div className="flex">
          <div className="text-xl font-bold">{details.currency}</div>
          <div className="text-xl font-bold">{formatPrice(details.price)}</div>
        </div>
        <Button
          onClick={handleTrack}
          variant={"destructive"}
          className="mx-auto mt-auto text-xl font-bold w-32 h-12"
        >
          Track
        </Button>
      </div>
      <div></div>
    </div>
  );
}
