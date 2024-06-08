import { StaticImageData } from "next/image";

export type ProductDetails = {
  name: string;
  price: string;
  img: string ;
};

export enum STAGES{
    LOADING,
    SUCCESS,
    FAILURE
}