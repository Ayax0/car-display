<script>
import Route from "@components/route.component.vue";

export default {
	name: "RouterComponent",
	components: {
		Route,
	},
	props: {
		position: { type: Object, default: undefined },
		ready: { type: Boolean, default: false },
		api: { type: Object, default: undefined },
		map: { type: Object, default: undefined },
	},
	data() {
		return {
			routes: [],
		};
	},
	// watch: {
	// 	ready(value, previous) {
	// 		if (!previous && value && this.api) {
	// 			const TrafficLayer = this.api.TrafficLayer;
	// 			const trafficLayer = new TrafficLayer();
	// 			trafficLayer.setMap(this.map);
	// 		}
	// 	},
	// },
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
					this.routes = result.routes;
					console.log(result.routes);
				}
			);
		},
	},
};
</script>

<template>
	<Route v-for="(path, index) in routes" :key="index" :position="position" :route="path" />
</template>

<style lang="scss" scoped></style>
