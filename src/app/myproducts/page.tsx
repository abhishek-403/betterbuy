"use client";
import React, { useEffect, useState } from "react";
import { ProductCardProps, ProductDetailsProp, TITLE_LENGTH } from "../../components/utils/type";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Appbar } from "@/components/AppBar";
import Link from "next/link";
import { formatPrice } from "@/components/utils/auxifunctions";
type Props = {};



export default function MyProducts({}: Props) {
  const [productList, setProductList] = useState<ProductDetailsProp[]>([]);
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      let p = await axios.get("/api/getproducts");
      setProductList(p.data.response);
      console.log(p.data.response);
    } catch (error) {
      console.log(error);
    }
  }``
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
  async function removeProduct() {
    try {
      const res = await axios.post("/api/removeproduct", { id });
      console.log(res.data);
      if (!fetchProducts) return;
      fetchProducts();
    } catch (e) {
      console.log(e);
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
        {/* <Button variant={"default"}>More info</Button> */}
        <Button variant={"destructive"} onClick={removeProduct}>
          Remove
        </Button>
      </div>
    </div>
  );
}

