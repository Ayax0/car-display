<script>
import { mapState } from "vuex";

export default {
	name: "Login",
	computed: {
		...mapState({ accounts: "accounts" }),
	},
};
</script>

<template>
	<div class="main">
		<div class="account-carusel">
			<div v-for="account in accounts" :key="account.id" class="account-tile">
				{{ account.display_name }}
			</div>
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
}
.account-carusel {
	grid-area: carusel;
	display: flex;
	align-items: center;
	overflow-x: auto;
	overflow-y: hidden;
	margin: 0 6rem;

	.account-tile {
		background: linear-gradient(65deg, rgb(220, 20, 20), rgb(120, 20, 20));
		min-width: 15rem;
		min-height: 15rem;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 1rem;
	}
}
</style>
