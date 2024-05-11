import { isDevMode } from "@/utils/env";
import { narrow } from "../type";
const isDev = isDevMode();
export const easyApiMap = new Map([
  ["Init_应用列表", isDev ? "1" : "1test"] as const,
]);
export type KeysOfMap<T> = T extends Map<infer K, any> ? K : never;
export type EasyApiKey = KeysOfMap<typeof easyApiMap>;
