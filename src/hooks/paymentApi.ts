import { useAxios } from "./axios";
import { useCallback } from "react";

export interface PaymentRequestType {
  payUid: string,
  portoneUid: string,
  amount: number,
  details: string,
  type: string,
  status: string,
}

export const usePostPayments = () => {
  const [request, response] = useAxios();

  const run = useCallback((data: PaymentRequestType) => {
    return request({
      method: 'POST',
      url: '/payments',
      data
    });
  }, [request]);

  return [run, response] as [typeof run, typeof response];
}