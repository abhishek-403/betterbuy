import { StaticImageData } from "next/image";

export type ProductDetailsProp = {
  name: string;
  price: number;
  currency: string;
  image: string;
  id: number;
};

export enum STAGES{
    LOADING,
    SUCCESS,
    FAILURE,
    PROMISE
}