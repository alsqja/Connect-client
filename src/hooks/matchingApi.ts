import { useCallback } from "react";
import { useAxios } from "./axios";

export const useUpdateMatching = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (id: number, status: string) => {
      return request({
        url: `matchings/${id}`,
        method: "PATCH",
        data: {
          status,
        },
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useCreateMatching = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (id: number, data: any) => {
      return request({
        url: `schedules/${id}/matchings`,
        method: "POST",
        data,
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useCreateReport = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (toId: number, matchingId: number, content: string) => {
      return request({
        url: `reports`,
        method: "POST",
        data: {
          toId,
          matchingId,
          content,
        },
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useCreateReview = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (toId: number, matchingId: number, rate: number) => {
      return request({
        url: `matchings/${matchingId}/reviews`,
        method: "POST",
        data: {
          toId,
          rate,
        },
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};
