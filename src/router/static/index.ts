import HomeView from "../../views/HomeView.vue";
import type { RouteRecord } from "../types";
const staticRoutes: RouteRecord[] = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../../views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "login",
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("@/views/sys/login/Login.vue"),
  },
  {
    path: "/formDesigner",
    name: "formDesigner",
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("@/views/sys/form/designer/Designer.vue"),
  },
];
/**
 * 自动添加static内ts文件静态路由
 */
const staticFiles: Recordable<{
  default: RouteRecord;
}> = import.meta.glob("./*.ts", { eager: true });
for (const key in staticFiles) {
  if (staticFiles[key].default) {
    staticRoutes.push(staticFiles[key].default);
  }
}

export default staticRoutes;
