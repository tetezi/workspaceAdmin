import { createRouter, createWebHashHistory } from "vue-router";
import { basicRoutes } from "./routes";
import type { RouteRecord } from "./types";
import { setupRouterGuard } from "./guard";
// 白名单应该包含基本静态路由
const basicRouteNameList: string[] = [];
const getWhiteRouteNames = (array: RouteRecord[]) =>
  array.forEach((item) => {
    item.name && basicRouteNameList.push(item.name as string);
    getWhiteRouteNames(item.children || []);
  });
getWhiteRouteNames(basicRoutes);

const router = createRouter({
  sensitive: true,
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: basicRoutes,
});

export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name && !basicRouteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}
setupRouterGuard(router);
export { router };
