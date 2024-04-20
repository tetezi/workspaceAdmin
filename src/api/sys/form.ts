import { baseHttp } from "@/utils/http";
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
