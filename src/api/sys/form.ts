import { baseHttp } from "@/utils/http";

/**
 * 保存表单
 */
export async function SaveTableRecord(tableId: UUID, body: Recordable) {
  return baseHttp.post(
    {
      url: "/Form/SaveTableRecord",
      params: { tableId },
    },
    body,
    {
      contentType: "JSON",
    }
  );
}

/**
 * 获取表单记录详情
 */
export async function GetTableRecord(recordId: UUID) {
  return baseHttp.post(
    {
      url: "/Form/GetTableRecord",
      params: { recordId },
    },
    {},
    {
      contentType: "JSON",
    }
  );
}

/**
 * 删除表单记录
 */
export async function DelTableRecord(recordId: UUID) {
  return baseHttp.post(
    {
      url: "/Form/DelTableRecord",
      params: { recordId },
    },
    {},
    {
      contentType: "JSON",
    }
  );
}

/**
 * 获取表单记录列表
 */
export async function GetTableRecordPage(
  tableId: UUID,
  params: {
    pageSize: number;
    pageIndex: number;
    orderBy?: string;
  },
  data: Recordable = {}
) {
  return baseHttp.post(
    {
      url: "/Form/GetTableRecordPage",
      params: {
        tableId,
        ...params,
      },
    },
    data,
    {
      contentType: "JSON",
    }
  );
}
