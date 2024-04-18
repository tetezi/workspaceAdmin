import { getStorageName } from "@/utils/env";
import { defineStore } from "pinia";
import { useUserStore } from "./user";
import { GetPermission } from "@/api/sys/menus";
import { resetRouter } from "@/router";
import type { RouteRecord } from "@/router/types";
import { useRouter } from "vue-router";
type Menu = {
  Id: UUID;
  Name: string;

  UrlLabel: Nullable<string>;
  Type: "Iframe" | "Component";
  Url: Nullable<string>;
  Param: Nullable<string>;

  Sort: number;
  ParentId: UUID;
  AppId: UUID;
  IsEnabled: boolean;
  SubMenus: Menu[];
};
type State = {
  isCompleted: boolean;
  menuList: Array<Menu>;
};

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
        const children = menu.SubMenus.map(menuToRoute);
        const result: any = {
          meta: {
            title: menu.Name,
          },
          children,
        };
        if (menu.UrlLabel && menu.Url) {
          result.path = menu.UrlLabel;
          const component =
            menu.Type === "Component"
              ? () => import(`@/views${menu.Url}.vue`)
              : undefined;
          if (children.length > 0) {
            children.unshift({
              alias: menu.UrlLabel,
              path: `${menu.UrlLabel}/_index`,
              component,
              children: [],
            });
          } else {
            result.component = component;
          }
        } else {
          result.path = menu.Id;
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
    async initPermissionMenu() {
      const router = useRouter();
      const menu = await GetPermission();
      this.setMenuList(menu);
      this.getRouteByMenu.forEach((route) => {
        router.addRoute("Root", route);
      });
    },
  },
});
