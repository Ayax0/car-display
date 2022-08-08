<script>
import { Polyline, CustomMarker } from "vue3-google-map";
import { getDistance, getDistanceFromLine } from "geolib";

function parsePosition(position) {
	return { lat: position.lat() || position.lat, lng: position.lng() || position.lng };
}

export default {
	name: "RouteComponent",
	components: {
		Polyline,
		CustomMarker,
	},
	props: {
		position: { type: Object, default: undefined },
		heading: { type: Number, default: 0 },
		route: { type: Object, default: undefined },
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
		steps() {
			return this.route?.legs[0]?.steps || [];
		},
		currentStepInstructions() {
			if (this.currentStep + 1 == this.steps.length) return "Ziel erreicht";
			return this.steps[this.currentStep + 1]?.instructions?.replaceAll("<b>", '<b style="font-size: 20px">');
		},
		currentStepIcon() {
			if (this.currentStep + 1 == this.steps.length) return "sports_score";
			const step = this.steps[this.currentStep + 1];
			return this.convertManeuver(step.maneuver);
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
				this.fullRoute.length <= this.currentIndex + 1
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
		convertManeuver(maneuver) {
			if (maneuver == "") return "straight";
			if (maneuver == "ferry") return "directions_boat";
			if (maneuver == "roundabout-right") return "roundabout_left";
			return maneuver.replaceAll("-", "_");
		},
	},
};
</script>

<template>
	<Polyline v-if="pastRoute.length > 0" :options="{ path: pastRoute, strokeColor: '#333', strokeWeight: 8, strokeOpacity: 0.6 }" />
	<Polyline v-if="futureRoute.length > 0" :options="{ path: futureRoute, strokeColor: '#940700', strokeWeight: 8, strokeOpacity: 0.8 }" />
	<CustomMarker v-for="(step, index) of steps" :key="index" :options="{ position: step.start_location }">
		<span class="material-icons" style="color: white">{{ convertManeuver(step.maneuver) }}</span>
	</CustomMarker>
	<div v-if="currentStepInstructions" class="route-info">
		<span class="material-icons">{{ currentStepIcon }}</span>
		<div class="info" v-html="currentStepInstructions" />
	</div>
</template>

<style lang="scss" scoped>
.route-info {
	position: absolute;
	top: 1rem;
	right: 1rem;
	width: 30%;
	color: white;
	padding: 1rem;
	display: flex;
	gap: 1rem;
	background: linear-gradient(-45deg, rgba(40, 40, 40, 0.7) 30%, rgba(40, 40, 40, 0.9) 100%);
	border-radius: 1rem;
	box-shadow: $shadow;

	span {
		font-size: 40px;
	}

	.info {
		font-size: 16px;
		font-weight: 100;
	}
}
</style>
