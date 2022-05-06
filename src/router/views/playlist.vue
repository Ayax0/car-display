<script>
import { mapState } from "vuex";

import { getImageColor } from "@src/utils/colorUtils.js";

export default {
	name: "Playlist",
	data() {
		return {
      playlist: undefined,
			tracks: undefined,
      color: undefined,
      max: 0,
		}
	},
	computed: {
		...mapState({ account: "account" }),
    playlistId() {
        return this.$route.params.id;
    },
    cssBridge() {
			return {
				"--color-primary": this.color,
			};
		},
    image() {
      return this.playlist.images[0];
    }
	},
	mounted() {
		if(!this.account) return this.$router.push("/login");

    this.account.api.get("/playlists/" + this.playlistId)
      .then((res) => {
          this.playlist = res.data;
          this.max = this.playlist.tracks.total;
          this.playlist.images.sort((a, b) => (a.width > b.width ? -1 : 1));
          getImageColor(this.image)
            .then((res) => this.color = `rgb(${res[0].r},${res[0].g},${res[0].b})`);
      })
      .catch((err) => console.log(err))

      this.account.api.get("/playlists/" + this.playlistId + "/tracks?limit=20&offset=0")
      .then((res) => {
        this.tracks = res.data.items;
      })
      .catch((err) => console.log(err))
	},
    methods: {
      play(track) {
        console.log(track)
        this.account.api.put("/me/player/play", {
				  context_uri: this.playlist.uri,
          offset: {
              uri: track.uri
          }
			  })
        .then(() => this.$router.push("/"))
        .catch((err) => console.log(err.response));
      },
      loadMore() {
        this.account.api.get("/playlists/" + this.playlistId + "/tracks?limit=20&offset=" + this.tracks.length)
        .then((res) => {
            this.tracks = this.tracks.concat(res.data.items);
        })
        .catch((err) => console.log(err))
      }
    }
};
</script>

<template>
  <div
    class="main"
    :style="cssBridge"
  >
    <template v-if="playlist">
      <div class="header">
        <div
          class="back-button"
          @click="$router.go(-1)"
        >
          <Icon
            icon="mdi:chevron-left-circle"
            height="2.5rem"
            color="white"
          />
        </div>
        <img :src="image.url">
        <div class="info">
          <div class="playlist-type">
            Playlist
          </div>
          <div class="playlist-title">
            {{ playlist.name }}
          </div>
          <div class="playlist-publisher">
            {{ playlist.owner.display_name }}
          </div>
        </div>
      </div>
      <div class="content">
        <div class="section-title">
          Alle Songs
        </div>
        <template v-if="tracks">
          <div
            v-for="track in tracks"
            :key="track.track.id"
            class="track"
            @click="play(track.track)"
          >
            <img :src="track.track.album.images[0].url">
            <div class="track-info">
              <div class="track-title">
                {{ track.track.name }}
              </div>
              <div class="track-artists">
                {{ track.track.artists.map((artist) => artist.name).join(", ") }}
              </div>
            </div>
          </div>
          <div
            v-if="tracks.length < max"
            class="load-more"
            @click="loadMore"
          >
            Mehr laden
          </div>
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
        background: linear-gradient(180deg, rgba(40,40,40,0.1) 0%, rgba(0,0,0,0.6) 100%);

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

            .playlist-type {
                font-weight: bold;
                font-size: 12px;
                text-transform: uppercase;
            }

            .playlist-title {
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

        .track {
            height: 7rem;
            border-top: 2px solid rgba(255,255,255,0.1);
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

            .track-info {
                grid-area: info;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;

                .track-title {
                    width: 100%;
                    font-weight: bold;
                    font-size: 24px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .track-artists {
                    overflow: hidden;
                    font-size: 14px;
                    color: rgba(255,255,255,0.5);
                    font-weight: lighter;
                }
            }
        }

        .load-more {
            height: 3rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(255,255,255,0.05);
            border-radius: 5px;
        }
    }
}
</style>
