<script>
import { computeDestinationPoint, getCenterOfBounds, getDistance, getRhumbLineBearing } from "geolib";

import Route from "@components/route.component.vue";

export default {
	name: "MovementComponent",
	components: {
		Route,
	},
	props: {
		ready: { type: Boolean, default: false },
		api: { type: Object, default: undefined },
		map: { type: Object, default: undefined },
		position: { type: Object, default: undefined },
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
		currentRoutes: {
			get() {
				return this.$store.state.route;
			},
			set(value) {
				this.$store.commit("setRoute", value);
			},
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
	},
	mounted() {
		this.map.panTo(this.position);
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

				this.move(this.fixedPosition, this.fixedDirection, { lat: centerPosition.latitude, lng: centerPosition.longitude }, averageDirection);

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
			const DirectionsService = this.api.DirectionsService;
			const Status = this.api.DirectionsStatus;
			const TravelMode = this.api.DirectionsTravelMode;
			const UnitSystem = this.api.DirectionsUnitSystem;
			new DirectionsService().route(
				{
					origin: from,
					destination: to,
					travelMode: TravelMode.DRIVING,
					unitSystem: UnitSystem.METRIC,
					region: "CH",
				},
				(result, status) => {
					if (status != Status.OK) return console.warn("routing error");
					this.currentRoutes = result.routes;
					console.log(result);
				}
			);
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
			if (this.position.speed > 70) this.map.setZoom(16);
			else this.map.setZoom(18);
		},
	},
};
</script>

<template>
	<img src="@assets/car2.png" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)" width="40" height="40" />
	<template v-if="fixedPosition && currentRoutes">
		<Route
			v-for="(currentRoute, index) of currentRoutes"
			:key="index"
			:position="fixedPosition"
			:heading="fixedDirection"
			:route="currentRoute"
			@path="path = $event"
		/>
	</template>
	<div class="speed">
		{{ Math.round(position?.speed || 0) }}
		<span>km/h</span>
	</div>
</template>

<style lang="scss" scoped>
.speed {
	position: absolute;
	bottom: calc(7rem + 10px);
	right: 1rem;
	width: 4rem;
	height: 4rem;
	border-radius: 2.5rem;
	background: $background;
	border: 2px solid $border;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: white;
	font-size: 20px;
	box-shadow: $shadow;

	span {
		font-size: 12px;
	}
}
</style>
