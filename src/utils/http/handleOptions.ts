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
export const handleCheckStatusCode: RequestHooks["thenHooks"] = async (
  res,
  _axiosConfig,
  requestOptions
) => {
  const { checkStatusCode } = requestOptions;
  async function checkStatusCodeByType(res: AxiosResponse) {
    console.log(100, res);
    if (res.data.type === 1) {
      return res;
    } else if (res.data.type === 10) {
      router.replace(PAGE.login);
      console.log(222);
      return Promise.reject({
        _errMessage: res.data.msg,
        ...res.data,
      });
    } else {
      return Promise.reject({
        _errMessage: res.data.msg,
        ...res.data,
      });
    }
  }
  if (isFunction(checkStatusCode)) {
    return await checkStatusCode(res);
  } else if (checkStatusCode === "type") {
    return await checkStatusCodeByType(res);
  } else {
    return res;
  }
};
/** 是否被取消的请求 */
export function isCancelAxios(err: any): boolean {
  return err.code === "ERR_CANCELED";
}
// 错误提示类型
export const handleErrorMessageMode: RequestHooks["catchHooks"] = (
  error,
  axiosConfig,
  requestOptions
) => {
  let errMessage = error._errMessage;
  if (!errMessage) {
    const { code, message: msg } = error || {};
    const err: string = error?.toString?.() ?? "";
    const checkStatus = (status: number) => {
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
      return get(statusMsg, status, "");
    };
    if (code === "ECONNABORTED" && msg.indexOf("timeout") !== -1) {
      errMessage = "接口请求超时,请刷新页面重试!";
    } else if (err?.includes("Network Error")) {
      errMessage = "网络异常，请检查您的网络连接是否正常!	";
    } else {
      const status: any = get(error, "response.status");
      errMessage =
        checkStatus(status) || get(error, "response.data.error.message", "");
    }
  }
  if (!errMessage) {
    errMessage = "发生未知错误，请联系管理员";
  }

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
    set(axiosConfig, ["headers", "Access-Token"], userStroe.getToken);
  }
  return axiosConfig;
};
