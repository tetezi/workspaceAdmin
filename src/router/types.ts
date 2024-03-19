import type { RouteRecordRaw } from "vue-router";

export type Meta = {
  title?: string;
};
export type RouteRecord = RouteRecordRaw & {
  meta?: Meta;
  children?: RouteRecord[];
};
