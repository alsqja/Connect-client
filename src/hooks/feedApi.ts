import { useCallback } from "react";
import { useAxios } from "./axios";
import { uploadFile } from "./fileApi";

export const useGetAllFeed = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (userId: number, page: number) => {
      return request({
        url: `users/${userId}/images`,
        params: {
          page,
          size: 12,
        },
        method: "GET",
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useGetProfile = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (id: number) => {
      return request({
        url: `users/${id}`,
        method: "GET",
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useCreateFeed = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (url: string, id: number, description: string) => {
      return request({
        url: `/users/${id}/images`,
        method: "POST",
        data: {
          url,
          description,
        },
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useGetFeedDetail = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (userId: number, id: number) => {
      return request({
        url: `/users/${userId}/images/${id}`,
        method: "GET",
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useDeleteFeed = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (userId: number, id: number) => {
      return request({
        url: `/users/${userId}/images/${id}`,
        method: "DELETE",
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useUpdateFeed = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (userId: number, url: string | null, id: number, description: string) => {
      return request({
        url: `/users/${userId}/images/${id}`,
        method: "PATCH",
        data: {
          url,
          description,
        },
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};
