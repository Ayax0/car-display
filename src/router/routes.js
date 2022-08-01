// import { defineAsyncComponent } from "vue";

export default [
	{
		path: "/",
		name: "Home",
		component: () => import("@views/home.vue"),
	},
	{
		path: "/search",
		name: "Search",
		component: () => import("@views/search.vue"),
	},
	{
		path: "/login",
		name: "Login",
		component: () => import("@views/login.vue"),
	},
	{
		path: "/show/:id",
		name: "Show",
		component: () => import("@views/show.vue"),
	},
	{
		path: "/playlist/:id",
		name: "Playlist",
		component: () => import("@views/playlist.vue"),
	},
	{
		path: "/test",
		name: "Test",
		component: () => import("@views/test.vue"),
	},
];

// function lazyLoadView(AsyncView) {
// 	return Promise.resolve(
// 		defineAsyncComponent({
// 			loader: () => AsyncView,
// 			// A component to use while the component is loading.
// 			loading: require("@views/_loading.vue").default,
// 			// Delay before showing the loading component.
// 			// Default: 200 (milliseconds).
// 			delay: 200,
// 			// A fallback component in case the timeout is exceeded
// 			// when loading the component.
// 			error: require("@views/_timeout.vue").default,
// 			// Time before giving up trying to load the component.
// 			// Default: Infinity (milliseconds).
// 			timeout: 10000,
// 		})
// 	);
// }
