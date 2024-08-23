import type { AxiosRequestConfig } from "axios";
import { merge } from "lodash";
import { VAXios } from "./axios";
import type { RequestOptions } from "./type";

export function createAxios(
  axiosConfig: AxiosRequestConfig,
  requestOptions: Partial<RequestOptions> = {}
) {
  const defAxiosConfig: AxiosRequestConfig = {
    timeout: 10 * 1000,
  };

  const defRequestOptions: RequestOptions = {
    // 修改回调返回属性的路径
    responsePath: "data",
    // get请求参数序列化
    paramsSerializer: {
      arrayFormat: "indices",
      allowDots: false,
    },
    errorMessageMode: "message",
    successHandler: "TTZ",
    errorHandler: "TTZ",
    contentType: "JSON",
    withToken: true,
  };
  return new VAXios(
    merge(defAxiosConfig, axiosConfig),
    merge(defRequestOptions, requestOptions)
  );
}
export const baseHttp = createAxios(
  {
    baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  },
  { successHandler: "TTZ", responsePath: "data.data" }
);
export const unKnownHttp = createAxios({});
