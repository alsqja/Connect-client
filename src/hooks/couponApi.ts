import { useAxios } from "./axios";
import { useCallback } from "react";
import { AdminCouponReq, AdminCouponUpdateReq } from "../pages/AdminCoupon/data";


export const usePostCoupon = () => {
  const [request, response] = useAxios();

  const run = useCallback((data: AdminCouponReq) => {
    return request({
      method: 'POST',
      url: '/admin/coupons',
      data
    })
  }, [response]);

  return [run, response] as [typeof run, typeof response];
}

export const useGetCoupons = () => {
  const [request, response] = useAxios();

  const run = useCallback((page: number, size: number) => {
    return request({
      method: 'GET',
      url: `/coupons?page=${page}&size=${size}`,
    })
  }, [response]);

  return [run, response] as [typeof run, typeof response];
}

export const useGetCoupon = () => {
  const [request, response] = useAxios();

  const run = useCallback((id: number) => {
    return request({
      method: 'GET',
      url: `/coupons/${id}`,
    })
  }, [response]);

  return [run, response] as [typeof run, typeof response];
}

export const useUpdateCoupon = () => {
  const [request, response] = useAxios();

  const run = useCallback((id: number, data: AdminCouponUpdateReq) => {
    return request({
      method: 'PATCH',
      url: `/admin/coupons/${id}`,
      data,
    })
  }, [response]);

  return [run, response] as [typeof run, typeof response];
}