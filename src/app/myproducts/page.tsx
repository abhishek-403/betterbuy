"use client";
import React, { useEffect, useState } from "react";
import { ProductDetailsProp } from "../../components/constants/type";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Appbar } from "@/components/AppBar";
import Link from "next/link";
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
  }
  return (
    <div className="px-10">
      <div className="text-center w-full text-3xl font-bold my-6">
        MyProducts
      </div>
      <div></div>
      <div className="flex flex-wrap gap-8">
        {productList.map((product, i) => {
          return <ProductCard key={i} {...product} id={product.id}  fetchProducts={fetchProducts}/>;
        })}
      </div>
    </div>
  );
}

interface ProductCardProps extends ProductDetailsProp {
  fetchProducts: () => void;
 id:number;
}
const TITLE_LENGTH = 70;
function ProductCard(
  { name, price, image, currency, url,id,fetchProducts }: ProductCardProps,
) {
  async function removeProduct() {
    try {
      const res = await axios.post("/api/removeproduct", { id });
      console.log(res.data);
      fetchProducts();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="flex flex-col max-w-[400px] items-center gap-4 border-2 p-4">
      <img
        src={image}
        alt=""
        className="w-[300px] aspect-square object-contain"
      />
      <div className="px-2 flex flex-col gap-4 ">
        <div>
          {name.length >= TITLE_LENGTH ? (
            <p>{name.substring(0, TITLE_LENGTH)}...</p>
          ) : (
            name
          )}
        </div>
        <div className="flex font-bold text-xl">
          <div>{currency}</div>
          <div className="">{price}</div>
        </div>
      </div>
      <div className="w-full justify-between flex mt-4 gap-2  ">
        <Link href={url} target="_blank" className="flex-1">
          <Button variant={"secondary"}>Buy now</Button>
        </Link>
        <Button variant={"default"}>More info</Button>
        <Button variant={"destructive"} onClick={removeProduct}>
          Remove{" "}
        </Button>
      </div>
    </div>
  );
}
