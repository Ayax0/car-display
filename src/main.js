import { createApp } from "vue";
import store from "@stores/";
import App from "./App.vue";
import router from "./router";
import { Icon } from "@iconify/vue";
import spotifyApi from "./api/spotify";
import Keyboard from "vue-touch-keyboard";

const app = createApp(App);

app.component("Icon", Icon);
app.config.globalProperties.spotify = spotifyApi(
	"AQBhZqYRNeEtX-Xnbbo7KElp6KmUfJaaOOdbtPC_XDlv92DjvglCTzN8SU4XCWsVSvG_mlrvea06xjmfJwtLyEyKQ1ZXeZ6iJ-SpqC1av7Oedf7lp7yGi-N0Mzog5mrol5Q"
);

app.use(router);
app.use(store);
app.use(Keyboard);
app.mount("#app");
