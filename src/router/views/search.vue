<script>
import { mapState, mapActions } from "vuex";

import Keyboard from "@components/keyboard.component.vue";
import Item from "@components/item.component.vue";

export default {
	name: "SearchView",
	components: {
		Keyboard,
		Item
	},
	data() {
		return {
			playlists: [],
			shows: [],
			keyboard: false,
		}
	},
	computed: {
		...mapState({ account: "account", items: "search_items" }),
		search: {
			get() {
				return this.$store.state.search_query;
			},
			set(value) {
				return this.$store.commit("setSearchQuery", value);
			}
		}
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
	methods: {
		...mapActions({
			query: "search"
		}),
		play(item) {
			this.account.api.put("/me/player/play", {
				context_uri: item.uri,
			})
			.then(() => this.$router.push("/"))
			.catch((err) => console.log(err.response));
		},
		playTrack(item) {
			this.account.api.put("/me/player/play", {
				uris: [item.uri],
			})
			.then(() => this.$router.push("/"))
			.catch((err) => console.log(err.response));
		},
	}
};
</script>

<template>
  <div class="main">
    <div class="sidebar">
      <div
        class="nav-item"
        @click="$router.push('/')"
      >
        <Icon
          icon="mdi:home"
          height="2.5rem"
          color="white"
        />
      </div>
      <div class="spacer" />
      <div
        class="nav-item"
        @click="$router.go()"
      >
        <Icon
          icon="mdi:refresh"
          height="2.5rem"
          color="white"
        />
      </div>
    </div>
    <div class="content">
      <div class="search">
        <div class="spacer" />
        <input
          v-model="search"
          type="text"
          placeholder="Suchen..."
          @focus="keyboard = true"
        >
      </div>
      <template v-if="items">
        <template v-if="items.artists && items.artists.items.length > 0">
          <div class="title">
            Künstler:
          </div>
          <div class="gallery">
            <Item
              v-for="item in items.artists.items"
              :key="item.id"
              :value="item"
              rounded
              @click="play(item)"
            />
          </div>
        </template>
        <template v-if="items.tracks && items.tracks.items.length > 0">
          <div class="title">
            Songs:
          </div>
          <div class="gallery">
            <Item
              v-for="item in items.tracks.items"
              :key="item.id"
              :value="item"
              @click="playTrack(item)"
            />
          </div>
        </template>
        <template v-if="items.playlists && items.playlists.items.length > 0">
          <div class="title">
            Playlists:
          </div>
          <div class="gallery">
            <Item
              v-for="item in items.playlists.items"
              :key="item.id"
              :value="item"
              :to="'/playlist/' + item.id"
            />
          </div>
        </template>
        <template v-if="items.shows && items.shows.items.length > 0">
          <div class="title">
            Podcasts:
          </div>
          <div class="gallery">
            <Item
              v-for="item in items.shows.items"
              :key="item.id"
              :value="item"
              :to="'/show/' + item.id"
            />
          </div>
        </template>
      </template>

      <template v-else>
        <div class="title">
          Playlists:
        </div>
        <div class="gallery">
          <Item
            v-for="item in playlists.items"
            :key="item.id"
            :value="item"
            :to="'/playlist/' + item.id"
          />
        </div>
        <div class="title">
          Podcasts:
        </div>
        <div class="gallery">
          <Item
            v-for="item in shows.items"
            :key="item.show.id"
            :value="item.show"
            :to="'/show/' + item.show.id"
          />
        </div>
      </template>
    </div>
    <Keyboard
      v-model:value="keyboard"
      @key="search += $event"
      @delete="search = search.slice(0,-1)"
      @submit="query"
    />
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
		}
	}
}
</style>
