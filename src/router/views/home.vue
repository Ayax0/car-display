<script>
export default {
    name: 'Home',
    computed: {
        accessToken () {
            return this.spotify.getAccessToken()
        }
    },
    data () {
        return {
            device_id: undefined,
            status: undefined,
            image: undefined,
            artists: undefined,
            song: undefined
        }
    },
    methods: {
        test () {
            this.spotify.get('/me/player/currently-playing')
                .then((res) => console.log(res.data))
        },
        play () {
            this.spotify.put('/me/player/play?device_id=' + this.device_id)
                .catch((err) => console.log(err.response))
        },
        pause () {
            this.spotify.put('/me/player/pause?device_id=' + this.device_id)
                .catch((err) => console.log(err.response))
        },
        previous () {
            this.spotify.post('/me/player/previous?device_id=' + this.device_id)
                .catch((err) => console.log(err.response))
        },
        next () {
            this.spotify.post('/me/player/next?device_id=' + this.device_id)
                .catch((err) => console.log(err.response))
        },
        update () {
            this.spotify.get('/me/player/currently-playing')
                .then((res) => {
                    console.log(res.data)
                    this.image = res.data.item.album.images.sort((a, b) => a.width > b.width ? -1 : 1)[0].url
                    this.artists = res.data.item.artists.map(artist => artist.name).join(', ')
                    this.song = res.data.item.name
                })
        }
    },
    mounted () {
        const token = new URLSearchParams(window.location.hash.substring(1)).get('access_token')

        if (!token) this.$router.push('/login')
        else {
            window.onSpotifyWebPlaybackSDKReady = () => {
                const player = new window.Spotify.Player({
                    name: 'Opel Corsa C14',
                    getOAuthToken: cb => { cb(token) },
                    volume: 0.5
                })

                // Ready
                player.addListener('ready', (device) => {
                    console.log('Ready with Device ID', device.device_id)
                    this.device_id = device.device_id
                    this.spotify.put('/me/player', { device_ids: [device.device_id] })
                        .then(() => setTimeout(() => this.play(), 2000))
                })

                // Not Ready
                player.addListener('not_ready', (deviceId) => {
                    console.log('Device ID has gone offline', deviceId)
                })

                player.addListener('initialization_error', ({ message }) => {
                    console.error(message)
                })

                player.addListener('authentication_error', ({ message }) => {
                    console.error(message)
                })

                player.addListener('account_error', ({ message }) => {
                    console.error(message)
                })

                player.addListener('player_state_changed', (data) => {
                    this.status = data
                    this.update()
                })

                player.connect()
            }
        }
    }
}
</script>

<template>
	<div class="main">
		<div class="display">
			<img :src="image" class="album-cover" v-if="image" />
			<div class="artist">{{ artists }}</div>
			<div class="song">{{ song }}</div>
		</div>
		<div class="control" v-if="status">
			<Icon icon="mdi:minus" height="2rem" color="white" />
			<div class="spacer"></div>
			<Icon icon="mdi:skip-previous" height="3rem" color="white" @click="previous" />
			<Icon icon="mdi:play-circle" height="3rem" color="white" @click="play" v-if="status.paused" />
			<Icon icon="mdi:pause-circle" height="3rem" color="white" @click="pause" v-else />
			<Icon icon="mdi:skip-next" height="3rem" color="white" @click="next" />
			<div class="spacer"></div>
			<Icon icon="mdi:plus" height="2rem" color="white" @click="update" />
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
			box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
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
		box-shadow: -3px -3px 10px 10px #161616;
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
