import { createStore } from "vuex";
import createSpotifyApi from "@src/api/spotify";
import { getImageColor } from "@src/utils/colorUtils";

export default createStore({
	state() {
		return {
			accounts: [],
			account: undefined,
			current_playing: undefined,
			status: undefined,
			primary: "rgb(22,22,22)",
			secondary: "rgb(10,10,10)",
		};
	},
	getters: {
		accounts(state) {
			return state.accounts.sort((a,b) => a.display_name < b.display_name ? -1 : a.display_name == b.display_name ? 0 : 1);
		},
		image(state) {
			if(!state.current_playing) return undefined;
			return state.current_playing.album.images.sort((a, b) => (a.width > b.width ? -1 : 1))[0];
		},
		artists(state) {
			if(!state.current_playing) return undefined;
			return state.current_playing.artists.map((artist) => artist.name).join(", ");
		}
	},
	mutations: {
		addAccount(state, account) {
			state.accounts.push(account);
		},
		setAccount(state, account) {
			state.account = account;
		},
		setCurrentPlaying(state, current) {
			state.current_playing = current;
		},
		setStatus(state, status) {
			state.status = status;
		},
		setPrimary(state, color) {
			state.primary = color;
		},
		setSecondary(state, color) {
			state.secondary = color;
		}
	},
	actions: {
		init({ commit, state, dispatch }) {
			const tokens = process.env.VUE_APP_TOKENS.split(";");
			for (const refresh_token of tokens) {
				createSpotifyApi(refresh_token)
					.then((api) => {
						api.get("/me")
							.then((res) => {
								commit("addAccount", {
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

			window.onSpotifyWebPlaybackSDKReady = () => {
				const player = new window.Spotify.Player({
					name: "Opel Corsa C14",
					getOAuthToken: (cb) => cb(state.account.api.access_token),
					volume: 0.1
				});
	
				player.addListener("ready", (device) => {
					state.account.api.put("/me/player", { device_ids: [device.device_id] }).catch((err) => console.log(err.response));
				});
	
				player.addListener("player_state_changed", (data) => {
					dispatch("setStatus", data);
				});
	
				player.connect();
			};
		},
		setStatus({ commit, state }, status) {
			const current_playing = status.track_window.current_track;
			const current_image = current_playing.album.images.sort((a, b) => (a.width > b.width ? -1 : 1))[0];

			if(!state.current_playing || current_playing.id != state.current_playing.id) {
				getImageColor(current_image)
				.then((res) => {
					commit("setPrimary", `rgb(${res[0].r},${res[0].g},${res[0].b})`);
					commit("setSecondary", `rgb(${res[1].r},${res[1].g},${res[1].b})`);
				});
			}

			commit("setCurrentPlaying", current_playing);
			commit("setStatus", status);
		}
	},
});
