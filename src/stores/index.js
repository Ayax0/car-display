import { createStore } from "vuex";
import createSpotifyApi from "@src/api/spotify";
import { getImageColor } from "@src/utils/colorUtils";
import axios from "axios";

export default createStore({
	state() {
		return {
			variables: undefined,
			accounts: [],
			account: undefined,
			current_playing: undefined,
			status: undefined,
			primary: "rgb(22,22,22)",
			secondary: "rgb(10,10,10)",
			search_items: undefined,
			search_query: "",
			navigation: "",
			route: undefined,
			currentIndex: 0,
			currentStep: 0,
			tts: undefined,
		};
	},
	getters: {
		accounts(state) {
			return state.accounts.sort((a, b) => (a.display_name < b.display_name ? -1 : a.display_name == b.display_name ? 0 : 1));
		},
		image(state) {
			if (!state.current_playing) return undefined;
			return state.current_playing.album.images.sort((a, b) => (a.width > b.width ? -1 : 1))[0];
		},
		artists(state) {
			if (!state.current_playing) return undefined;
			return state.current_playing.artists.map((artist) => artist.name).join(", ");
		},
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
		},
		setSearchItems(state, items) {
			state.search_items = items;
		},
		setSearchQuery(state, query) {
			state.search_query = query;
		},
		setVariables(state, variables) {
			state.variables = variables;
		},
		setNavigation(state, value) {
			state.navigation = value;
		},
		setRoute(state, value) {
			state.route = value;
		},
		setCurrentIndex(state, value) {
			state.currentIndex = value;
		},
		setCurrentStep(state, value) {
			state.currentStep = value;
		},
		setTTS(state, tts) {
			state.tts = tts;
		},
	},
	actions: {
		async init({ commit, state, dispatch }) {
			const getVariable = async () => {
				return new Promise((resolve, reject) => {
					axios
						.get(window.location.origin + "/variables.json")
						.then((result) => resolve(result.data))
						.catch(() => {
							const variables = require("../variables.json");
							if (variables) resolve(variables);
							else reject();
						});
				});
			};

			const variables = await getVariable();
			const tokens = variables.refresh_tokens;

			commit("setVariables", variables);
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
					volume: 1,
				});

				player.addListener("ready", (device) => {
					console.log(device);
					setTimeout(
						() =>
							state.account.api
								.put("/me/player", { device_ids: [device.device_id], play: true })
								.catch((err) => console.log(err.response)),
						1000
					);
				});

				player.addListener("player_state_changed", (data) => {
					dispatch("setStatus", data);
				});

				player.connect();
			};
		},
		setStatus({ commit, state }, status) {
			const current_playing = status?.track_window?.current_track;
			if (current_playing) {
				const current_image = current_playing.album.images.sort((a, b) => (a.width > b.width ? -1 : 1))[0];

				if (!state.current_playing || current_playing.id != state.current_playing.id) {
					getImageColor(current_image).then((res) => {
						commit("setPrimary", `rgb(${res[0].r},${res[0].g},${res[0].b})`);
						commit("setSecondary", `rgb(${res[1].r},${res[1].g},${res[1].b})`);
					});
				}

				commit("setCurrentPlaying", current_playing);
			}
			commit("setStatus", status);
		},
		search({ commit, state }) {
			if (!state.search_query || state.search_query.length == 0) commit("setSearchItems", undefined);
			else
				state.account.api
					.get("/search?q=" + encodeURI(state.search_query) + "&type=artist,playlist,track,show")
					.then((res) => commit("setSearchItems", res.data))
					.catch((err) => console.error(err.response));
		},
	},
});
