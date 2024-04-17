import type { AxiosRequestConfig } from "axios";
import { merge } from "lodash";
import { VAXios } from "./axios";
import type { RequestOptions } from "./type";

export enum ContentTypeEnum {
  // json
  JSON = "application/json;charset=UTF-8",
  // form-data qs
  FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
  // form-data  upload
  FORM_DATA = "multipart/form-data;charset=UTF-8",
}
export function createAxios(
  axiosConfig: AxiosRequestConfig,
  requestOptions: Partial<RequestOptions> = {}
) {
  const defAxiosConfig: AxiosRequestConfig = {
    timeout: 10 * 1000,
    headers: { "Content-Type": ContentTypeEnum.JSON },
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
    checkStatusCode: undefined,
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
  { checkStatusCode: "type", responsePath: "data.data" }
);
export const unKnownHttp = createAxios({});
