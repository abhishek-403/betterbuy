"use client"
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ProductCardProps, TITLE_LENGTH } from "../utils/type";
import { setLoader, showToast } from "../redux/slices/appConfiigSlice";
import axios from "axios";
import { Button } from "../ui/button";
import { formatPrice } from "../utils/auxifunctions";
import Link from "next/link";

export function ProductCard({
  name,
  price,
  image,
  currency,
  url,
  id,
  alltimelowprice,
  alltimehighprice,
  fetchProducts,
}: ProductCardProps): any {
  const dispatch = useDispatch();
  const [isRemoveLoading, setIsRemoveLoading] = useState<boolean>(false);
  async function removeProduct() {
    try {
      dispatch(setLoader(true));
      setIsRemoveLoading(true);
      const res = await axios.post("/api/removeproduct", { id });

      dispatch(
        showToast({
          type: res.data.status,
          message: res.data.result,
        })
      );
      if (!fetchProducts) return;
      fetchProducts();
    } catch (e) {
    } finally {
      dispatch(setLoader(false));
      setIsRemoveLoading(false);
    }
  }

  return (
    <div className="flex flex-col w-[400px] items-center gap-8 border-2 p-4">
      <div className="flex flex-col gap-6 items-center">
        <div className="bg-zinc-100 rounded-lg">
          <img
            src={image}
            alt=""
            className="w-[300px] aspect-square object-contain mix-blend-multiply"
          />
        </div>
        <div className="text-xl font-base">
          {name.length >= TITLE_LENGTH ? (
            <p>{name.substring(0, TITLE_LENGTH)}...</p>
          ) : (
            name
          )}
        </div>
      </div>
      <div className="w-full mt-auto px-2 flex flex-col gap-6 ">
        <div className="flex flex-col  gap-2">
          <Button
            variant={"secondary"}
            className="flex gap-2 py-6  font-bold text-xl"
          >
            <div>Current price :</div>
            <div className="flex gap-1">
              <div>{currency}</div>
              <div className="">{formatPrice(price)}</div>
            </div>
          </Button>
          <Button
            variant={"outline"}
            className="flex gap-2 py-6  font-bold text-xl"
          >
            <div>Lowest price :</div>
            <div className="flex gap-1">
              <div>{currency}</div>
              <div className="">{formatPrice(alltimelowprice)}</div>
            </div>
          </Button>
          <Button
            variant={"outline"}
            className="flex gap-2 py-6  font-bold text-xl"
          >
            <div>Highest price :</div>
            <div className="flex gap-1">
              <div>{currency}</div>
              <div className="">{formatPrice(alltimehighprice)}</div>
            </div>
          </Button>
        </div>
      </div>
      <div className="w-full justify-between flex mt-4 gap-2  ">
        <Link href={url} target="_blank" className="flex-1">
          <Button variant={"quarterny"}>Buy now</Button>
        </Link>
        <Button
          variant={"destructive"}
          onClick={removeProduct}
          disabled={isRemoveLoading}
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
