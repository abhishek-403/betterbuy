"use client";
import React, { useEffect, useState } from "react";
import { ProductDetailsProp } from "../../components/constants/type";
import axios from "axios";
type Props = {};

export default function MyProducts({}: Props) {
  const [productList, setProductList] = useState<ProductDetailsProp[]>([]);
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    console.log("reddddd");
    
    let p = await axios.get("/api/getproducts");
    setProductList(p.data.response);
    console.log(p.data.response);
  }
  return (
    <div>
      MyProducts
      {productList.map((product, i) => {
        return (
          <div key={i}>
            <div>{product.name}</div>
            <div className="flex">
              <div>{product.currency}</div>
              <div>{product.price}</div>
            </div>
            <img src={product.image} alt="" />
          </div>
        );
      })}
    </div>
  );
}
