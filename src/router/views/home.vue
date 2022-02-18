<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex"

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
			volume: 10,
			volume_dialog: false,
			volume_dialog_timeout: undefined,
			last_volume_change: -1,
			progress: 0,
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
	mounted() {
		if(!this.account) return this.$router.push("/login");

		setInterval(() => {
			if (this.status && !this.status.paused) {
				const currentPos = this.status.position + (Date.now() - this.status.timestamp) * this.status.playback_speed;
				this.progress = ((100 / this.status.duration) * currentPos) / 100;
			}
		}, 10);
	},
	methods: {
		...mapMutations({
			setCurrentPlaying: "setCurrentPlaying"
		}),
		...mapActions({
			setStatus: "setStatus"
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
				this.account.api
					.put("/me/player/volume?volume_percent=" + this.volume)
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
				<img v-if="image" :src="image.url" class="album-cover" />
			</div>
			<div class="info">
				<template v-if="current">
					<div class="song">
						{{ current.name }}
					</div>
					<div class="artist">
						{{ artists }}
					</div>
				</template>
			</div>
			<div class="timeline" @click="triggerTimeline">
				<div class="progress" :style="`width: calc(100% * ${progress})`" />
			</div>
			<div class="action-wrapper">
				<div class="action">
					<template v-if="status">
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
							<router-link v-slot="{ navigate }" to="/search" custom>
								<Button icon="mdi:search" @click="navigate" />
							</router-link>
						</template>
					</template>
					<template v-else>
						<div class="spacer" />
						<Button icon="mdi:refresh" @click="$router.go()" />
						<div class="spacer" />
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
