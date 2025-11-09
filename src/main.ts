/*
 * @Author: tetezi MaHouShouJoTetezi@foxmail.com
 * @Date: 2024-06-15 14:51:33
 * @LastEditors: tetezi MaHouShouJoTetezi@foxmail.com
 * @LastEditTime: 2025-11-09 18:44:33
 * @FilePath: \workspaceAdmin\src\main.ts
 * @Description:
 */
import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import store from "./stores";
import "ttz-ui/dist/style.css";
import "element-plus/es/components/message-box/style/css";
import "element-plus/es/components/message/style/css";
import "@/styles/index.css";
const app = createApp(App);
app.use(store);
app.use(router);
app.mount("#app");
