import { RouterView } from "vue-router";

export default {
  path: "/:path(.*)*",
  redirect: "404",
  // component: () => <RouterView></RouterView>,
  children: [
    {
      path: "401",
      name: `401`,
      component: () => import("@/views/error/401.vue"),
    },
    {
      path: "403",
      name: `403`,
      component: () => import("@/views/error/403.vue"),
    },
    {
      path: "404",
      name: `404`,
      component: () => import("@/views/error/404.vue"),
    },
  ],
};
