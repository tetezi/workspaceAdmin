import {
  handleCancelOfBefore,
  handleCancelOfFinally,
  handleCheckStatusCode,
  handleErrorMessageMode,
  handleParamsSerializer,
  handleResponsePath,
  isCancelAxios,
} from "./handleOptions";
import type { RequestHooks } from "./type";
const cancelMap = new Map();

export const hooks: RequestHooks = {
  beforeHooks: async (req, requestOptions) => {
    req = await handleCancelOfBefore(req, requestOptions, cancelMap);
    req = await handleParamsSerializer(req, requestOptions);
    return req;
  },
  thenHooks: async (res, axiosConfig, requestOptions) => {
    res = await handleCheckStatusCode(res, axiosConfig, requestOptions);
    res = await handleResponsePath(res, axiosConfig, requestOptions);
    return res;
  },
  catchHooks: async (err, axiosConfig, requestOptions) => {
    const isCancel = isCancelAxios(err);
    if (!isCancel) {
      err = await handleErrorMessageMode(err, axiosConfig, requestOptions);
    }
    return err;
  },
  finallyHooks: (axiosConfig, requestOptions) => {
    handleCancelOfFinally(requestOptions, cancelMap);
  },
};
