import { baseHttp } from "@/utils/http";
/**
 * 设置用户角色
 */
export async function SetRoleUser(
  params: {
    roleId: UUID;
  },
  userIds: UUID[]
) {
  return baseHttp.post(
    {
      url: "/Account/SetRoleUser",
      params,
    },
    userIds,
    {
      contentType: "JSON",
    }
  );
}

/**
 * 设置角色菜单
 */
export async function SetRoleMenus(params: { id: UUID; menuIds: UUID[] }) {
  return baseHttp.post(
    {
      url: "/role/setRoleMenus",
    },
    params
  );
}

export async function SaveRole(params: {
  id?: UUID;
  name: string;
  description?: string;
}) {
  return baseHttp.post(
    {
      url: "/role/saveRole",
    },
    params
  );
}
export async function GetRole(id: UUID) {
  return baseHttp.get(
    {
      url: "/role/getRole",
    },
    { id }
  );
}
export async function GetRoles(params: {
  pageIndex: number;
  pageSize: number;
}) {
  return baseHttp.get(
    {
      url: "/role/getRoles",
    },
    params
  );
}
export async function DelRole(id: UUID) {
  return baseHttp.post(
    {
      url: "/role/delRole",
    },
    { id }
  );
}
export async function GetMenusByRoleId(params: { id: UUID }) {
  return baseHttp.get(
    {
      url: "/role/getMenusByRoleId",
    },
    params
  );
}
