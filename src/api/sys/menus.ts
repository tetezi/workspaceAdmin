import { baseHttp } from "@/utils/http";
export async function GetPermission() {
  return baseHttp.post(
    {
      url: "/Account/GetPermission",
    },
    {}
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
