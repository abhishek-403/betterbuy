"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import {
  getHeroProduct,
  setLoader,
  showToast,
} from "../redux/slices/appConfiigSlice";
import { Button } from "../ui/button";
import { formatPrice } from "../utils/auxifunctions";
import {
  ProductCardProps,
  ProductDetailsProp,
  TITLE_LENGTH,
} from "../utils/type";
type Props = {};

export default function Hero({}: Props) {
  const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);

  const [url, setUrl] = useState("");
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

  const dispatch = useDispatch();
  async function handleSearch() {
    try {
      setIsSearchLoading(true);
      dispatch(setLoader(true));
      if (!url) return;
      const response = await axios.post("/api/scrape", {
        url,
      });

      setDetails({ ...response.data.result, url });
      dispatch(setLoader(false));
    } catch (e) {
    } finally {
      setIsSearchLoading(false);
    }
  }

  return (
    <div className="flex flex-col px-2 md:px-20 w-full">
      <div className="md:flex-row flex-col flex gap-4 items-center ">
        <input
          className="w-full  h-12 px-4 p-2 rounded-xl border-2 border-[#ffffff22] focus:outline outline-[#414141]"
          placeholder="Enter product URL"
          onChange={(e) => setUrl(e.target.value)}
          type="text"
          value={url}
        />
        <div className="flex  gap-2">
          <Button
            onClick={handleSearch}
            variant={"secondary"}
            className=" text-lg  text-white font-bold rounded-xl h-12"
            disabled={isSearchLoading}
          >
            Search
          </Button>
          <Button
            variant={"ter"}
            onClick={() => setUrl("")}
            className=" text-lg  rounded-xl h-12"
          >
            Clear
          </Button>
        </div>
      </div>
      <Button
        onClick={async () => {
          const a = await axios.post("/api/updateproduct", {
            key: "akljeoiwcnigohrn293nk219dejkf2",
            email: "abhishek605404@gmail.com",
          });
        }}
      >
        update
      </Button>
      <div className="flex flex-col gap-6 mt-4 sm:mt-10">
        <ProductDetail isSearchLoading={isSearchLoading} details={details} />
        <HeroProducts />
      </div>
    </div>
  );
}

function HeroProducts() {
  const hero = useSelector((s: any) => s.appConfigReducer.heroProducts);
  const isHeroLoading = useSelector(
    (s: any) => s.appConfigReducer.isHeroLoading
  );

  const dispatch = useDispatch();

  useEffect(() => {
    //@ts-ignore
    dispatch(getHeroProduct());
  }, []);
  if (isHeroLoading) {
    return (
      <Button variant={"ghost"} className=" mt-20 -full flex items-center justify-center">
        Loading...
      </Button>
    );
  }

  if (typeof hero !== typeof []) return;

  return (
    <div className="flex flex-col">
      <div className="text-3xl my-4 font-bold text-center">Hero Products</div>

      <div className="w-full flex gap-4 flex-wrap justify-center">
        {hero.length > 0 &&
          hero.map((prod: any, i: number) => {
            return <HeroProductCard key={i} {...prod} />;
          })}
      </div>
    </div>
  );
}
type ProductProps = {
  details: ProductDetailsProp;
  isSearchLoading: boolean;
};

export function ProductDetail({ details, isSearchLoading }: ProductProps) {
  const dispatch = useDispatch();

  const [isTrackLoading, setIsTrackLoading] = useState<boolean>(false);

  async function handleTrack() {
    try {
      dispatch(setLoader(true));
      setIsTrackLoading(true);
      let res = await axios.post("/api/addproduct", {
        name: details.name,
        price: details.price,
        currency: details.currency,
        image: details.image,
        provider: details.provider,
        url: details.url,
        id: details.id,
      });
      dispatch(
        showToast({
          type: res.data.status,
          message: res.data.result,
        })
      );
    } catch (e) {
    } finally {
      dispatch(setLoader(false));
      setIsTrackLoading(false);
    }
  }

  if (isSearchLoading) {
    return (
      <Button variant={"ghost"} className=" mt-10 -full flex items-center justify-center">
        Loading...
      </Button>
    );
  }
  if (!details.name) {
    return;
  }
  return (
    <div className="flex-col md:flex-row flex gap-2 p-2 border-2 w-fit mx-auto">
      <div className="flex bg-zinc-100 rounded-lg m-3">
        {details.image && (
          <img
            alt=""
            className="p-4  w-[300px] aspect-square object-contain mix-blend-multiply"
            src={details.image}
          />
        )}
      </div>
      <div className="flex flex-col gap-6 p-2  ">
        <div className="text-xl font-bold max-w-[500px] ">{details.name}</div>
        <Button
          variant={"secondary"}
          className="flex gap-2 py-6 w-fit  font-bold text-xl mx-auto sm:mx-0"
        >
          <div>Current price :</div>
          <div className="flex gap-1">
            <div>{details.currency}</div>
            <div className="">{formatPrice(details.price)}</div>
          </div>
        </Button>

        <Button
          onClick={handleTrack}
          variant={"destructive"}
          className=" mt-auto text-xl font-bold w-32 h-12 mx-auto "
          disabled={isTrackLoading}
        >
          Track
        </Button>
      </div>
      <div></div>
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
    try {
      setIsTrackLoading(true);
      dispatch(setLoader(true));
      const res = await axios.post("/api/updateproductowner", { id });
      dispatch(
        showToast({
          type: res.data.status,
          message: res.data.result,
        })
      );
      dispatch(setLoader(false));
      //@ts-ignore
      dispatch(getHeroProduct());
    } catch (e) {
    } finally {
      setIsTrackLoading(false);
    }
  }
  return (
    <div className="flex flex-col w-[400px] items-center gap-8 border-2 p-4">
      <div className="flex flex-col gap-6 items-center">
        <div className="bg-zinc-100 rounded-lg w-full  flex items-center justify-center">
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
          disabled={isTrackLoading}
          onClick={handleTrack}
        >
          Track
        </Button>
      </div>
    </div>
  );
}
