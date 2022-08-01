<script>
export default {
	name: "ControlComponent",
	props: {
		ready: { type: Boolean, default: false },
		map: { type: Object, default: undefined },
		follow: { type: Boolean, default: true },
	},
	emits: ["follow"],
	watch: {
		ready(value, previous) {
			if (!previous && value) {
				if (!this.map) return;

				this.map.addListener("drag", () => {
					this.$emit("follow", false);
				});
			}
		},
	},
};
</script>

<template>
	<div v-if="!follow" class="control-button" style="bottom: 1rem; left: 1rem" @click="$emit('follow', true)">
		<Icon icon="mdi:navigation-outline" height="2rem" color="primary" />
		<div class="label">Zentrieren</div>
	</div>
</template>

<style lang="scss" scoped>
.control-button {
	cursor: pointer;
	position: absolute;
	background: white;
	color: $primary;
	font-weight: bold;
	font-size: 18px;
	min-width: 4rem;
	height: 4rem;
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 0.5rem;
	border-radius: 2rem;
	padding: 0 1rem;
	box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}
</style>
