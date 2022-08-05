<script>
import { computeDestinationPoint, getDistance, getRhumbLineBearing } from "geolib";
import { Marker } from "vue3-google-map";

export default {
	name: "CarComponent",
	components: {
		Marker,
	},
	props: {
		position: { type: Object, default: undefined },
		map: { type: Object, default: undefined },
	},
	computed: {
		options() {
			return {
				icon: {
					url: window.location.origin + "/car.png",
					scaledSize: { width: 50, height: 50 },
					anchor: { x: 25, y: 25 },
				},
			};
		},
	},
	watch: {
		position: {
			deep: true,
			async handler(value, oldValue) {
				if (!this.$refs.marker) return;
				if (!oldValue) return this.$refs.marker.marker.setPosition(value);
				if (!value && !oldValue) return;
				const stepAmount = 40;
				const distance = getDistance(oldValue, value, 0.01);
				const step = distance / stepAmount;
				const bearing = getRhumbLineBearing(oldValue, value);
				for (let i = 0; i < stepAmount; i++) {
					const newPosition = computeDestinationPoint(oldValue, step * (i + 1), bearing);
					this.$refs.marker.marker.setPosition({ lat: newPosition.latitude, lng: newPosition.longitude });
					await new Promise((r) => setTimeout(r, 2000 / stepAmount));
				}
				this.$refs.marker.marker.setPosition(value);
			},
		},
	},
};
</script>

<template>
	<Marker ref="marker" :options="options" />
</template>

<style lang="scss" scoped></style>
