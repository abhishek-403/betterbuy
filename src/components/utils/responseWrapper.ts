import { STAGES } from "./type";
export const successres = (statusCode: number, result:any) => {
  return {
    status: STAGES.SUCCESS,
    statusCode,
    result,
  };
};
export const errorres = (statusCode:number, result:any) => {
  return {
    status: STAGES.FAILURE,
    statusCode,
    result,
  };
};
