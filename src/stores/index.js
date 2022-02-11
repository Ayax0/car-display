import { createStore } from "vuex";
import createSpotifyApi from "@src/api/spotify";

export default createStore({
	state() {
		return {
			accounts: [],
		};
	},
	mutations: {
		addAccount(state, account) {
			state.accounts.push(account);
		},
	},
	actions: {
		init(context) {
			const tokens = process.env.VUE_APP_TOKENS.split(";");
			for (const refresh_token of tokens) {
				createSpotifyApi(refresh_token)
					.then((api) => {
						api.get("/")
							.then((res) => {
								context.commit("addAccount", {
									...res.data,
									api,
									getAccessToken: () => api.access_token,
									getRefreshToken: () => api.refresh_token,
								});
							})
							.catch((err) => console.error(err.response));
					})
					.catch((err) => console.error(err));
			}
		},
	},
});
