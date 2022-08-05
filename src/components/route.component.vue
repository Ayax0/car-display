<script>
import { Polyline } from "vue3-google-map";
import { getDistance } from "geolib";

function parsePosition(position) {
	return { lat: position.lat() || position.lat, lng: position.lng() || position.lng };
}

export default {
	name: "RouteComponent",
	components: {
		Polyline,
	},
	props: {
		position: { type: Object, default: undefined },
		route: { type: Object, default: undefined },
	},
	emits: ["path"],
	data() {
		return {
			// position: { lat: 47.03754851396708, lng: 8.241221494119909 },
			currentIndex: -1,
			currentStep: -1,
		};
	},
	computed: {
		fullRoute() {
			return this.route.legs[0].steps.map((step) => step.lat_lngs).reduce((value, current) => value.concat(current), []);
		},
		pastRoute() {
			if (!this.route?.overview_path) return [];
			return this.fullRoute.slice(0, this.currentIndex + 1);
		},
		futureRoute() {
			if (!this.route?.overview_path) return [];
			return this.fullRoute.slice(this.currentIndex);
		},
	},
	watch: {
		position: {
			immediate: true,
			deep: true,
			handler(position) {
				if (!this.route?.overview_path) return;

				if (this.currentIndex == -1) {
					let distance = Number.MAX_VALUE;
					let shortestIndex = 0;
					for (let i = 0; i < this.fullRoute.length; i++) {
						const _distance = getDistance(position, parsePosition(this.fullRoute[i]));
						if (_distance < distance) {
							distance = _distance;
							shortestIndex = i;
						}
					}
					this.currentIndex = shortestIndex;
				} else {
					const lastWaypoint =
						this.currentIndex == 0 ? Number.MAX_VALUE : getDistance(position, parsePosition(this.fullRoute[this.currentIndex - 1]));
					const currentWaypoint = getDistance(position, parsePosition(this.fullRoute[this.currentIndex]));
					const nextWaypoint =
						this.fullRoute.length <= this.currentIndex
							? Number.MAX_VALUE
							: getDistance(position, parsePosition(this.fullRoute[this.currentIndex + 1]));
					if (lastWaypoint < currentWaypoint && lastWaypoint < nextWaypoint) this.currentIndex--;
					if (nextWaypoint < lastWaypoint && nextWaypoint < currentWaypoint) this.currentIndex++;
				}

				if (!this.route?.legs[0]?.steps) return;

				if (this.currentStep == -1) {
					let distance = Number.MAX_VALUE;
					let shortestIndex = 0;
					for (let i = 0; i < this.route.legs[0].steps.length; i++) {
						const _distance = getDistance(position, parsePosition(this.route.legs[0].steps[i].end_location));
						if (_distance < distance) {
							distance = _distance;
							shortestIndex = i;
						}
					}
					this.currentStep = shortestIndex;
				} else {
					if (this.currentStep > this.route.legs[0].steps.length) return;
					const currentStepDistance = getDistance(
						parsePosition(this.route.legs[0].steps[this.currentStep].start_location),
						parsePosition(this.route.legs[0].steps[this.currentStep].end_location)
					);
					const currentDistance = getDistance(parsePosition(this.route.legs[0].steps[this.currentStep].start_location), position);
					console.log(currentDistance, currentStepDistance);
					if (currentDistance > currentStepDistance) this.currentStep++;
				}
			},
		},
		currentIndex: {
			handler(value) {
				this.$emit("path", { from: this.fullRoute[value], to: this.fullRoute[value + 1] });
			},
		},
		currentStep: {
			immediate: true,
			handler(value) {
				console.log("CurrentStep:", value);
			},
		},
	},
};
</script>

<template v-if="route">
	<Polyline v-if="pastRoute.length > 0" :options="{ path: pastRoute, strokeColor: '#333', strokeWeight: 8, strokeOpacity: 0.6 }" />
	<Polyline v-if="futureRoute.length > 0" :options="{ path: futureRoute, strokeColor: '#0066ff', strokeWeight: 8, strokeOpacity: 0.8 }" />
	<div v-if="route.legs[0].steps" class="route-info" v-html="route.legs[0].steps[currentStep + 1].instructions"></div>
</template>

<style lang="scss" scoped>
.route-info {
	position: absolute;
	top: 1rem;
	right: 1rem;
	background: #0066ff;
	color: white;
	padding: 1rem;
	width: 30%;
	font-size: 24px;
	box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	border-radius: 1rem;
}
</style>
