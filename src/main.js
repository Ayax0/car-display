import { createApp } from "vue";
import store from "@stores/";
import App from "./App.vue";
import router from "./router";
import { Icon } from "@iconify/vue";
import Ripple from "vue3-whr-ripple-directive";
import './registerServiceWorker'
Ripple.color = "rgba(255, 255, 255, 0.35)";
Ripple.zIndex = 100;

const app = createApp(App);

app.component("Icon", Icon);
app.directive("ripple", Ripple);

app.use(router);
app.use(store);
app.mount("#app");
