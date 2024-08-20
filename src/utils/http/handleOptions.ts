import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, Canceler } from "axios";
import { get, set, isFunction, omit } from "lodash";
import qs from "qs";
import { message } from "../message";
import type { RequestHooks, RequestOptions } from "./type";
import { useUserStore } from "@/stores/modules/user";
import { router } from "@/router";
import { PAGE } from "@/router/constant";
export enum ContentTypeEnum {
  // JSON 格式的数据。
  JSON = "application/json;charset=UTF-8",
  // URL 编码的表单数据
  FORM = "application/x-www-form-urlencoded;charset=UTF-8",
  // 包含文件上传的表单数据。
  FORM_DATA = "multipart/form-data;charset=UTF-8",
}
// 状态码检查
export const handleSuccess: RequestHooks["thenHooks"] = async (
  res,
  axiosConfig,
  requestOptions
) => {
  const { successHandler } = requestOptions;
  async function successHandlerByTTZ(res: AxiosResponse) {
    return res;
  }
  if (isFunction(successHandler)) {
    return await successHandler(res, axiosConfig, requestOptions);
  } else if (successHandler === "TTZ") {
    return await successHandlerByTTZ(res);
  } else {
    return res;
  }
};
/** 是否被取消的请求 */
export function isCancelAxios(err: any): boolean {
  return err.code === "ERR_CANCELED";
}
// 错误提示类型
export const handleError: RequestHooks["catchHooks"] = async (
  error,
  axiosConfig,
  requestOptions
) => {
  const { errorHandler } = requestOptions;
  if (isFunction(errorHandler)) {
    return await errorHandler(error, axiosConfig, requestOptions);
  } else if (errorHandler === "TTZ") {
    const getErrorMsg = function (error) {
      const { response, code } = error;
      if (response) {
        const { status, statusText, data } = response;
        if (data) {
          return data.message;
        } else {
          const statusMsg = {
            "400": "请求错误",
            "401": "未授权，请重新登录",
            "403": "拒绝访问",
            "404": `请求地址出错`,
            "408": "请求超时",
            "500": "服务器内部错误",
            "501": "服务未实现",
            "502": "网关错误",
            "503": "服务不可用",
            "504": "网关超时",
            "505": "HTTP版本不受支持",
          };
          return get(statusMsg, status, statusText);
        }
      } else {
        const codeMsg = {
          ERR_NETWORK: "网络异常，请检查您的网络连接是否正常!",
          ECONNABORTED: "接口请求超时,请刷新页面重试!",
        };
        return get(codeMsg, code, "发生未知错误，请联系管理员");
      }
    };
    if (error.response?.status === 401) {
      router.replace(PAGE.login);
    }
    const errMessage = getErrorMsg(error);
    if (requestOptions.errorMessageMode === "message") {
      message(
        {
          title: "接口请求失败",
          url: (axiosConfig.baseURL || "") + (axiosConfig.url || ""),
          message: errMessage,
          error: omit(error, ["_errMessage"]),
        },
        "error"
      );
    } else if (requestOptions.errorMessageMode === "log") {
      console.log(errMessage, error);
    }
    return error;
  } else {
    return error;
  }
};

// 请求撤销
export function handleCancelOfBefore(
  axiosConfig: AxiosRequestConfig,
  requestOptions: RequestOptions,
  cancelMap: Map<string, { axiosConfig: AxiosRequestConfig; cancel: Canceler }>
): AxiosRequestConfig {
  const { cancelHistoryAxios } = requestOptions;
  if (cancelHistoryAxios) {
    cancelMap.forEach(({ axiosConfig: historyAxiosConfig, cancel }) => {
      if (cancelHistoryAxios(historyAxiosConfig, axiosConfig)) {
        cancel();
      }
    });
  }
  if (cancelHistoryAxios) {
    axiosConfig.cancelToken = new axios.CancelToken(function executor(cancel) {
      cancelMap.set(requestOptions.key as string, { axiosConfig, cancel });
    });
  }
  return axiosConfig;
}
export function handleCancelOfFinally(
  requestOptions: RequestOptions,
  cancelMap: Map<string, { axiosConfig: AxiosRequestConfig; cancel: Canceler }>
) {
  cancelMap.delete(requestOptions.key as string);
}
// get请求参数序列化
export const handleParamsSerializer: RequestHooks["beforeHooks"] = (
  axiosConfig,
  requestOptions
) => {
  const { paramsSerializer } = requestOptions;

  axiosConfig.paramsSerializer = {
    serialize: isFunction(paramsSerializer)
      ? paramsSerializer
      : (params: any) => qs.stringify(params, paramsSerializer),
  };
  return axiosConfig;
};
// 修改回调返回属性的路径
export const handleResponsePath: RequestHooks["thenHooks"] = (
  res,
  _axiosConfig,
  requestOptions
) => {
  const { responsePath } = requestOptions;
  return responsePath ? get(res, responsePath) : res;
};

export const handleHeaders: RequestHooks["beforeHooks"] = (
  axiosConfig,
  requestOptions
) => {
  const { contentType, withToken } = requestOptions;
  if (contentType) {
    set(axiosConfig, ["headers", "Content-Type"], ContentTypeEnum[contentType]);
  }
  if (withToken) {
    const userStroe = useUserStore();
    set(
      axiosConfig,
      ["headers", "Authorization"],
      `Bearer ${userStroe.getToken}`
    );
  }
  return axiosConfig;
};
