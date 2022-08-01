<script>
import { Polyline } from "vue3-google-map";

export default {
	name: "RouteComponent",
	components: {
		Polyline,
	},
	props: {
		position: { type: Object, default: undefined },
		route: { type: Object, default: undefined },
		api: { type: Object, default: undefined },
	},
	data() {
		return {
			// position: { lat: 47.03754851396708, lng: 8.241221494119909 },
			currentIndex: -1,
			currentStep: -1,
		};
	},
	computed: {
		pastRoute() {
			if (!this.route?.overview_path) return [];
			return this.route.overview_path.slice(0, this.currentIndex + 1);
		},
		futureRoute() {
			if (!this.route?.overview_path) return [];
			return this.route.overview_path.slice(this.currentIndex);
		},
	},
	watch: {
		position: {
			immediate: true,
			handler(position) {
				if (!this.route?.overview_path) return;

				const computeDistance = this.api.geometry.spherical.computeDistanceBetween;

				if (this.currentIndex == -1) {
					let distance = Number.MAX_VALUE;
					let shortestIndex = 0;
					for (let i = 0; i < this.route.overview_path.length; i++) {
						const _distance = computeDistance(position, this.route.overview_path[i]);
						if (_distance < distance) {
							distance = _distance;
							shortestIndex = i;
						}
					}
					this.currentIndex = shortestIndex;
				} else {
					const lastWaypoint =
						this.currentIndex == 0 ? Number.MAX_VALUE : computeDistance(position, this.route.overview_path[this.currentIndex - 1]);
					const currentWaypoint = computeDistance(position, this.route.overview_path[this.currentIndex]);
					const nextWaypoint = computeDistance(position, this.route.overview_path[this.currentIndex + 1]);
					if (lastWaypoint < currentWaypoint && lastWaypoint < nextWaypoint) this.currentIndex--;
					if (nextWaypoint < lastWaypoint && nextWaypoint < currentWaypoint) this.currentIndex++;
				}

				if (!this.route?.legs[0]?.steps) return;

				if (this.currentStep == -1) {
					let distance = Number.MAX_VALUE;
					let shortestIndex = 0;
					for (let i = 0; i < this.route.legs[0].steps.length; i++) {
						const _distance = computeDistance(position, this.route.legs[0].steps[i].end_location);
						if (_distance < distance) {
							distance = _distance;
							shortestIndex = i;
						}
					}
					this.currentStep = shortestIndex;
				} else {
					const currentStepDistance = computeDistance(
						this.route.legs[0].steps[this.currentStep].start_location,
						this.route.legs[0].steps[this.currentStep].end_location
					);
					const currentDistance = computeDistance(this.route.legs[0].steps[this.currentStep].start_location, position);
					if (currentDistance > currentStepDistance) this.currentStep++;
				}
			},
		},
	},
};
</script>

<template v-if="route && api">
	<Polyline :options="{ path: pastRoute, strokeColor: '#333', strokeWeight: 8, strokeOpacity: 0.6 }" />
	<Polyline :options="{ path: futureRoute, strokeColor: '#0066ff', strokeWeight: 8, strokeOpacity: 0.8 }" />
	<div v-if="route.legs[0].steps" class="route-info" v-html="route.legs[0].steps[currentStep - 1 < 0 ? 0 : currentStep - 1].instructions"></div>
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
