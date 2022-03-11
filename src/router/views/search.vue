<script>
import { mapState } from "vuex";

export default {
	name: "Search",
	data() {
		return {
			playlists: [],
			shows: [],
			keyboard: {
				visible: false,
				layout: "normal",
				input: null,
				options: {
					useKbEvents: false,
					preventClickEvent: false
				}
			},
		}
	},
	computed: {
		...mapState({ account: "account" })
	},
	mounted() {
		if(!this.account) return this.$router.push("/login");

		this.account.api.get("/me/playlists?limit=20&offset=0")
		.then((res) => (this.playlists = res.data))
		.catch((err) => console.log(err.response))

		this.account.api.get("/me/shows?limit=20&offset=0")
		.then((res) => (this.shows = res.data))
		.catch((err) => console.log(err.response))
	},
	// watch: {
	// 	playlists(val) {
	// 		console.log(val)
	// 	}
	// },
	methods: {
		test() {
			console.log("test")
		},
		getImage(item) {
			console.log(item)
			return item.images.sort((a, b) => (a.width > b.width ? -1 : 1))[0];
		},
		play(item) {
			console.log(item.uri)
			this.account.api.put("/me/player/play", {
				context_uri: item.uri,
			})
			.then(() => this.$router.push("/"))
			.catch((err) => console.log(err.response));
		},
		accept(text) {
          alert("Input text: " + text);
          this.hide();
        },

        show(e) {
          this.keyboard.input = e.target;
          this.keyboard.layout = e.target.dataset.layout;

          if (!this.keyboard.visible)
            this.keyboard.visible = true
        },

        hide() {
          this.keyboard.visible = false;
        },
	}
};
</script>

<template>
	<div class="main">
		<div class="sidebar">
			<div class="nav-item" @click="$router.push('/')">
				<Icon icon="mdi:home" height="2.5rem" color="white" />
			</div>
			<div class="spacer" />
			<div class="nav-item" @click="$router.go()">
				<Icon icon="mdi:refresh" height="2.5rem" color="white" />
			</div>
		</div>
		<div class="content">
			<div class="search">
				<div class="spacer"></div>
				<input type="text" placeholder="Suchen..." @focus="show">
			</div>
			<div class="title">Playlists</div>
			<div class="gallery">
				<div class="group" v-for="playlist in playlists.items" :key="playlist.id" @click="play(playlist)">
					<div class="item" :style="{ 'background-image': `url('${getImage(playlist).url}')` }" />
					<div class="name">{{playlist.name}}</div>
				</div>
			</div>
			<div class="title">Shows</div>
			<div class="gallery">
				<div class="group" v-for="show in shows.items" :key="show.show.id" @click="$router.push('/show/' + show.show.id)">
					<div class="item" :style="{ 'background-image': `url('${getImage(show.show).url}')` }" />
					<div class="name">{{show.show.name}}</div>
				</div>
			</div>
		</div>
		<!-- <vue-touch-keyboard v-if="keyboard.visible" :options="keyboard.options" :layout="keyboard.layout" :cancel="hide" :accept="accept" :input="keyboard.input" /> -->
	</div>
</template>

<style lang="scss" scoped>
.main {
	width: 100vw;
	height: 100vh;
	display: grid;
	grid-template-areas: "sidebar content";
	grid-template-columns: 5rem calc(100vw - 5rem);
	grid-template-rows: 100vh;

	.sidebar {
		grid-area: sidebar;
		display: flex;
		flex-direction: column;
		background: rgba(0, 0, 0, 0.5);

		.nav-item {
			width: 5rem;
			height: 5rem;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.content {
		grid-area: content;
		padding: 2rem 2rem 0 2rem;
		overflow-x: hidden;
		overflow-y: auto;

		&::-webkit-scrollbar {
			display: none;
		}

		.search {
			display: flex;
			margin-bottom: 1rem;

			input {
				width: 15rem;
				height: 2rem;
				font-size: 13px;
				background: white;
				border: none;
				border-radius: 1rem;
				padding: 0 1rem;

				&:focus {
					outline: none;
				}
			}
		}

		.title {
			color: white;
		}

		.gallery {
			display: flex;
			gap: 2rem;
			overflow-x: auto;
			padding: 1rem 0;

			&::-webkit-scrollbar {
				display: none;
			}

			.group {
				display: block;
				width: 10rem;
				box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
				background: rgba(50,50,50,0.4);
				border-radius: 5px;

				.item {
					width: 10rem;
					min-width: 10rem;
					height: 10rem;
					min-height: 10rem;
					background-repeat: no-repeat;
					background-position: center;
					background-size: cover;
					border-radius: 5px 5px 0 0;
				}

				.name {
					padding: 0.5rem 0;
					text-align: center;
					color: white;
					font-size: 12px;
					word-wrap: break-word;
				}
			}
		}
	}
}
</style>
