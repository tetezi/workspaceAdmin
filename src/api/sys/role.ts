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
export async function SetRoleMenu(
  params: {
    roleId: UUID;
  },
  menuIds: UUID[]
) {
  return baseHttp.post(
    {
      url: "/Account/SetRoleMenu",
      params,
    },
    menuIds,
    {
      contentType: "JSON",
    }
  );
}
