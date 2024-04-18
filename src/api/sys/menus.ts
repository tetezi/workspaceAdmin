import { baseHttp } from "@/utils/http";
export async function GetPermission() {
  return baseHttp.get(
    {
      url: "/Account/GetPermission",
    },
    {}
  );
}
