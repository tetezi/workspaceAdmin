import { baseHttp } from "@/utils/http";
/**
 * 设置用户角色
 */
export async function SetUserRole(params: {
  appId: UUID;
  setToUserId: UUID;
  roleIds: UUID[];
}) {
  return baseHttp.post(
    {
      url: "/Account/SetUserRole",
    },
    params
  );
}

/**
 * 设置角色菜单
 */
export async function SetRoleMenu(params: {
  appId: UUID;
  roleId: UUID;
  menuIds: UUID[];
}) {
  return baseHttp.post(
    {
      url: "/Account/SetRoleMenu",
    },
    params
  );
}
