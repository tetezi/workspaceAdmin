import { baseHttp } from "@/utils/http";
import type { EasyApiValue } from "@/utils/http/easyApiMap";

/**
 * 使用接口获取数据
 */
export async function GetSIData(
  configNo: EasyApiValue,
  data: Recordable,
  page?: {
    pageSize: number;
    pageIndex: number;
    orderBy?: string;
  },
  isDebug: boolean = false
) {
  const pageSize = data.pageSize ?? page?.pageSize;
  const pageIndex = data.pageIndex ?? page?.pageIndex;
  const orderBy = data.orderBy ?? page?.orderBy;
  return baseHttp.post(
    {
      url: "/Interface/GetSIData",
      params: { configNo, pageIndex, pageSize, orderBy },
    },
    data,
    {
      contentType: "JSON",
      errorMessageMode: isDebug ? "message" : false,
    }
  );
}
