import { baseHttp } from "@/utils/http";

export async function GetDynamicTableRecoreds(
  tableId: UUID,
  params: PaginatedRequest
) {
  return baseHttp.get(
    {
      url: "/dynamic/tableRecored/getTableRecoreds",
    },
    { tableId, ...params }
  );
}

export async function GetDynamicTableRecored(tableId: UUID, id: UUID) {
  return baseHttp.get(
    {
      url: "/dynamic/tableRecored/getTableRecored",
    },
    { tableId, id }
  );
}

export async function SaveDynamicTableRecored(
  tableId: UUID,
  params: Recordable
) {
  return baseHttp.post(
    {
      url: "/dynamic/tableRecored/saveTableRecored",
      params: { tableId },
    },
    params
  );
}
export async function DelDynamicTableRecored(tableId: UUID, id: UUID) {
  return baseHttp.post(
    {
      url: "/dynamic/tableRecored/delTableRecored",
    },
    { tableId, id }
  );
}
