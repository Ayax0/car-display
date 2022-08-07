<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";

import VueSlider from "vue-slider-component";
import SwipeComponent from "@components/swipe.component";
import Button from "@components/button.component";
import Map from "@components/map.component.vue";
import Keyboard from "@components/keyboard.component.vue";

import ColorMixin from "@mixins/image.mixin";

export default {
	name: "HomeView",
	components: {
		VueSlider,
		SwipeComponent,
		Button,
		Map,
		Keyboard,
	},
	mixins: [ColorMixin],
	data() {
		return {
			volume: 10,
			volume_dialog: false,
			volume_dialog_timeout: undefined,
			last_volume_change: -1,
			progress: 0,
			navigate_keyboard: false,
		};
	},
	computed: {
		...mapState({ account: "account", primary: "primary", secondary: "secondary", status: "status", current: "current_playing" }),
		...mapGetters({ image: "image", artists: "artists" }),
		cssBridge() {
			return {
				"--color-primary": this.primary,
				"--color-secondary": this.secondary,
			};
		},
		navigation: {
			get() {
				return this.$store.state.navigation;
			},
			set(value) {
				this.$store.commit("setNavigation", value);
			},
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
				this.volume_dialog_timeout = setTimeout(() => this.closeVolumeDialog(), 8000);
			}
		},
	},
	mounted() {
		if (!this.account) return this.$router.push("/login");

		setInterval(() => {
			if (this.status && !this.status.paused) {
				const currentPos = this.status.position + (Date.now() - this.status.timestamp) * (this.status.playback_speed || 1);
				this.progress = ((100 / this.status.duration) * currentPos) / 100;
			}
		}, 10);
	},
	methods: {
		...mapMutations({
			setCurrentPlaying: "setCurrentPlaying",
		}),
		...mapActions({
			setStatus: "setStatus",
		}),
		triggerPlayback() {
			if (this.status.paused) this.play();
			else this.pause();
		},
		play() {
			this.account.api.put("/me/player/play").catch((err) => console.log(err.response));
		},
		pause() {
			this.account.api.put("/me/player/pause").catch((err) => console.log(err.response));
		},
		previous() {
			this.account.api.post("/me/player/previous").catch((err) => console.log(err.response));
		},
		next() {
			this.account.api.post("/me/player/next").catch((err) => console.log(err.response));
		},
		jumpTo(ms) {
			this.account.api.put("/me/player/seek?position_ms=" + ms).catch((err) => console.log(err.response));
		},
		updateVolume() {
			if (Date.now() - this.last_volume_change > 1000) {
				this.last_volume_change = Date.now();
				this.account.api.put("/me/player/volume?volume_percent=" + this.volume).catch((err) => console.log(err.response));
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
				if (event.yPLast < 0) this.volume = this.volume + 2 > 100 ? 100 : (this.volume += 2);
				if (event.yPLast > 0) this.volume = this.volume - 2 < 0 ? 0 : (this.volume -= 2);
			}
		},
		route() {
			if (this.navigation == undefined || this.navigation.length == 0) return;
			this.$refs.map.route(this.navigation);
		},
	},
};
</script>

