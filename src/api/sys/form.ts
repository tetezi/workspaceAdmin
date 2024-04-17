import { baseHttp } from "@/utils/http";
export async function SaveTableRecord(tableId: UUID, params: Recordable) {
  return baseHttp.post(
    {
      url: "/Form/SaveTableRecord",
    },
    {
      tableId,
      ...params,
    }
  );
}
