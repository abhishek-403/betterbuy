import { StaticImageData } from "next/image";

export type ProductDetailsProp = {
  name: string;
  price: number;
  currency: string;
  image: string ;
};

export enum STAGES{
    LOADING,
    SUCCESS,
    FAILURE
}