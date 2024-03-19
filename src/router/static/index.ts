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
];
const staticFiles: Recordable<{
  default: RouteRecord;
}> = import.meta.glob("./*.ts", { eager: true });
for (const key in staticFiles) {
  if (staticFiles[key].default) {
    staticRoutes.push(staticFiles[key].default);
  }
}

export default staticRoutes;
