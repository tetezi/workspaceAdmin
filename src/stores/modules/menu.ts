import { defineStore } from "pinia";
import { resetRouter, router } from "@/router";
import type { RouteRecord } from "@/router/types";
import { GetPermission } from "@/api/sys/menus";
import { getEnv } from "@/utils/env";
export type Menu = {
  id: UUID;
  // No: string;
  name: string;
  routerPath: Nullable<string>;
  // label: Nullable<string>;
  type: "Iframe" | "View" | "Group";
  url: Nullable<string>;
  // Param: Nullable<string>;

  sort: number;
  patentMenuId: UUID;
  appId: UUID;
  isEnabled: boolean;
  subMenus: Menu[];
};
type State = {
  isCompleted: boolean;
  menuList: Array<Menu>;
};
const dynamicViewsModules: Record<string, () => Promise<Recordable>> =
  import.meta.glob("../../views/**/*.{vue,tsx}");
function dynamicImport(component: string) {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    const k = key.replace("../../views", "");
    const startFlag = component.startsWith("/");
    const endFlag = component.endsWith(".vue") || component.endsWith(".tsx");
    const startIndex = startFlag ? 0 : 1;
    const lastIndex = endFlag ? k.length : k.lastIndexOf(".");
    const filePath = k.substring(startIndex, lastIndex);
    return filePath === component || filePath === `${component}/index`;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return dynamicViewsModules[matchKey];
  } else if (matchKeys?.length > 1) {
    console.warn(
      "Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure"
    );
    return;
  } else {
    console.warn(
      "在src/views/下找不到`" +
        component +
        ".vue` 或 `" +
        component +
        ".tsx`, 请自行创建!"
    );
    return;
  }
}
export const useMenuStore = defineStore({
  id: "menu",
  state: (): State => {
    return {
      isCompleted: false,
      menuList: [],
    };
  },
  getters: {
    getRouteByMenu(state): Array<RouteRecord> {
      function menuToRoute(menu: Menu): RouteRecord {
        const children = (menu.subMenus || []).map(menuToRoute);
        const result: any = {
          meta: {
            title: menu.name,
            cache: true,
          },
          children,
        };
        if (menu.routerPath && menu.url) {
          result.path = menu.routerPath;
          let component: any = undefined;
          if (menu.type === "View") {
            component = dynamicImport(menu.url);
          }
          if (children.length > 0) {
            children.unshift({
              alias: menu.routerPath,
              path: `${menu.routerPath}/_index`,
              component,
              children: [],
            });
          } else {
            result.component = component;
          }
        } else {
          result.path = menu.id;
        }
        return result;
      }
      return state.menuList.map(menuToRoute);
    },
  },
  actions: {
    setMenuList(list: Array<Menu>) {
      resetRouter();
      this.menuList = list;
      this.isCompleted = true;
    },
    clearMenuList() {
      resetRouter();
      this.menuList = [];
      this.isCompleted = false;
    },
    async initPermissionMenu() {
      const menu = await GetPermission({
        appId: getEnv("VITE_APP_ID"),
      });
      this.setMenuList(menu);
      this.getRouteByMenu.forEach((route) => {
        router.addRoute("Root", route);
      });
    },
  },
});
