<script>
export default {
	name: "Button",
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
		<Icon :icon="icon" height="3rem" :color="color" />
	</div>
</template>

<style lang="scss" scoped>
.button {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 8rem;
	height: 8rem;
}
</style>
