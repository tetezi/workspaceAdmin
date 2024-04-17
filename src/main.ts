import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./stores";
import "ttz-ui/dist/style.css";
import "element-plus/es/components/message/style/css";
const app = createApp(App);

app.use(store);
app.use(router);
app.mount("#app");
