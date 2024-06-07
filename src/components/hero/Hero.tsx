"use client";
import React, { useState } from "react";
import axios from "axios";
type Props = {};
type ProductDetails = {
  name: string;
  price: string;
  img: string;
};

export default function Hero({}: Props) {
  const [details, setDetails] = useState<ProductDetails>({
    name: "",
    price: "",
    img: "",
  });
  const [url, setUrl] = useState("");
  async function handleClick() {
    try {
      let response = await axios.post("/api/scrape", {
        url,
      });
      console.log(response.data.response);
      setDetails(response.data.response);
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div className="flex flex-col">
      Home
      <input onChange={(e) => setUrl(e.target.value)} type="text" />
      <div>{details.name}</div>
      <div>{details.price}</div>
      <img width={100} height={100} src={details.img}/>
      <button onClick={handleClick}>Btn</button>
    </div>
  );
}
