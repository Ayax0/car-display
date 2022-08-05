<script>
import { computeDestinationPoint, getCenterOfBounds, getDistance, getRhumbLineBearing } from "geolib";

import Router from "@components/router.component.vue";
import Car from "@components/car.component.vue";

export default {
	name: "MovementComponent",
	components: {
		Router,
		Car,
	},
	props: {
		ready: { type: Boolean, default: false },
		api: { type: Object, default: undefined },
		map: { type: Object, default: undefined },
		position: { type: Object, default: undefined },
		follow: { type: Boolean, default: true },
	},
	emits: ["position"],
	data() {
		return {
			interval: undefined,
			payload: [],
			fixedPosition: undefined,
			fixedDirection: undefined,
			path: undefined,
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
		follow: {
			handler(value, previous) {
				if (!previous && value) this.map.panTo(this.fixedPosition);
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

				if (this.path) {
					console.log("path:", this.path);
					// const distance = getDistance()
				}

				if (this.follow)
					this.move(
						this.fixedPosition,
						this.fixedDirection,
						{ lat: centerPosition.latitude, lng: centerPosition.longitude },
						averageDirection
					);

				this.fixedPosition = { lat: centerPosition.latitude, lng: centerPosition.longitude };
				this.fixedDirection = averageDirection;
			}
		}, 2000);
	},
	beforeUnmount() {
		clearInterval(this.interval);
	},
	methods: {
		route(from, to) {
			this.$refs.router.route(from, to);
		},
		async move(from, fromHeading, to, toHeading) {
			if (!this.map) return;
			if (!from && !to) return;
			if (!from) return this.map.panTo(to);
			if (!fromHeading) return this.map.setHeading(toHeading);
			const stepAmount = 40;
			const distance = getDistance(from, to, 0.01);
			const headingDistance = toHeading - fromHeading;
			const step = distance / stepAmount;
			const headingStep = headingDistance / stepAmount;
			const bearing = getRhumbLineBearing(from, to);
			for (let i = 0; i < stepAmount; i++) {
				const newPosition = computeDestinationPoint(from, step * (i + 1), bearing);
				this.map.panTo({ lat: newPosition.latitude, lng: newPosition.longitude });
				this.map.setHeading(fromHeading + (i + 1) * headingStep);
				await new Promise((r) => setTimeout(r, 2000 / stepAmount));
			}
			this.map.panTo(to), this.map.setHeading(toHeading);
		},
	},
};
</script>

<template>
	<Car :ready="ready" :position="fixedPosition" :map="map" />
	<Router ref="router" :ready="ready" :position="fixedPosition" :map="map" :api="api" @path="path = $event" />
</template>

<style lang="scss" scoped></style>
