import { useCallback } from "react";
import { useAxios } from "./axios";
import { ISignupValues } from "../pages/Signup/data";

export const useSignup = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (data: ISignupValues) => {
      return request({
        url: "auth/signup",
        method: "POST",
        data,
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};
