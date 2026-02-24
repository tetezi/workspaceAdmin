import { baseHttp } from "@/utils/http";
export async function GetDynamicThirdPartyTables(params: PaginatedRequest) {
  return baseHttp.get(
    {
      url: "/dynamic/thirdPartyTable/getThirdPartyTables",
    },
    params,
  );
}
export async function GetDynamicThirdPartyTable(id: UUID) {
  return baseHttp.get(
    {
      url: "/dynamic/thirdPartyTable/getThirdPartyTable",
    },
    { id },
  );
}
export async function SaveDynamicThirdPartyTable(params: any) {
  return baseHttp.post(
    {
      url: "/dynamic/thirdPartyTable/saveThirdPartyTable",
    },
    params,
  );
}
export async function DelDynamicThirdPartyTable(id: UUID) {
  return baseHttp.post(
    {
      url: "/dynamic/thirdPartyTable/delThirdPartyTable",
    },
    { id },
  );
}
