import { useRouter } from "vue-router";
import staticRoutes from "./static";
import type { RouteRecord } from "./types";
// 白名单应该包含基本静态路由
const WHITE_NAME_LIST: string[] = [];
const getWhiteRouteNames = (array: RouteRecord[]) =>
  array.forEach((item) => {
    item.name && WHITE_NAME_LIST.push(item.name as string);
    getWhiteRouteNames(item.children || []);
  });
getWhiteRouteNames(staticRoutes);

export function useRouterHelper() {
  const router = useRouter();
  /**
   * 重置不在白名单的基础路由
   */
  function resetRouter() {
    router.getRoutes().forEach((route) => {
      const { name } = route;
      if (name && !WHITE_NAME_LIST.includes(name as string)) {
        router.hasRoute(name) && router.removeRoute(name);
      }
    });
  }
  return {
    resetRouter,
  };
}
