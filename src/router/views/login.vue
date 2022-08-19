<script>
import { mapState, mapGetters, mapMutations } from "vuex";

import Button from "@components/button.component";

export default {
	name: "LoginView",
	components: {
		Button,
	},
	computed: {
		...mapState({ account: "account" }),
		...mapGetters({ accounts: "accounts" }),
	},
	methods: {
		...mapMutations({
			setAccount: "setAccount",
		}),
		select(account) {
			this.setAccount(account);
			this.$router.push("/");
			let spotifyScript = document.createElement("script");
			spotifyScript.setAttribute("src", "https://sdk.scdn.co/spotify-player.js");
			document.body.appendChild(spotifyScript);

			let ttsScript = document.createElement("script");
			ttsScript.setAttribute("src", "https://slang.slowsoft.ch/static/scripts/slowsoft_tts.js");
			document.body.appendChild(ttsScript);

			ttsScript.onload = () => this.$store.commit("setTTS", new window.TTS());
		},
	},
};
</script>

<template>
	<div class="main">
		<div class="account-carusel">
			<div v-for="account in accounts" :key="account.id" class="account-tile" @click="select(account)">
				{{ account.display_name }}
			</div>
		</div>
		<div class="account-action">
			<Button icon="mdi:refresh" @click="$router.go()" />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.main {
	max-width: 100vw;
	max-height: 100vh;
	display: grid;
	grid-template-areas:
		"carusel"
		"actions";
	grid-template-columns: 100vw;
	grid-template-rows: calc(100vh - 6rem) 6rem;
	overflow: hidden;
}
.account-carusel {
	grid-area: carusel;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow-x: auto;
	overflow-y: hidden;

	.account-tile {
		// $color: rgb(random(255), random(255), random(255));
		// background: linear-gradient(65deg, $color, darken($color, 10%));
		min-width: 12rem;
		min-height: 12rem;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 1rem;
		box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
			rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
		color: rgb(200, 200, 200);
	}
}

.account-action {
	display: flex;
	align-items: center;
	justify-content: center;
	grid-area: actions;
}
</style>
