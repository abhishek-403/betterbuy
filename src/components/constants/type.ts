import { StaticImageData } from "next/image";

export type ProductDetailsProp = {
  name: string;
  price: number;
  currency: string;
  image: string;
  url: string;
  id: number;
  provider?: string;
  pricedata?: PricePointProps[];
  createdAt?: Date;
  updatedAt?: Date;
};
export type PricePointProps = {
  id:number,
  value:number;
  date:Date
};

export enum STAGES {
  LOADING,
  SUCCESS,
  FAILURE,
  PROMISE,
}
