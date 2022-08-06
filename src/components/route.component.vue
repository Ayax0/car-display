<script>
import { Polyline } from "vue3-google-map";
import { getDistance, getDistanceFromLine } from "geolib";

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
			currentIndex: 0,
			currentStep: 0,
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
		currentStepInstructions() {
			return this.route?.legs[0]?.steps[this.currentStep + 1]?.instructions;
		},
	},
	watch: {
		position: {
			immediate: true,
			deep: true,
			handler() {
				this.updateIndex();
				this.updateStep();
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
	methods: {
		updateIndex() {
			const lastWaypoint =
				this.currentIndex == 0 ? Number.MAX_VALUE : getDistance(this.position, parsePosition(this.fullRoute[this.currentIndex - 1]));
			const currentWaypoint = getDistance(this.position, parsePosition(this.fullRoute[this.currentIndex]));
			const nextWaypoint =
				this.fullRoute.length <= this.currentIndex
					? Number.MAX_VALUE
					: getDistance(this.position, parsePosition(this.fullRoute[this.currentIndex + 1]));

			console.log(lastWaypoint, currentWaypoint, nextWaypoint);
			if (nextWaypoint <= lastWaypoint && nextWaypoint <= currentWaypoint) {
				this.currentIndex++;
				this.updateIndex();
			} else if (lastWaypoint < currentWaypoint && lastWaypoint < nextWaypoint) {
				this.currentIndex--;
				this.updateIndex();
			}
		},
		updateStep() {
			const lastStep = this.route.legs[0].steps[this.currentStep - 1];
			const lastStepDistance =
				lastStep == undefined
					? Number.MAX_VALUE
					: getDistanceFromLine(this.position, parsePosition(lastStep.start_location), parsePosition(lastStep.end_location));

			const currentStep = this.route.legs[0].steps[this.currentStep];
			const currentStepDistance =
				currentStep == undefined
					? Number.MAX_VALUE
					: getDistanceFromLine(this.position, parsePosition(currentStep.start_location), parsePosition(currentStep.end_location));

			const nextStep = this.route.legs[0].steps[this.currentStep + 1];
			const nextStepDistance =
				nextStep == undefined
					? Number.MAX_VALUE
					: getDistanceFromLine(this.position, parsePosition(nextStep.start_location), parsePosition(nextStep.end_location));

			if (nextStepDistance < lastStepDistance && nextStepDistance < currentStepDistance) {
				this.currentStep++;
				this.updateStep();
			} else if (lastStepDistance < currentStepDistance && lastStepDistance < nextStepDistance) {
				this.currentStep--;
				this.updateStep();
			}
		},
	},
};
</script>

<template v-if="route">
	<Polyline v-if="pastRoute.length > 0" :options="{ path: pastRoute, strokeColor: '#333', strokeWeight: 8, strokeOpacity: 0.6 }" />
	<Polyline v-if="futureRoute.length > 0" :options="{ path: futureRoute, strokeColor: '#0066ff', strokeWeight: 8, strokeOpacity: 0.8 }" />
	<div v-if="currentStepInstructions" class="route-info" v-html="currentStepInstructions"></div>
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
