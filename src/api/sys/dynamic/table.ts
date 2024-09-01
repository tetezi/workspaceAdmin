import { baseHttp } from "@/utils/http";
export async function GetDynamicTables(params: PaginatedRequest) {
  return baseHttp.get(
    {
      url: "/dynamic/table/getTables",
    },
    params
  );
}
export async function GetDynamicTable(id: UUID) {
  return baseHttp.get(
    {
      url: "/dynamic/table/getTable",
    },
    { id }
  );
}
export type DynamicTable = {
  name: string;
  tableName: string;
  cols: {
    name: string;
    canWritable: boolean;
    canQuery: boolean;
  }[];
};
export async function SaveDynamicTable(params: DynamicTable) {
  return baseHttp.post(
    {
      url: "/dynamic/table/saveTable",
    },
    params
  );
}
export async function DelDynamicTable(id: UUID) {
  return baseHttp.post(
    {
      url: "/dynamic/table/delTable",
    },
    { id }
  );
}
