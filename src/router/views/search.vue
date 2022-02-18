<script>
export default {
	name: "Search",
};
</script>

<template>
	<router-link v-slot="{ navigate }" to="/" custom>
		<Icon icon="mdi:home" height="2.5rem" color="white" @click="navigate" />
		<Icon icon="mdi:refresh" height="2.5rem" color="white" @click="$router.go()" />
	</router-link>
</template>

<style lang="scss" scoped></style>
