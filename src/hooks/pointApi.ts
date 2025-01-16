import { useAxios } from "./axios";
import { useCallback } from "react";

export const useGetAllPoint = () => {
  const [request, response] = useAxios();

  const run = useCallback((page: number, size: number) => {
    return request({
      method: 'GET',
      url: `/points?page=${page}&size=${size}`,
    })
  }, [response]);

  return [run, response] as [typeof run, typeof response];
}