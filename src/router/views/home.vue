<script>
import { getCredentials } from "../../api/spotify";
import VueSlider from "vue-slider-component";
import SwipeComponent from "@components/swipe.component";
import Button from "@components/button.component";
import ColorMixin from "@mixins/image.mixin";

export default {
	name: "Home",
	components: {
		VueSlider,
		SwipeComponent,
		Button,
	},
	mixins: [ColorMixin],
	data() {
		return {
			access_token: undefined,
			device_id: undefined,
			status: undefined,
			image: undefined,
			artists: undefined,
			song: undefined,
			volume: 20,
			gain_node: undefined,
			volume_dialog: false,
			volume_dialog_timeout: undefined,
			last_volume_change: -1,
			progress: 0,
			primary: `rgb(22,22,22)`,
			secondary: `rgb(10,10,10)`,
		};
	},
	computed: {
		cssBridge() {
			return {
				"--color-primary": this.primary,
				"--color-secondary": this.secondary,
			};
		},
	},
	watch: {
		volume() {
			this.updateVolume();
			if (this.volume_dialog_timeout) clearTimeout(this.volume_dialog_timeout);
			this.volume_dialog_timeout = setTimeout(() => this.closeVolumeDialog(), 5000);
		},
		volume_dialog(value) {
			if (value) {
				if (this.volume_dialog_timeout) clearTimeout(this.volume_dialog_timeout);
				this.volume_dialog_timeout = setTimeout(() => this.closeVolumeDialog(), 5000);
			}
		},
	},
	async created() {
		const credentials = await getCredentials();
		this.access_token = credentials.access_token;
	},
	mounted() {
		window.onSpotifyWebPlaybackSDKReady = () => {
			const player = new window.Spotify.Player({
				name: "Opel Corsa C14",
				getOAuthToken: (cb) => cb(this.access_token),
				volume: this.volume / 100,
			});

			player.addListener("ready", (device) => {
				console.log("Ready with Device ID", device.device_id);
				this.device_id = device.device_id;
				this.spotify.put("/player", { device_ids: [device.device_id] }).catch((err) => console.log(err.response));
			});

			player.addListener("player_state_changed", (data) => {
				this.status = data;
				this.update();
			});

			player.connect();
		};

		setInterval(() => {
			if (this.status && !this.status.paused) {
				const currentPos = this.status.position + (Date.now() - this.status.timestamp) * this.status.playback_speed;
				this.progress = ((100 / this.status.duration) * currentPos) / 100;
			}
		}, 10);
	},
	methods: {
		triggerPlayback() {
			if (this.status.paused) this.play();
			else this.pause();
		},
		play() {
			this.spotify.put("/player/play?device_id=" + this.device_id).catch((err) => console.log(err.response));
		},
		pause() {
			this.spotify.put("/player/pause?device_id=" + this.device_id).catch((err) => console.log(err.response));
		},
		previous() {
			this.spotify.post("/player/previous?device_id=" + this.device_id).catch((err) => console.log(err.response));
		},
		next() {
			this.spotify.post("/player/next?device_id=" + this.device_id).catch((err) => console.log(err.response));
		},
		jumpTo(ms) {
			this.spotify.put("/player/seek?position_ms=" + ms + "&device_id=" + this.device_id).catch((err) => console.log(err.response));
		},
		update() {
			this.spotify.get("/player/currently-playing").then((res) => {
				if (res.data.current_playing_type == "episode") {
					this.image = "https://placekitten.com/650/650";
					this.artists = "podcast feature currentli not available";
					this.song = "error";
				} else {
					if (this.song != res.data.item.name) {
						this.image = res.data.item.album.images.sort((a, b) => (a.width > b.width ? -1 : 1))[0].url;
						this.artists = res.data.item.artists.map((artist) => artist.name).join(", ");
						this.song = res.data.item.name;
						this.getImageColor2(res.data.item.album.images.sort((a, b) => (a.width < b.width ? -1 : 1))[0]).then((res) => {
							this.primary = `rgb(${res[0].r},${res[0].g},${res[0].b})`;
							this.secondary = `rgb(${res[1].r},${res[1].g},${res[1].b})`;
						});
					}
				}
			});
		},
		updateVolume() {
			if (Date.now() - this.last_volume_change > 1000) {
				this.last_volume_change = Date.now();
				this.spotify
					.put("/player/volume?volume_percent=" + this.volume + "&device_id=" + this.device_id)
					.catch((err) => console.log(err.response));
			} else setTimeout(() => this.updateVolume(), 1020);
		},
		increaseVolume() {
			this.volume += 5;
			if (this.volume > 100) this.volume = 100;
		},
		decreaseVolume() {
			this.volume -= 5;
			if (this.volume < 0) this.volume = 0;
		},
		closeVolumeDialog() {
			this.volume_dialog = false;
			this.volume_dialog_timeout = undefined;
		},
		triggerTimeline(event) {
			const progress = (100 / window.innerWidth) * event.clientX;
			this.jumpTo(Math.round((this.status.duration / 100) * progress));
		},
		tab() {
			if (!this.volume_dialog) this.triggerPlayback();
		},
		swipeLeft() {
			if (!this.volume_dialog) this.next();
		},
		swipeRight() {
			if (!this.volume_dialog) this.previous();
		},
		swipeUp() {
			if (!this.volume_dialog) this.volume_dialog = true;
		},
		swipeDown() {
			if (this.volume_dialog) this.volume_dialog = false;
		},
		swipe(event) {
			if (this.volume_dialog) {
				if (event.xPLast > 0) this.volume = this.volume + event.xPLast > 100 ? 100 : (this.volume += 1);
				if (event.xPLast < 0) this.volume = this.volume + event.xPLast < 0 ? 0 : (this.volume -= 1);
			}
		},
	},
};
</script>

