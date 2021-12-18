const axios = require('axios')
const oauth = require('axios-oauth-client')
const tokenProvider = require('axios-token-interceptor')

const scope = [
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-playback-position',
    'user-top-read'
]

export const getCredentials = oauth.client(axios.create(), {
    url: 'https://accounts.spotify.com/api/token',
    grant_type: 'refresh_token',
    client_id: '7d3a99474aa94be9b78b1040f712a7a5',
    client_secret: '487f1e587730445798647d5d10f6fec8',
    refresh_token: 'AQBhZqYRNeEtX-Xnbbo7KElp6KmUfJaaOOdbtPC_XDlv92DjvglCTzN8SU4XCWsVSvG_mlrvea06xjmfJwtLyEyKQ1ZXeZ6iJ-SpqC1av7Oedf7lp7yGi-N0Mzog5mrol5Q',
    scope: scope.join(' ')
})

const instance = axios.create({ baseURL: 'https://api.spotify.com/v1/me' })
instance.interceptors.request.use(oauth.interceptor(tokenProvider, getCredentials))

export default instance
