<script>
export default {
	name: "ButtonComponent",
	props: {
		color: {
			type: String,
			default: "white",
		},
		icon: {
			type: String,
			default: "mdi:alert-decagram-outline",
		},
	},
};
</script>

<template>
	<div class="button">
		<Icon :icon="icon" height="2.5rem" :color="color" />
	</div>
</template>

<style lang="scss" scoped>
.button {
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 8rem;
}
</style>
