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

export const useGetAllCategories = () => {
  const [request, response] = useAxios();

  const run = useCallback(() => {
    return request({
      url: "categories",
      method: "GET",
    });
  }, [request]);

  return [run, response] as [typeof run, typeof response];
};

export const usePostCategories = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (name: string, imageUrl: string) => {
      return request({
        url: "admin/categories",
        method: "POST",
        data: { name, imageUrl },
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const usePostSub = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (name: string, imageUrl: string, categoryId: number) => {
      return request({
        url: "admin/sub-categories",
        method: "POST",
        data: { name, imageUrl, categoryId },
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useUpdateCate = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (id: number, name: string, imageUrl: string | null) => {
      return request({
        url: `admin/categories/${id}`,
        method: "PATCH",
        data: { name, imageUrl },
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useDeleteCate = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (id: number) => {
      return request({
        url: `admin/categories/${id}`,
        method: "DELETE",
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useUpdateSub = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (
      id: number,
      name: string,
      imageUrl: string | null,
      categoryId: number | null
    ) => {
      return request({
        url: `admin/sub-categories/${id}`,
        method: "PATCH",
        data: { name, imageUrl, categoryId },
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useDeleteSub = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (id: number) => {
      return request({
        url: `admin/sub-categories/${id}`,
        method: "DELETE",
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};
