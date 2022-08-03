<script>
import { getCenterOfBounds } from "geolib";
export default {
	name: "MovementComponent",
	props: {
		ready: { type: Boolean, default: false },
		map: { type: Object, required: true },
		position: { type: Object, required: true },
	},
	emits: ["position"],
	data() {
		return {
			interval: undefined,
			payload: [],
			fixedPosition: undefined,
			fixedDirection: undefined,
		};
	},
	watch: {
		position: {
			deep: true,
			handler(value) {
				this.payload.push(value);
			},
		},
		fixedPosition: {
			deep: true,
			handler(value) {
				this.$emit("position", value);
			},
		},
	},
	mounted() {
		this.interval = setInterval(() => {
			if (this.ready && this.payload.length > 0) {
				const _payload = [];
				while (this.payload.length > 0) _payload.push(this.payload.shift());
				const centerPosition = getCenterOfBounds(_payload.map((item) => ({ latitude: item.lat, longitude: item.lng })));
				const averageDirection =
					_payload
						.filter((item) => item.track != undefined)
						.map((item) => item.track)
						.reduce((value, current) => value + current) / _payload.filter((item) => item.track != undefined).length;

				// this.map.moveCamera({
				// 	center: { lat: centerPosition.latitude, lng: centerPosition.longitude },
				// 	heading: averageDirection,
				// });

				this.map.panTo({ lat: centerPosition.latitude, lng: centerPosition.longitude });
				this.map.setHeading(averageDirection);

				this.fixedPosition = { lat: centerPosition.latitude, lng: centerPosition.longitude };
				this.fixedDirection = averageDirection;
			}
		}, 1000);
	},
	beforeUnmount() {
		clearInterval(this.interval);
	},
};
</script>

<template>
	<div></div>
</template>

<style lang="scss" scoped></style>
