import { createRouter, createWebHistory } from "vue-router";
import staticRoutes from "./static";

const router = createRouter({
  sensitive: true,
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: staticRoutes,
});

export default router;
