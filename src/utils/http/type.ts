import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { IStringifyOptions } from "qs";
// 请求配置
export interface RequestOptions {
  // 修改回调返回属性的路径
  responsePath?: Array<string> | string;
  // get请求参数序列化
  paramsSerializer?:
    | IStringifyOptions
    | ((params: Recordable, options: any) => string);
  // 错误提示类型
  errorMessageMode?: false | "message" | "log";
  // 状态码检查
  checkStatusCode?: "type" | ((res: AxiosResponse<any>) => Promise<any>);
  key?: UUID;
  /**
   * 传入方法遍历历史请求返回布尔值是否取消该历史请求
   * 如 (historyAxiosConfig, currentAxiosConfig) =>(historyAxiosConfig.url === currentAxiosConfig.url)
   * 默认不取消请求
   * @param historyAxiosConfig 历史请求
   * @param currentAxiosConfig 当前请求
   * @returns 是否取消该历史请求
   */
  cancelHistoryAxios?: (
    historyAxiosConfig: AxiosRequestConfig,
    currentAxiosConfig: AxiosRequestConfig
  ) => boolean;
  contentType?: "JSON" | "FORM" | "FORM_DATA";
  withToken?: boolean;
}
// axios钩子
export interface RequestHooks {
  beforeHooks: (
    axiosConfig: AxiosRequestConfig,
    requestOptions: RequestOptions
  ) => Promise<AxiosRequestConfig> | AxiosRequestConfig;
  thenHooks: (
    res: AxiosResponse,
    axiosConfig: AxiosRequestConfig,
    requestOptions: RequestOptions
  ) => any;
  catchHooks: (
    error: any,
    axiosConfig: AxiosRequestConfig,
    requestOptions: RequestOptions
  ) => any;
  finallyHooks: (
    axiosConfig: AxiosRequestConfig,
    requestOptions: RequestOptions
  ) => any;
}
