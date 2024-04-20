import type { RouteRecordRaw } from "vue-router";

export type Meta = {
  title?: string;
  include?: boolean;
};
export type RouteRecord = RouteRecordRaw & {
  meta?: Meta;
  children?: RouteRecord[];
};
