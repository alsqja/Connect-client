import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";

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
  withCredentials: true,
});

export const useAxios = (): UseAxiosType => {
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

  const request = useCallback(async (config?: AxiosRequestConfig) => {
    setCalled(false);
    setLoading(true);
    setData(undefined);
    setError(undefined);

    config = {
      ...config,
      headers: {
        ...config?.headers,
      },
    };

    try {
      const res = await axios(config);
      setData(res?.data);

      return res;
      // eslint-disable-next-line no-useless-catch
    } catch (e: any) {
      const error = e?.response?.data?.message ? e?.response?.data?.message : e;
      setError(error);
      // if (e.response.status === 401) {
      //   setToken("");
      // }
      // if (e.response.status === 419) {
      //   axios
      //     .get("auth/refresh", { withCredentials: true })
      //     .then((res) => {
      //       setToken(res.data.accessToken);
      //       window.location.reload();
      //     })
      //     .catch((e) => {
      //       setToken("");
      //     });
      // }
      throw error;
    } finally {
      setCalled(true);
      setLoading(false);
    }
  }, []);

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
