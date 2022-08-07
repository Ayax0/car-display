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
		color: { type: String, default: "#0066ff" },
	},
	emits: ["path"],
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
			if (this.currentStep + 1 == this.route?.legs[0]?.steps.length) return "Ziel erreicht";
			return this.route?.legs[0]?.steps[this.currentStep + 1]?.instructions;
		},
		currentIndex: {
			get() {
				return this.$store.state.currentIndex;
			},
			set(value) {
				this.$store.commit("setCurrentIndex", value);
			},
		},
		currentStep: {
			get() {
				return this.$store.state.currentStep;
			},
			set(value) {
				this.$store.commit("setCurrentStep", value);
			},
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
		route: {
			immediate: true,
			handler() {
				this.currentIndex = 0;
				this.currentStep = 0;
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

<template>
	<Polyline v-if="pastRoute.length > 0" :options="{ path: pastRoute, strokeColor: '#333', strokeWeight: 8, strokeOpacity: 0.6 }" />
	<Polyline v-if="futureRoute.length > 0" :options="{ path: futureRoute, strokeColor: color, strokeWeight: 8, strokeOpacity: 0.8 }" />
	<div v-if="currentStepInstructions" class="info-wrapper" :style="{ background: color, border: '2px solid ' + color }">
		<div class="route-info" v-html="currentStepInstructions"></div>
	</div>
</template>

<style lang="scss" scoped>
.info-wrapper {
	position: absolute;
	top: 1rem;
	right: 1rem;
	width: 30%;
	box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
	border-radius: 1rem;
	transition: background-color 0.5s ease-in-out;

	.route-info {
		color: white;
		padding: 1rem;
		font-size: 24px;
		border-radius: 1rem;
		background: linear-gradient(-45deg, rgba(20, 20, 20, 0.4) 30%, rgba(20, 20, 20, 0.6) 100%);
		backdrop-filter: brightness(90%) saturate(120%) contrast(120%);
	}
}
</style>
