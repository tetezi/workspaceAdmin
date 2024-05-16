import { baseHttp } from "@/utils/http";
export async function GetPermission(params: { appId: UUID }) {
  return baseHttp.post(
    {
      url: "/Account/GetPermission",
    },
    params
  );
}
export async function GetAllMenu(params) {
  return baseHttp.get(
    {
      url: "/Account/GetAllMenu",
    },
    params
  );
}
