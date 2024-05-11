import { baseHttp } from "@/utils/http";

/**
 * 使用接口获取数据
 */
export async function GetSIData(
  configNo: string,
  data: Recordable,
  page?: {
    pageSize: number;
    pageIndex: number;
    orderBy?: string;
  }
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
    }
  );
}
