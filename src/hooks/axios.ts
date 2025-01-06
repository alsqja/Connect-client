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
        // eslint-disable-next-line no-useless-catch
      } catch (e: any) {
        const error = e?.response?.data?.message
          ? e?.response?.data?.message
          : e;
        setError(error);
        if (e.response.status === 401) {
          setTokens({
            accessToken: "",
            refreshToken: tokens ? tokens.refreshToken : null,
          });
        }
        if (e.response.data.message === "유효하지 않은 토큰입니다.") {
          axios
            .post(
              "auth/refresh",
              { refreshToken: tokens?.refreshToken },
              { withCredentials: true }
            )
            .then((res) => {
              setTokens({
                accessToken: res.data.data.accessToken,
                refreshToken: res.data.data.refreshToken,
              });
              window.location.reload();
            })
            .catch((e) => {
              setTokens(null);
            });
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
