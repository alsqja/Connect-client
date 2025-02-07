import { useCallback } from "react";
import { useAxios } from "./axios";

export const useGetUserReport = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (page: number, size: number) => {
      return request({
        url: "/reports",
        params: {
          page,
          size,
        },
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useDeleteReport = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (id: number) => {
      return request({
        url: `/reports/${id}`,
        method: "DELETE",
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};
