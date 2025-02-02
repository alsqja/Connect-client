import { useAxios } from "./axios";
import { useCallback } from "react";
import {
  PaymentCancelRequest,
  PaymentRequestType,
  PaymentType,
} from "../pages/AdminPaymentManage/data";

export const usePostPayments = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (data: PaymentRequestType) => {
      return request({
        method: "POST",
        url: "/payments",
        data,
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useGetPayments = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (payType: PaymentType | undefined, page: number, size: number) => {
      return request({
        method: "GET",
        url: `/payments?payType=${
          payType ? payType : ""
        }&page=${page}&size=${size}`,
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useCancelPayment = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (data: PaymentCancelRequest) => {
      return request({
        method: "POST",
        url: "/payments/cancel",
        data,
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};
