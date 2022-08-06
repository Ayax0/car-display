<script>
import { computeDestinationPoint, getCenterOfBounds, getDistance, getRhumbLineBearing } from "geolib";

import Router from "@components/router.component.vue";

export default {
	name: "MovementComponent",
	components: {
		Router,
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
				let centerPosition = getCenterOfBounds(_payload.map((item) => ({ latitude: item.lat, longitude: item.lng })));
				let averageDirection =
					_payload
						.filter((item) => item.track != undefined)
						.map((item) => item.track)
						.reduce((value, current) => value + current) / _payload.filter((item) => item.track != undefined).length;

				// if (this.path) {
				// 	const startDistance = getDistance(parsePosition(this.path.from), centerPosition, 0.1);
				// 	const pathDirection = getRhumbLineBearing(parsePosition(this.path.from), parsePosition(this.path.to));
				// 	const predictedPosition = computeDestinationPoint(parsePosition(this.path.from), startDistance, pathDirection);
				// 	console.log(
				// 		getDistance(centerPosition, predictedPosition),
				// 		getDistanceFromLine(centerPosition, parsePosition(this.path.from), parsePosition(this.path.to), 0.1)
				// 	);
				// 	if (getDistanceFromLine(centerPosition, parsePosition(this.path.from), parsePosition(this.path.to), 0.1) < 50)
				// 		centerPosition = predictedPosition;
				// }

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
			const stepAmount = 30;
			const distance = getDistance(from, to, 0.01);
			let headingDistance = toHeading - fromHeading;
			// if(headingDistance >= 180 || headingDistance <= -180) {

			// }

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
	<img src="@assets/car.png" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)" width="50" height="50" />
	<Router ref="router" :ready="ready" :position="fixedPosition" :map="map" :api="api" @path="path = $event" />
</template>

<style lang="scss" scoped></style>
