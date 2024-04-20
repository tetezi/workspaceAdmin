import { defineStore } from "pinia";
import { resetRouter, router } from "@/router";
import type { RouteRecord } from "@/router/types";
import { useRouter } from "vue-router";
export type Menu = {
  Id: UUID;
  Name: string;

  UrlLabel: Nullable<string>;
  Type: "Iframe" | "Component" | "Group";
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
  console.log(matchKeys, component, "component");
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
        const children = menu.SubMenus.map(menuToRoute);
        const result: any = {
          meta: {
            title: menu.Name,
            include: true,
          },
          children,
        };
        if (menu.UrlLabel && menu.Url) {
          result.path = menu.UrlLabel;
          const component =
            menu.Type === "Component" ? dynamicImport(menu.Url) : undefined;
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
    clearMenuList() {
      resetRouter();
      this.menuList = [];
      this.isCompleted = false;
    }, 
    async initPermissionMenu() {  
      // const menu = await GetPermission();
      const menu:any = [
        // {
        //   Id: "ADdawDAWD",
        //   Name: "数据设计表",
        //   UrlLabel: "/dataDesign1",
        //   Type: "Component",
        //   Url: "/sys/form/designer/DataDesigner",
        //   Param: "",
        //   SubMenus: [],
        // },
        // {
        //   Id: "fwafaw",
        //   Name: "SQL设计表",
        //   UrlLabel: "/SqlDesign1",
        //   Type: "Component",
        //   Url: "/sys/form/designer/SqlDesigner",
        //   Param: "",
        //   SubMenus: [],
        // },
        {
          Id: "qwdqd",
          Name: "设计器",
          SubMenus: [
            {
              Id: "ADDAWD",
              Name: "数据表设计器",
              UrlLabel: "/dataDesign",
              Type: "Component",
              Url: "/sys/form/designer/DataDesigner",
              Param: "",
              SubMenus: [],
            },
            {
              Id: "ADDFAWAWD",
              Name: "SQL设计器",
              UrlLabel: "/SqlDesign",
              Type: "Component",
              Url: "/sys/form/designer/SqlDesigner",
              Param: "",
              SubMenus: [],
            },
          ],
        },
      ];
      this.setMenuList(menu);
      this.getRouteByMenu.forEach((route) => {
        router.addRoute("Root", route);
      });
    },
  },
});
