import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { merge } from "lodash";
import { hooks } from "./hooks";
import type { RequestOptions } from "./type";
import { buildUUID } from "@/utils/uuid";

export class VAXios {
  //实际的请求实例
  private axiosInstance: AxiosInstance;
  //axios配置
  private readonly axiosConfig: AxiosRequestConfig;
  private readonly requestOptions: RequestOptions;
  //构造函数
  constructor(axiosConfig: AxiosRequestConfig, requestOptions: RequestOptions) {
    this.axiosConfig = axiosConfig;
    this.requestOptions = requestOptions;
    this.axiosInstance = axios.create(axiosConfig);
  }
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
  get = <T = any, P = Recordable>(
    config: AxiosRequestConfig,
    params: P,
    options?: Partial<RequestOptions>
  ): Promise<T> => {
    return this.request<T>({ ...config, method: "GET", params }, options);
  };

  post = <T = any, P = Recordable>(
    config: AxiosRequestConfig,
    data: P,
    options?: Partial<RequestOptions>
  ): Promise<T> => {
    return this.request<T>({ ...config, method: "POST", data }, options);
  };
  //请求
  async request<T = any>(
    axiosConfig: AxiosRequestConfig,
    requestOptions?: Partial<RequestOptions>
  ): Promise<T> {
    // 钩子
    const { beforeHooks, thenHooks, catchHooks, finallyHooks } = hooks;
    // 实际的请求配置
    const actualRequestOptions: RequestOptions = merge(
      {
        key: buildUUID(),
      },
      this.requestOptions,
      requestOptions
    );
    // 合并axios选项
    const actualAxiosConfig: AxiosRequestConfig = merge(
      {},
      this.axiosConfig,
      axiosConfig
    );
    // 请求前钩子
    const req = await beforeHooks(actualAxiosConfig, actualRequestOptions);
    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request(req)
        .then(async (res) => {
          res = await thenHooks(res, actualAxiosConfig, actualRequestOptions);
          resolve(res as T);
        })
        .catch(async (err) => {
          err = await catchHooks(err, actualAxiosConfig, actualRequestOptions);
          reject(err);
        })
        .finally(() => {
          finallyHooks(actualAxiosConfig, actualRequestOptions);
        });
    });
  }
}
