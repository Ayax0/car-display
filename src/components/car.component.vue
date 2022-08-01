<script>
import { CustomMarker } from "vue3-google-map";

export default {
	name: "CarComponent",
	components: {
		CustomMarker,
	},
	props: {
		position: { type: Object, default: undefined },
		api: { type: Object, default: undefined },
		map: { type: Object, default: undefined },
	},
	emits: ["heading"],
	data() {
		return {
			heading: 0,
		};
	},
	watch: {
		position: {
			deep: true,
			handler(value, previous) {
				if (!this.api || !this.map) return;
				const computeDistance = this.api.geometry.spherical.computeDistanceBetween;
				const computeHeading = this.api.geometry.spherical.computeHeading;
				const distance = computeDistance(previous, value);
				if (distance <= 0.5) return;
				const heading = computeHeading(previous, value);
				this.heading = heading;
				this.$emit("heading", heading);
			},
		},
	},
};
</script>

<template>
	<CustomMarker v-if="position" :options="{ position }" anchorPoint="CENTER">
		<img src="@assets/car.png" width="60" height="60" :style="{ transform: `rotate(180deg)` }" />
	</CustomMarker>
</template>

<style lang="scss" scoped></style>
