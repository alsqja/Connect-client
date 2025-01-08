import { useCallback } from "react";
import { useAxios } from "./axios";
import { IAdminUpdateUserData } from "../pages/AdminUser/data";

export const useGetAdminUsers = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (page: number, size: number) => {
      return request({
        url: `admin/users?page=${page}&size=${size}`,
        method: "GET",
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useUpdateAdminUser = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (id: number, data: IAdminUpdateUserData) => {
      return request({
        url: `admin/users/${id}`,
        method: "PATCH",
        data,
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};