<template>
	<div :style="cssBridge" class="main-wrapper">
		<div class="main">
			<div class="cover">
				<img v-if="image" :src="image" class="album-cover" />
			</div>
			<div class="info">
				<div class="song">
					{{ song }}
				</div>
				<div class="artist">
					{{ artists }}
				</div>
			</div>
			<div class="timeline" @click="triggerTimeline">
				<div class="progress" :style="`width: calc(100% * ${progress})`" />
			</div>
			<div class="action-wrapper">
				<div v-if="status" class="action">
					<template v-if="volume_dialog">
						<Button icon="mdi:volume" @click="volume_dialog = false" />
						<Button icon="mdi:minus" @click="decreaseVolume" />
						<VueSlider v-model="volume" tooltip="none" class="slider" />
						<Button icon="mdi:plus" @click="increaseVolume" />
					</template>
					<template v-else>
						<Button icon="mdi:volume" @click="volume_dialog = true" />
						<div class="spacer" />
						<Button icon="mdi:skip-previous" @click="previous" />
						<Button v-if="status.paused" icon="mdi:play" @click="play" />
						<Button v-else icon="mdi:pause" @click="pause" />
						<Button icon="mdi:skip-next" @click="next" />
						<div class="spacer" />
						<!-- <router-link v-slot="{ navigate }" to="/search" custom>
						<Icon icon="mdi:search" height="2.5rem" color="white" @click="navigate" />
						</router-link> -->
						<Button icon="mdi:search" @click="$router.go()" />
					</template>
				</div>
			</div>
			<div class="volume" />
		</div>
		<SwipeComponent
			class="swipe-component"
			@tab="tab"
			@swipeLeft="swipeLeft"
			@swipeRight="swipeRight"
			@swipeUp="swipeUp"
			@swipeDown="swipeDown"
			@swipe="swipe"
		/>
	</div>
</template>

<style lang="scss" scoped>
.main-wrapper {
	transition: background-color 1s;
	// background: linear-gradient(62deg, var(--color-primary) 0%, var(--color-secondary) 100%);
	background-color: var(--color-primary);

	.main {
		background: linear-gradient(-45deg, rgba(20, 20, 20, 0.15) 30%, rgba(20, 20, 20, 0.5) 100%);
		max-width: 100vw;
		max-height: 100vh;
		display: grid;
		grid-template-areas:
			"cover  info"
			"timeline timeline"
			"action action";

		grid-template-columns: auto 1fr;
		grid-template-rows: calc(100vh - 8.5rem) 0.5rem 8rem;

		color: white;

		.cover {
			backdrop-filter: saturate(110%) contrast(110%);
			grid-area: cover;
			display: flex;
			align-items: center;

			padding: 3rem 1.5rem 3rem 3rem;

			img {
				max-height: calc(100vh - 14.5rem);
				box-shadow: $shadow;
			}
		}

		.info {
			backdrop-filter: saturate(110%) contrast(110%);
			grid-area: info;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: flex-start;

			padding: 3rem 3rem 3rem 1.5rem;

			.song {
				font-weight: bold;
				font-size: 42px;
			}
			.artist {
				margin-top: 5px;
				margin-left: 2px;
				font-weight: lighter;
				font-size: 16px;
			}
		}

		.timeline {
			grid-area: timeline;
			background: rgba(0, 0, 0, 0.5);
			display: flex;
			align-items: center;
			justify-content: flex-start;

			.progress {
				width: 0px;
				pointer-events: none;
				background: rgba(240, 240, 240, 0.9);
				height: 100%;
				transition: width 0.5s ease-out;
			}
		}

		.action-wrapper {
			grid-area: action;
			display: grid;
			grid-template-areas: "action";
			grid-template-columns: 100%;
			grid-template-rows: 100%;
			transition: background-color 1s;

			.action {
				grid-area: action;
				backdrop-filter: brightness(90%) saturate(120%) contrast(120%);
				display: flex;
				justify-content: center;
				align-items: center;

				* {
					width: 8rem;
					pointer-events: visible;
				}

				.spacer {
					flex: 1;
				}

				.slider {
					flex: 1;
					background: none;
				}
			}
		}
	}

	.swipe-component {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 8.5rem;
		left: 0;
	}
}
</style>
