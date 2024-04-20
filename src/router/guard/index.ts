import { useUserStore } from "@/stores/modules/user";
import { useRouter, type Router } from "vue-router";
import { PAGE } from "../constant";
import { useMenuStore } from "@/stores/modules/menu";

export function setupRouterGuard(router: Router) {
  createMenuGuard(router);
}
function createMenuGuard(router: Router) {
  router.beforeEach(async (to, form, next) => {
    const userStore = useUserStore();
    const menuStore = useMenuStore();
    const token = userStore.getToken;
    if (to.path === PAGE.login) {
      next();
      return 
    }
    if (token) {
      if (!menuStore.isCompleted) {  
        await menuStore.initPermissionMenu();
        next({ path: to.fullPath, replace: true, query: to.query });
        return;
      } else {
        next(); 
        return;
      }
    } else {
      next({
        path: PAGE.login,
        replace: true,
      });
      return;
    }
  });
}
