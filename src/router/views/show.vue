<script>
import { mapState } from "vuex";

import { getImageColor } from "@src/utils/colorUtils.js";

export default {
	name: "ShowView",
	data() {
		return {
			show: undefined,
			episodes: undefined,
			color: undefined,
			max: 0,
		};
	},
	computed: {
		...mapState({ account: "account" }),
		showId() {
			return this.$route.params.id;
		},
		cssBridge() {
			return {
				"--color-primary": this.color,
			};
		},
		image() {
			return this.show.images[0];
		},
	},
	watch: {
		episodes(val) {
			console.log(val);
		},
	},
	mounted() {
		if (!this.account) return this.$router.push("/login");

		this.account.api
			.get("/shows/" + this.showId)
			.then((res) => {
				this.show = res.data;
				this.show.images.sort((a, b) => (a.width > b.width ? -1 : 1));
				this.max = this.show.total_episodes;
				getImageColor(this.image).then((res) => (this.color = `rgb(${res[0].r},${res[0].g},${res[0].b})`));
			})
			.catch((err) => console.log(err));

		this.account.api
			.get("/shows/" + this.showId + "/episodes?limit=20&offset=0")
			.then((res) => {
				this.episodes = res.data.items;
			})
			.catch((err) => console.log(err));
	},
	methods: {
		play(episode) {
			console.log(episode);
			this.account.api
				.put("/me/player/play", {
					context_uri: this.show.uri,
					offset: {
						uri: episode.uri,
					},
				})
				.then(() => this.$router.push("/"))
				.catch((err) => console.log(err.response));
		},
		loadMore() {
			this.account.api
				.get("/shows/" + this.showId + "/episodes?limit=20&offset=" + this.episodes.length)
				.then((res) => {
					this.episodes = this.episodes.concat(res.data.items);
				})
				.catch((err) => console.log(err));
		},
	},
};
</script>

<template>
	<div class="main" :style="cssBridge">
		<template v-if="show">
			<div class="header">
				<div class="back-button" @click="$router.go(-1)">
					<Icon icon="mdi:chevron-left-circle" height="2.5rem" color="white" />
				</div>
				<img :src="image.url" />
				<div class="info">
					<div class="show-type">Podcast</div>
					<div class="show-title">
						{{ show.name }}
					</div>
					<div class="show-publisher">
						{{ show.publisher }}
					</div>
				</div>
			</div>
			<div class="content">
				<div class="section-title">Informationen</div>
				<div class="description-content" v-html="show.html_description" />
				<div class="section-title">Alle Folgen</div>
				<template v-if="episodes">
					<div v-for="episode in episodes" :key="episode.id" class="episode" @click="play(episode)">
						<img :src="episode.images[0].url" />
						<div class="episode-info">
							<div class="episode-title">
								{{ episode.name }}
							</div>
							<div class="episode-description">
								{{ episode.description }}
							</div>
						</div>
					</div>
					<div v-if="episodes.length < max" class="load-more" @click="loadMore">Mehr laden</div>
				</template>
			</div>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.main {
	width: 100vw;
	height: 100vh;
	display: grid;
	grid-template-areas:
		"header"
		"content";
	grid-template-columns: 100vw;
	grid-template-rows: 20rem auto;
	background: var(--color-primary);
	color: white;
	overflow-y: auto;

	&::-webkit-scrollbar {
		display: none;
	}

	.header {
		position: relative;
		grid-area: header;
		padding: 1rem;
		display: flex;
		align-items: flex-end;
		gap: 1rem;
		background: linear-gradient(180deg, rgba(40, 40, 40, 0.1) 0%, rgba(0, 0, 0, 0.6) 100%);

		.back-button {
			position: absolute;
			top: 0;
			left: 0;
			width: 5rem;
			height: 5rem;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		img {
			height: 12rem;
			width: 12rem;
			border-radius: 10px;
		}

		.info {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			gap: 0.3rem;

			.show-type {
				font-weight: bold;
				font-size: 12px;
				text-transform: uppercase;
			}

			.show-title {
				font-weight: 900;
				font-size: 40px;
			}
		}
	}

	.content {
		grid-area: content;
		background: linear-gradient(180deg, rgba(20, 20, 20, 0.3) -15rem, rgba(20, 20, 20, 1) 10rem);
		padding: 2rem 1rem 1rem 1rem;
		display: flex;
		flex-direction: column;

		.section-title {
			font-weight: bold;
			font-size: 22px;
			margin-bottom: 1rem;
		}

		.description-content {
			color: rgba(255, 255, 255, 0.5);
			font-weight: lighter;
			margin-top: -1rem;
			margin-bottom: 1rem;
		}

		.episode {
			height: 7rem;
			border-top: 2px solid rgba(255, 255, 255, 0.1);
			padding: 1rem 0;
			display: grid;
			grid-template-areas: "image info";
			grid-template-columns: 7rem calc(100% - 8rem);
			grid-template-rows: 7rem;
			gap: 1rem;

			img {
				grid-area: image;
				height: 7rem;
				border-radius: 10px;
			}

			.episode-info {
				grid-area: info;
				height: 7rem;
				display: flex;
				flex-direction: column;

				.episode-title {
					font-weight: bold;
					padding: 0.8rem 0;
				}

				.episode-description {
					overflow: hidden;
					font-size: 14px;
					color: rgba(255, 255, 255, 0.5);
					font-weight: lighter;
					height: 38px;
				}
			}
		}

		.load-more {
			height: 3rem;
			display: flex;
			justify-content: center;
			align-items: center;
			background: rgba(255, 255, 255, 0.05);
			border-radius: 5px;
		}
	}
}
</style>
