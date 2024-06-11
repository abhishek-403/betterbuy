"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import {
  ProductCardProps,
  ProductDetailsProp,
  STAGES,
  TITLE_LENGTH,
} from "../utils/type";
import ProductDetail from "./ProductDetail";
import toast, { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { ModalComponent } from "../Modal";
import { getheroProducts, showToast } from "../redux/slices/appConfiigSlice";
import { ProductCard } from "@/app/myproducts/page";
import { formatPrice } from "../utils/auxifunctions";
import Link from "next/link";
type Props = {};

export default function Hero({}: Props) {
  const toastData = useSelector(
    (state: any) => state.appConfigReducer.toastData
  );

  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<ProductDetailsProp>({
    name: "",
    currency: "",
    price: 0,
    image: "",
    url: "",
    id: "",
    provider: "",
    alltimehighprice: 0,
    alltimelowprice: 0,
  });
  const [url, setUrl] = useState("");

  async function handleSearch() {
    try {
      setIsSearchLoading(true);
      if (!url) return;
      const response = await axios.post("/api/scrape", {
        url,
      });
      setDetails({ ...response.data.response, url });
    } catch (e) {
    } finally {
      setIsSearchLoading(false);
    }
  }

  useEffect(() => {
    handleToast(toastData);
  }, [toastData]);

  return (
    <div className="flex flex-col px-20 w-full">
      <Toaster
       
      />
      <div className=" flex gap-4 items-center ">
        <input
          className="w-full  h-12 px-4 p-2 rounded-xl border-2 border-[#ffffff22] focus:outline outline-[#414141]"
          placeholder="Enter product URL"
          onChange={(e) => setUrl(e.target.value)}
          type="text"
          value={url}
        />
        <Button
          onClick={handleSearch}
          variant={"secondary"}
          className="w-32 text-lg  text-white font-bold rounded-xl h-12"
          disabled={isSearchLoading}
        >
          Search
        </Button>
        <Button
          variant={"ter"}
          onClick={() => setUrl("")}
          className="w-24 text-lg  rounded-xl h-12"
        >
          Clear
        </Button>
      </div>
      {/* <Button
        onClick={async () => {
          const a = await axios.get("/api/updateproduct");
        }}
      >
        update
      </Button> */}
      <div className="flex flex-col gap-6 mt-10">
        <ProductDetail details={details} />
        <HeroProducts />
      </div>
    </div>
  );
}

function HeroProducts() {
  const dispatch = useDispatch();
  const heroproducts = useSelector((s: any) => s.appConfigReducer.heroProducts);

  useEffect(() => {
    //@ts-ignore
    dispatch(getheroProducts());
  }, []);

  return (
    <div className="flex flex-col">
      <div className="text-3xl my-4 font-bold text-center">Hero Products</div>

      <div className="w-full flex gap-4 flex-wrap">
        {heroproducts.length > 0 &&
          heroproducts.map((prod: any, i: number) => {
            return <HeroProductCard key={i} {...prod} />;
          })}
      </div>
    </div>
  );
}

export function HeroProductCard({
  name,
  price,
  image,
  currency,
  url,
  id,
  alltimelowprice,
  alltimehighprice,
}: ProductCardProps) {
  const dispatch = useDispatch();

  const [isTrackLoading, setIsTrackLoading] = useState<boolean>(false);
  async function handleTrack() {
    setIsTrackLoading(true);
    const request = axios
      .post("/api/updateproductowner", { id })
      .then(() => {
        //@ts-ignore
        dispatch(getheroProducts());
      })
      .finally(() => setIsTrackLoading(false));

    dispatch(
      showToast({
        type: STAGES.PROMISE,
        message: {
          info: {
            pending: "Tracking Product",
            success: "Product added 👌",
            error: "Error occured 🤯",
          },
          request,
        },
      })
    );
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
        <div className="text-xl font-base ">
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
          disabled={isTrackLoading}
          onClick={handleTrack}
        >
          Track
        </Button>
      </div>
    </div>
  );
}

function handleToast(toastData: any) {
  switch (toastData.type) {
    case STAGES.LOADING:
      toast.loading(toastData.message.message);
      break;

    case STAGES.SUCCESS:
      toast.success(toastData.message.message);
      break;

    case STAGES.FAILURE:
      toast.error(toastData.message.message);
      break;

    case STAGES.PROMISE:
      toast.promise(toastData.message.request, toastData.message.info);
      break;

    default:
  }
}
