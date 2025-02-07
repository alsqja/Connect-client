import { useAxios } from "./axios";
import { useCallback } from "react";
import { EncryptData } from "../pages/Membership/data";

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

export const useMembershipUpdate = () => {
  const [request, response] = useAxios();

  const run = useCallback((data: EncryptData) => {
    return request({
      method: 'PATCH',
      url: `/memberships`,
      data
    })
  }, [request]);

  return [run, response] as [typeof run, typeof response];
};