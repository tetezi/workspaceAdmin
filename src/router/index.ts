import { createRouter, createWebHashHistory } from "vue-router";
import staticRoutes from "./static";
const router = createRouter({
  sensitive: true,
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: staticRoutes,
});
console.log(staticRoutes);
export default router;
