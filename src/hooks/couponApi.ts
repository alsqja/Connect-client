import { useAxios } from "./axios";
import { useCallback } from "react";
import {
  AdminCouponReq,
  AdminCouponUpdateReq,
  couponFilter,
} from "../pages/AdminCoupon/data";

export const usePostCoupon = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (data: AdminCouponReq) => {
      return request({
        method: "POST",
        url: "/admin/coupons",
        data,
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useGetCoupons = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (page: number, size: number, filter: couponFilter) => {
      return request({
        method: "GET",
        url: `/coupons?page=${page}&size=${size}&filter=${filter}`,
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useGetCoupon = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (id: number) => {
      return request({
        method: "GET",
        url: `/coupons/${id}`,
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useUpdateCoupon = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (id: number, data: AdminCouponUpdateReq) => {
      return request({
        method: "PATCH",
        url: `/admin/coupons/${id}`,
        data,
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useIssueCoupon = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (id: number) => {
      return request({
        method: "POST",
        url: `/coupons/${id}`,
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useCouponUse = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (id: number, scheduleId: number) => {
      return request({
        method: "POST",
        url: `/coupons/${id}/use`,
        data: {
          scheduleId,
        },
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};
