import { useCallback } from "react";
import { useAxios } from "./axios";

export const useLogin = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (email: string, password: string) => {
      return request({
        url: "auth/login",
        method: "POST",
        data: {
          email,
          password,
        },
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useLogout = () => {
  const [request, response] = useAxios();

  const run = useCallback(() => {
    return request({
      url: "auth/logout",
      method: "POST",
    });
  }, [request]);

  return [run, response] as [typeof run, typeof response];
};
