import { LAYOUT, PAGE } from "../constant";
import type { RouteRecord } from "../types";
import { isArray } from "lodash";

// import.meta.glob() 直接引入所有的模块 Vite 独有的功能
const modules: Recordable = import.meta.glob("./modules/**/*.ts", {
  eager: true,
});
export const routeModuleList: RouteRecord[] = [];

for (const key in modules) {
  const mod = modules[key].default;
  if (mod) {
    if (isArray(mod)) {
      routeModuleList.push(...mod);
    } else {
      routeModuleList.push(mod);
    }
  }
}

// 根路由
export const RootRoute: RouteRecord = {
  path: "/",
  name: "Root",
  redirect: PAGE.home,
  component: LAYOUT,
  children: [
    {
      path: PAGE.home,
      name: "home",
      component: () => import("@/views/home.vue"),
      meta: {
        title: "首页",
      },
    },
  ],
};
/**
 * 登录
 */
export const LoginRoute: RouteRecord = {
  path: PAGE.login,
  name: "login",
  component: () => import("@/views/sys/login/Login.vue"),
  meta: {
    title: "登录",
  },
};

/**
 * 重定向
 */
export const RedirectRoute: RouteRecord = {
  path: PAGE.redirect,
  name: "redirect",
  redirect: "/redirect/index",
  component: LAYOUT,
  children: [
    {
      path: "/redirect/index",
      name: "redirect_index",
      component: () => import("@/views/sys/redirect/Redirect.vue"),
    },
  ],
};

/**
 * 404
 */
export const PageNotFoundRoute: RouteRecord = {
  path: "/:path(.*)*",
  name: "404",
  component: LAYOUT,
  meta: {
    title: "ErrorPage",
  },
  children: [
    {
      alias: PAGE.notFound,
      path: "/:path(.*)*",
      name: "404",
      component: () => import("@/views/sys/error/404.vue"),
      meta: {
        title: "404",
      },
    },
  ],
};

// Basic routing without permission
// 未经许可的基本路由
export const basicRoutes = [
  LoginRoute,
  RootRoute,
  RedirectRoute,
  PageNotFoundRoute,
  ...routeModuleList,
];
