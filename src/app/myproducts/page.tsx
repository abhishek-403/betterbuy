"use client";
import React, { useEffect, useState } from "react";
import {
  ProductCardProps,
  ProductDetailsProp,
  TITLE_LENGTH,
} from "../../components/utils/type";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Appbar } from "@/components/AppBar";
import Link from "next/link";
import { formatPrice } from "@/components/utils/auxifunctions";
import { useDispatch } from "react-redux";
import {
  setLoader,
  showToast,
} from "@/components/redux/slices/appConfiigSlice";
type Props = {};

export default function MyProducts({}: Props) {
  const [productList, setProductList] = useState<ProductDetailsProp[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setIsLoading(true);
      const p = await axios.get("/api/getproducts");

      setProductList(p.data.result);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="w-full mt-20 -full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="px-10">
      <div className="text-center w-full text-3xl font-bold my-6">
        My Products
      </div>
      <div></div>
      <div className="flex flex-wrap gap-8">
        {productList.length > 0 &&
          productList.map((product, i) => {
            return (
              <ProductCard
                key={i}
                {...product}
                id={product.id}
                fetchProducts={fetchProducts}
              />
            );
          })}
      </div>
    </div>
  );
}

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
}: ProductCardProps) {
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
              <div className="">
                {alltimelowprice === null
                  ? formatPrice(price)
                  : formatPrice(alltimelowprice!)}
              </div>
            </div>
          </Button>
          <Button
            variant={"outline"}
            className="flex gap-2 py-6  font-bold text-xl"
          >
            <div>Highest price :</div>
            <div className="flex gap-1">
              <div>{currency}</div>
              <div className="">
                {alltimehighprice === null
                  ? formatPrice(price)
                  : formatPrice(alltimehighprice!)}
              </div>
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
