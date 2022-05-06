import { createApp } from "vue";
import store from "@stores/";
import App from "./App.vue";
import router from "./router";
import { Icon } from "@iconify/vue";
import spotifyApi from "./api/spotify";
import Ripple from "vue3-whr-ripple-directive";
Ripple.color = 'rgba(255, 255, 255, 0.35)';
Ripple.zIndex = 100;

const app = createApp(App);

app.component("Icon", Icon);
app.config.globalProperties.spotify = spotifyApi(
	"AQBhZqYRNeEtX-Xnbbo7KElp6KmUfJaaOOdbtPC_XDlv92DjvglCTzN8SU4XCWsVSvG_mlrvea06xjmfJwtLyEyKQ1ZXeZ6iJ-SpqC1av7Oedf7lp7yGi-N0Mzog5mrol5Q"
);
app.directive("ripple", Ripple);

app.use(router);
app.use(store);
app.mount("#app");
