<script>
import { CustomMarker } from "vue3-google-map";
import { getDistance, getRhumbLineBearing } from "geolib";

export default {
	name: "CarComponent",
	components: {
		CustomMarker,
	},
	props: {
		position: { type: Object, default: undefined },
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
				if (this.map == undefined) return;
				const distance = getDistance(previous, value, 0.5);
				console.log(distance);
				if (distance <= 0) return;
				const heading = getRhumbLineBearing(previous, value);
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
