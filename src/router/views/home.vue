<script>
import { getCredentials } from '../../api/spotify'

export default {
    name: 'Home',
    data () {
        return {
            access_token: undefined,
            device_id: undefined,
            status: undefined,
            image: undefined,
            artists: undefined,
            song: undefined,
            volume: 30
        }
    },
    watch: {
        volume () {
            this.updateVolume()
        }
    },
    methods: {
        test () {
            this.spotify.get('/player/currently-playing')
                .then((res) => console.log(res.data))
        },
        triggerPlayback () {
            if (this.status.paused) this.play()
            else this.pause()
        },
        play () {
            this.spotify.put('/player/play?device_id=' + this.device_id)
                .catch((err) => console.log(err.response))
        },
        pause () {
            this.spotify.put('/player/pause?device_id=' + this.device_id)
                .catch((err) => console.log(err.response))
        },
        previous () {
            this.spotify.post('/player/previous?device_id=' + this.device_id)
                .catch((err) => console.log(err.response))
        },
        next () {
            this.spotify.post('/player/next?device_id=' + this.device_id)
                .catch((err) => console.log(err.response))
        },
        update () {
            this.spotify.get('/player/currently-playing')
                .then((res) => {
                    console.log(res.data)
                    this.image = res.data.item.album.images.sort((a, b) => a.width > b.width ? -1 : 1)[0].url
                    this.artists = res.data.item.artists.map(artist => artist.name).join(', ')
                    this.song = res.data.item.name
                })
        },
        updateVolume () {
            this.spotify.put('/player/volume?volume_percent=' + this.volume + '&device_id=' + this.device_id)
                .catch((err) => console.log(err.response))
        },
        increaseVolume () {
            this.volume += 5
            if (this.volume > 100) this.volume = 100
        },
        decreaseVolume () {
            this.volume -= 5
            if (this.volume < 0) this.volume = 0
        }
    },
    async created () {
        const credentials = await getCredentials()
        this.access_token = credentials.access_token
    },
    mounted () {
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Opel Corsa C14',
                getOAuthToken: cb => cb(this.access_token),
                volume: this.volume / 100
            })

            player.addListener('ready', (device) => {
                console.log('Ready with Device ID', device.device_id)
                this.device_id = device.device_id
                this.spotify.put('/player', { device_ids: [device.device_id] })
                    .catch((err) => console.log(err.response))
            })

            player.addListener('player_state_changed', (data) => {
                this.status = data
                this.update()
            })

            player.connect()
        }
    }
}
</script>

<template>
	<div class="main">
		<div class="display">
			<img :src="image" class="album-cover" v-if="image" @click="triggerPlayback" />
			<div class="artist">{{ artists }}</div>
			<div class="song">{{ song }}</div>
		</div>
		<div class="control" v-if="status">
			<Icon icon="mdi:minus" height="2rem" color="white" @click="decreaseVolume" />
			<div class="spacer"></div>
			<Icon icon="mdi:skip-previous" height="3rem" color="white" @click="previous" />
			<Icon icon="mdi:play-circle" height="3rem" color="white" @click="play" v-if="status.paused" />
			<Icon icon="mdi:pause-circle" height="3rem" color="white" @click="pause" v-else />
			<Icon icon="mdi:skip-next" height="3rem" color="white" @click="next" />
			<div class="spacer"></div>
			<Icon icon="mdi:plus" height="2rem" color="white" @click="increaseVolume" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
p {
	color: $primary
}

.main {
	width: 100%;
	height: 100vh;
	background: rgb(22,22,22);
	background: linear-gradient(0deg, rgba(22,22,22,1) 0%, rgba(48,48,48,1) 100%);

	.display {
		width: 100%;
		height: 100%;
		max-height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #ccc;
		margin-top: -3rem;

		.album-cover {
			width: 40vh;
			height: 40vh;
			box-shadow: $shadow;
			margin: 1rem;
		}

		.artist {
			font-weight: bold;
			font-size: 18px;
		}

		.song {
			font-size: 14px;
		}
	}

	.control {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 6rem;
		display: flex;
		background: rgb(42, 42, 42);
		box-shadow: $shadow;
		justify-content: center;
		align-items: center;

		* {
			width: 6rem;
		}

		.spacer {
			flex: 1;
		}
	}
}
</style>
