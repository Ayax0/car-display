/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable no-undef */
<script>
export default {
    name: 'Home',
    computed: {
        accessToken () {
            return this.spotify.getAccessToken()
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
                player.addListener('ready', (deviceId) => {
                    console.log('Ready with Device ID', deviceId)
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

                player.connect()
            }
        }
    }
}
</script>

<template>
	<div class="main">
		Home
	</div>
</template>

<style lang="scss" scoped>
p {
	color: $primary
}

.main {
	position: relative;
	width: 100%;
	height: 100vh;
	background: rgb(22,22,22);
	background: linear-gradient(0deg, rgba(22,22,22,1) 0%, rgba(48,48,48,1) 100%);
}
</style>
