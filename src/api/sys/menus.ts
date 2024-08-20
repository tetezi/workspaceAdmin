import { baseHttp } from "@/utils/http";
export async function GetPermission(params: { appId: UUID }) {
  return baseHttp.get(
    {
      url: "/auth/getMenuPermission",
    },
    params
  );
}
export async function GetAllMenu(params) {
  return baseHttp.get(
    {
      url: "/menu/getAllMenu",
    },
    params
  );
}
enum MenuType {
  Iframe = "Iframe",
  View = "View",
  Group = "Group",
}
export async function SaveMenu(params: {
  id?: UUID;
  name: string;
  type: MenuType;
  routerPath?: string;
  url?: string;
  sort?: number;
  isEnabled: boolean;
  description?: string;
  parentMenuId?: UUID;
}) {
  return baseHttp.post(
    {
      url: "/menu/saveMenu",
    },
    params
  );
}

export async function GetMenu(id: UUID) {
  return baseHttp.get(
    {
      url: "/menu/getMenu",
    },
    { id }
  );
}
export async function DelMenu(id: UUID) {
  return baseHttp.post(
    {
      url: "/menu/delMenu",
    },
    { id }
  );
}
