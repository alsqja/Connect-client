import { useCallback } from "react";
import { useAxios } from "./axios";
import { ISignupValues } from "../pages/Signup/data";
import { UpdateUserData } from "../pages/UserMy/data";

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

export const useGetProfile = () => {
  const [request, response] = useAxios();

  const run = useCallback(() => {
    return request({
      url: "users/my",
      method: "GET",
    });
  }, [request]);

  return [run, response] as [typeof run, typeof response];
};

export const useUpdateProfile = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (data: UpdateUserData) => {
      return request({
        url: "users/my",
        method: "PATCH",
        data,
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useSendEmail = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (email: string) => {
      return request({
        url: "auth/email",
        method: "POST",
        data: { email },
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};

export const useVerifyEmailCode = () => {
  const [request, response] = useAxios();

  const run = useCallback(
    (email: string, code: string) => {
      return request({
        url: "auth/email/verify",
        method: "POST",
        data: { email, code },
      });
    },
    [request]
  );

  return [run, response] as [typeof run, typeof response];
};
