<script>
export default {
	name: "Search",
};
</script>

<template>
	<router-link v-slot="{ navigate }" to="/" custom>
		<Icon icon="mdi:home" height="2.5rem" color="white" @click="navigate" />
	</router-link>
</template>

<style lang="scss" scoped></style>
