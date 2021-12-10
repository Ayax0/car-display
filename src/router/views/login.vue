<script>
export default {
    name: 'Login',
    mounted () {
        const clientId = '7d3a99474aa94be9b78b1040f712a7a5'
        const redirectUri = 'http://localhost:8080/'

        const scope = [
            'user-modify-playback-state',
            'streaming',
            'user-read-playback-position',
            'app-remote-control',
            'user-read-currently-playing'
        ]

        var url = 'https://accounts.spotify.com/authorize'
        url += '?response_type=token'
        url += '&client_id=' + encodeURIComponent(clientId)
        url += '&scope=' + encodeURIComponent(scope.join(' '))
        url += '&redirect_uri=' + encodeURIComponent(redirectUri)

        window.location.href = url
    }
}
</script>

<template>
	<div>

	</div>
</template>

<style lang="scss" scoped>

</style>
