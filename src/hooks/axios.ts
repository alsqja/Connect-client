import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../stores/session";

// tslint:disable-next-line: interface-name
export interface UseAxiosResponse {
  called: boolean;
  data: any;
  loading: boolean;
  error: any;
}
export type UseAxiosPromise = Promise<AxiosResponse<any>>;
export type UseAxiosType = [
  (config?: AxiosRequestConfig) => UseAxiosPromise,
  UseAxiosResponse
];

const axios = Axios.create({
  baseURL: "http://localhost:8080/api",
});

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

const onRrefreshed = (token: string) => {
  subscribers.forEach((callback) => callback(token));
  subscribers = [];
};

export const useAxios = (): UseAxiosType => {
  const [tokens, setTokens] = useRecoilState(userState);

  const [data, setData] = useState<any>();
  const [error, setError] = useState<AxiosError<any>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [called, setCalled] = useState<boolean>(false);
  const [response, setResponse] = useState<UseAxiosResponse>({
    error,
    loading,
    called,
    data,
  });

  const request = useCallback(
    async (config?: AxiosRequestConfig) => {
      setCalled(false);
      setLoading(true);
      setData(undefined);
      setError(undefined);

      config = {
        ...config,
        headers: {
          ...config?.headers,
          Authorization: `Bearer ${tokens?.accessToken}`,
        },
      };

      try {
        const res = await axios(config);
        setData(res?.data);

        return res;
      } catch (e: any) {
        const error = e?.response?.data?.message
          ? e?.response?.data?.message
          : e;
        setError(error);

        if (e.response.status === 401) {
          setTokens({
            id: tokens?.id || null,
            role: tokens?.role || null,
            memberType: tokens?.memberType || null,
            expiredDate: tokens?.expiredDate || null,
            accessToken: "",
            refreshToken: tokens ? tokens.refreshToken : null,
          });

          if (e.response.data.code === "INVALID_TOKEN") {
            if (!isRefreshing) {
              isRefreshing = true;

              axios
                .post(
                  "auth/refresh",
                  { refreshToken: tokens?.refreshToken },
                  { withCredentials: true }
                )
                .then((res) => {
                  setTokens({
                    id: tokens?.id || null,
                    role: tokens?.role || null,
                    memberType: tokens?.memberType || null,
                    expiredDate: tokens?.expiredDate || null,
                    accessToken: res.data.data.accessToken,
                    refreshToken: res.data.data.refreshToken,
                  });

                  onRrefreshed(res.data.data.accessToken);
                })
                .catch(() => {
                  setTokens(null);
                  alert("다시 로그인 해주세요.");
                  window.location.replace("/login");
                })
                .finally(() => {
                  isRefreshing = false;
                });
            }

            return new Promise<AxiosResponse<any>>((resolve) => {
              subscribers.push((token: string) => {
                config!.headers!.Authorization = `Bearer ${token}`;
                resolve(axios(config!));
              });
            });
          }
        }
        throw error;
      } finally {
        setCalled(true);
        setLoading(false);
      }
    },
    [setTokens, tokens]
  );

  useEffect(() => {
    setResponse({
      error,
      loading,
      called,
      data,
    });
  }, [error, loading, data, called]);

  return [request, response];
};
