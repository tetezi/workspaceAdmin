import { isDevMode } from "@/utils/env";
const isDev = isDevMode();
export const easyApiMap = {
  Init_应用列表: isDev ? "1" : "1",
  用户_所有用户: isDev ? "2" : "2",
  权限_角色已分配用户: isDev ? "3" : "3",
  权限_角色未配置用户: isDev ? "4" : "4",
  权限_角色已配置菜单: isDev ? "5" : "5",
} as const;
export type EasyApiKey = keyof typeof easyApiMap;
export type EasyApiValue = (typeof easyApiMap)[EasyApiKey];
// export const easyApiMap = new Map(a);
// export type KeysOfMap<T> = T extends Map<infer K, any> ? K : never;
// export type EasyApiKey = KeysOfMap<typeof easyApiMap>;
