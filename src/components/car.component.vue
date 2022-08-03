<script>
import { CustomMarker } from "vue3-google-map";

export default {
	name: "CarComponent",
	components: {
		CustomMarker,
	},
	props: {
		position: { type: Object, default: undefined },
		map: { type: Object, default: undefined },
	},
};
</script>

<template>
	<CustomMarker v-if="position" :options="{ position }" anchorPoint="CENTER">
		<img src="@assets/car.png" width="60" height="60" :style="{ transform: `rotate(180deg)` }" />
	</CustomMarker>
</template>

<style lang="scss" scoped></style>
