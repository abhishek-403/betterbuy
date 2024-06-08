import React from "react";
import { ProductDetails, STAGES } from "../constants/type";
import Image from "next/image";
import image from "@/components/assets/testimg.jpg";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { showToast } from "../redux/slices/appConfiigSlice";
import axios from "axios";
type Props = {
  details: ProductDetails;
};

export default function ProductDetail({ details }: Props) {
  const dispatch = useDispatch();

  async function handleTrack() {
    // dispatch(
    //   showToast({
    //     type: STAGES.LOADING,
    //     message: { message: "Loading..." },
    //   })
    // );


    let data = await axios.post("/api/user", {
      name: details.name,
      amount: details.price,
      image: details.img,
   
    });
    console.log(data);

    dispatch(
      showToast({
        type: STAGES.SUCCESS,
        message: { message: "Success" },
      })
    );
  }
  if (!details.name) {
    return <div>No details</div>;
  }
  return (
    <div className="flex gap-2 ">
      <div className="flex  ">
        {/* {details.img && ( */}
        {details.img || (
          <Image alt="" className="p-4  w-[350px] mix- " src={image} />
        )}
      </div>
      <div className="flex flex-col gap-4 p-4 mt-4  ">
        <div className="text-xl font-bold max-w-[500px] ">{details.name}</div>
        <div className="text-xl font-bold">{details.price}</div>
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
