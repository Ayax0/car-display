<script>
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
				this.move(value);
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
		async move(to) {
			if (!this.map) return;
			if (!to) return;

			this.map.panTo(to), this.map.setHeading(to.track);
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
