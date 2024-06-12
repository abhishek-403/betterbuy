export const HOST_FLIPKART = "flipkart";
export const HOST_AMAZON = "amazon";
export const HOST_INVALID = "invalid";
export const HOST_NA = "na";
export interface ProductCardProps extends ProductDetailsProp {
  fetchProducts?: () => void;
}
export type ProductDetailsProp = {
  name: string;
  price: number;
  currency: string;
  image: string;
  url: string;
  id: string;
  provider: string;
  pricedata?: PricePointProps[];
  createdAt?: Date;
  updatedAt?: Date;
  alltimehighprice: number;
  alltimelowprice: number;
};
export type PricePointProps = {
  id: number;
  value: number;
  date: Date;
};

export enum STAGES {
  LOADING,
  SUCCESS,
  FAILURE,
  PROMISE,
}

export const TITLE_LENGTH = 65;
