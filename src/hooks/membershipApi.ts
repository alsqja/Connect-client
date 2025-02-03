import { useAxios } from "./axios";
import { useCallback } from "react";

export const useMembershipDelete = () => {
  const [request, response] = useAxios();


  const run = useCallback(() => {
    return request({
      method: 'DELETE',
      url: `/memberships`,
    })
  }, [request]);

  return [run, response] as [typeof run, typeof response];
};