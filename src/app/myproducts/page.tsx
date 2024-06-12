"use client";
import {
  setLoader,
  showToast,
} from "@/components/redux/slices/appConfiigSlice";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/components/utils/auxifunctions";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  ProductCardProps,
  ProductDetailsProp,
  TITLE_LENGTH,
} from "../../components/utils/type";
import { ProductCard } from "@/components/hero/ProductCard";
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
      <Button variant={"ghost"} className="mt-4 sm:mt-20 -full flex items-center justify-center">
        Loading...
      </Button>
    );
  }
  if(typeof productList !== typeof [])return
  return (
    <div className="px-2 sm:px-10">
      <div className="text-center w-full text-3xl font-bold my-6">
        My Products
      </div>
      <div></div>
      <div className="flex flex-wrap gap-8">
        {productList && productList.length > 0 &&
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
