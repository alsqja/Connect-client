import { useCallback } from "react";
import { useAxios } from "./axios";

export const useReadAllNotify = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (userId: number) => {
      return request({
        url: "notifies/read-all/" + userId,
        method: "POST",
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};
