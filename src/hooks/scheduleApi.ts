import { useCallback } from "react";
import { useAxios } from "./axios";
import { IPostScheduleData } from "../pages/UserMain/data";

export const useGetAllSchedules = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (page: number | null, size: number | null, date: string | null) => {
      return request({
        url: "schedules",
        method: "GET",
        params: {
          page,
          size,
          date,
        },
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useCreateSchedule = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (data: IPostScheduleData) => {
      return request({
        url: "schedules",
        method: "POST",
        data,
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useDeleteSchedule = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (id: number) => {
      return request({
        url: `schedules/${id}`,
        method: "DELETE",
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};
