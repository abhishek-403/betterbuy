"use client";
import React, { useEffect, useState } from "react";
import { ProductDetailsProp } from "../../components/constants/type";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Appbar } from "@/components/AppBar";
type Props = {};
const testList = [
  {
    createdAt: "2024-06-08T14:24:34.884Z",
    currency: "₹",
    id: 3,
    image:
      "https://rukminim2.flixcart.com/image/416/416/xif0q/headphone/r/m/g/-original-imahy33zyhngucsh.jpeg?q=70&crop=false",
    name: "boAt Immortal 131 w/ Beast Mode(40ms Low Latency), 40 Hours Playback & RGB Lights Bluetooth Headset  (Black sabre, True Wireless)",
    ownerId: "abhishek60501@gmail.com",
    price: 1,
    provider: null,
    updatedAt: "2024-06-08T14:24:34.884Z",
  },
  {
    createdAt: "2024-06-08T14:28:12.898Z",
    currency: "₹",
    id: 4,
    image:
      "https://rukminim2.flixcart.com/image/416/416/xif0q/washing-machine-new/d/4/l/-original-imagzzf7hpvrsabu.jpeg?q=70&crop=false",
    name: "Voltas Beko by A Tata Product 9 kg washing machine with Soft Closing door, Water proof IPX4 protection, Special Pulsator and Double Waterfall Semi Automatic Top Load Black, Grey  (WTT90UDX/BKGR4KGTD)",
    ownerId: "abhishek60501@gmail.com",
    price: 12690,
    provider: null,
    updatedAt: "2024-06-08T14:28:12.898Z",
  },
];
export default function MyProducts({}: Props) {
  const [productList, setProductList] = useState<ProductDetailsProp[]>([]);
  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    let p = await axios.get("/api/getproducts");
    setProductList(p.data.response);
    console.log(p.data.response);
  }
  return (
    <div className="px-10">
      <div className="text-center w-full text-3xl font-bold my-6">
        MyProducts
      </div>
      <div></div>
      <div className="flex flex-wrap gap-8">
        {productList.map((product, i) => {
          return <ProductCard key={i} {...product}  fetchProducts={fetchProducts}/>;
        })}
      </div>
    </div>
  );
}

interface ProductCardProps extends ProductDetailsProp {
  fetchProducts: () => void;
}
const TITLE_LENGTH = 70;
function ProductCard(
  { name, price, image, currency, id,fetchProducts }: ProductCardProps,
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
        <div className="flex-1">
          <Button variant={"secondary"}>Buy now</Button>
        </div>
        <Button variant={"default"}>More info</Button>
        <Button variant={"destructive"} onClick={removeProduct}>
          Remove{" "}
        </Button>
      </div>
    </div>
  );
}
