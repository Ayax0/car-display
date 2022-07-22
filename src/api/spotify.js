const axios = require("axios");

export function getCredentials(refresh_token) {
	const auth_string = btoa(process.env.VUE_APP_CLIENT_ID + ":" + process.env.VUE_APP_CLIENT_SECRET);
	const data = new URLSearchParams();

	data.append("grant_type", "refresh_token");
	data.append("refresh_token", refresh_token);

	return axios.post("https://accounts.spotify.com/api/token", data, {
		headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: `Basic ${auth_string}` },
	});
}

export default (refresh_token) => {
	return new Promise((resolve, reject) => {
		const instance = axios.create({ baseURL: "https://api.spotify.com/v1" });

		//TODO: Interceptor
		instance.interceptors.request.use((config) => {
			config.headers.Authorization = `Bearer ${instance.access_token}`;
			return config;
		});

		getCredentials(refresh_token)
			.then((res) => {
				instance.refresh_token = refresh_token;
				instance.access_token = res.data.access_token;
				instance.scope = res.data.scope;
				return resolve(instance);
			})
			.catch((err) => {
				return reject(err.response);
			});
	});
};