<template>
	<div class="main" :style="cssBridge">
		<Map ref="map" class="map" :color="primary" />
		<div class="control-wrapper">
			<div class="control">
				<div class="timeline" @click="triggerTimeline">
					<div class="progress" :style="`width: calc(100% * ${progress})`" />
				</div>
				<div class="action">
					<template v-if="status">
						<img :src="image.url" />
						<div class="info">
							<div class="title">{{ current.name }}</div>
							<div class="artist">{{ artists }}</div>
						</div>
						<div class="audio-control">
							<Button icon="mdi:skip-previous" @click="previous" />
							<Button v-if="status.paused" icon="mdi:play" @click="play" />
							<Button v-else icon="mdi:pause" @click="pause" />
							<Button icon="mdi:skip-next" @click="next" />
							<router-link v-slot="{ navigate }" to="/search" custom>
								<Button icon="mdi:search" @click="navigate" />
							</router-link>
						</div>
					</template>
					<template v-else>
						<div />
						<div />
						<Button icon="mdi:refresh" @click="$router.go()" />
					</template>
				</div>
			</div>
		</div>
		<div class="volume" :class="{ expand: volume_dialog }">
			<div class="action-wrapper">
				<div class="action" @click="volume_dialog = !volume_dialog">
					<Icon icon="mdi:volume" height="2rem" color="white" />
				</div>
			</div>
			<VueSlider v-model="volume" direction="btt" tooltip="none" class="slider" />
		</div>
		<div class="search" :class="{ expand: navigate_keyboard }">
			<div class="action-wrapper">
				<div class="action" @click="navigate_keyboard = !navigate_keyboard">
					<Icon icon="mdi:navigation" height="2rem" color="white" />
				</div>
			</div>
			<div class="text">{{ navigation }}</div>
		</div>
		<Keyboard v-model:value="navigate_keyboard" @key="navigation += $event" @delete="navigation = navigation.slice(0, -1)" @submit="route" />
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
.main {
	position: relative;
	width: 100vw;
	height: 100vh;

	.map {
		width: 100%;
		height: 100%;
	}

	.control-wrapper {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: background-color 1s;
		background-color: var(--color-primary);

		.control {
			background: linear-gradient(-45deg, rgba(20, 20, 20, 0.4) 30%, rgba(20, 20, 20, 0.6) 100%);
			overflow: hidden;
			display: grid;
			grid-template-columns: 100%;
			grid-template-rows: 5px 8rem;

			color: white;

			.timeline {
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

			.action {
				backdrop-filter: brightness(90%) saturate(120%) contrast(120%);
				display: grid;
				grid-template-columns: 8rem calc(100% - 8rem - 24rem) auto;

				img {
					width: 6rem;
					height: 6rem;
					padding: 1rem;
				}

				.info {
					height: 100%;
					display: flex;
					flex-direction: column;
					justify-content: center;

					.title {
						font-size: 22px;
						font-weight: bold;
						width: 100%;
						text-overflow: ellipsis;
						overflow: hidden;
						display: -webkit-box;
						-webkit-line-clamp: 3;
						-webkit-box-orient: vertical;
					}

					.artist {
						font-size: 13px;
						font-weight: 100;
						width: 100%;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}

				.audio-control {
					width: 100%;
					display: flex;
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

	.volume {
		position: absolute;
		bottom: 10rem;
		left: 2rem;
		background: linear-gradient(-45deg, rgba(20, 20, 20, 0.6) 30%, rgba(20, 20, 20, 0.7) 100%);
		border: 2px solid var(--color-primary);
		box-shadow: $shadow;
		width: 4rem;
		height: 4rem;
		border-radius: 2rem;
		display: flex;
		gap: 1rem;
		flex-direction: column-reverse;
		align-items: center;
		transition: height 0.2s ease, border 0.5s ease-in-out;
		overflow: hidden;
		z-index: 1;

		.action-wrapper {
			background-color: var(--color-primary);
			transition: background-color 0.5s ease-in-out;

			.action {
				width: 4rem;
				height: 4rem;
				min-height: 4rem;
				display: flex;
				justify-content: center;
				align-items: center;
				background: linear-gradient(-45deg, rgba(20, 20, 20, 0.4) 30%, rgba(20, 20, 20, 0.6) 100%);
				backdrop-filter: brightness(90%) saturate(120%) contrast(120%);
			}
		}

		.slider {
			flex: 1;
			margin-top: 2rem;
		}
	}

	.volume.expand {
		height: calc(100% - 12rem);
	}

	.search {
		position: absolute;
		bottom: 10rem;
		left: 8rem;
		width: 4rem;
		height: 4rem;
		border-radius: 2rem;
		background: linear-gradient(-45deg, rgba(20, 20, 20, 0.6) 30%, rgba(20, 20, 20, 0.7) 100%);
		border: 2px solid var(--color-primary);
		overflow: hidden;
		display: flex;
		align-items: center;
		transition: width 0.2s ease, bottom 0.2s ease-in-out, left 0.2s ease-in-out;
		z-index: 1;

		.action-wrapper {
			background-color: var(--color-primary);
			transition: background-color 0.5s ease-in-out;
			.action {
				width: 4rem;
				min-width: 4rem;
				height: 4rem;
				display: flex;
				justify-content: center;
				align-items: center;
				background: linear-gradient(-45deg, rgba(20, 20, 20, 0.4) 30%, rgba(20, 20, 20, 0.6) 100%);
				backdrop-filter: brightness(90%) saturate(120%) contrast(120%);
			}
		}

		.text {
			width: 100%;
			background: transparent;
			color: white;
			font-size: 20px;
			margin: 0 1rem;
			overflow: hidden;
		}
	}

	.search.expand {
		width: calc(100% - 4rem);
		bottom: calc(100% - 6rem);
		left: 2rem;
	}
}

.swipe-component {
	position: absolute;
	top: 0;
	right: 0;
	bottom: calc(8rem + 5px);
	left: 0;
}
</style>
