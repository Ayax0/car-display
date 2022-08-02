<!-- eslint-disable vue/attribute-hyphenation -->
<script>
import { GoogleMap } from "vue3-google-map";
import Router from "@components/router.component.vue";
import Car from "@components/car.component.vue";
import Control from "@components/control.component.vue";

export default {
	name: "MapComponent",
	components: {
		GoogleMap,
		Router,
		Car,
		Control,
	},
	data() {
		return {
			gps: undefined,
			center: { lat: 0, lng: 0 },
			heading: 0,
			follow: true,
		};
	},
	computed: {
		position() {
			if (!this.gps) return { lat: 0, lng: 0 };
			return { lat: this.gps.lat, lng: this.gps.lon };
		},
	},
	sockets: {
		gps(data) {
			if (data) this.gps = data;
		},
	},
	watch: {
		gps(value, previous) {
			if ((!previous && value) || this.follow) {
				this.center = { lat: value.lat, lng: value.lon };
			}
		},
		follow(value, previous) {
			if (!previous && value) {
				this.center = { lat: this.gps.lat, lng: this.gps.lon };
			}
		},
	},
	methods: {
		route(from, to) {
			if (to == undefined) return;
			this.$refs.router.route(from || { lat: this.gps.lat, lng: this.gps.lon }, to);
		},
	},
};
</script>

<template>
	<GoogleMap
		class="map"
		:api-key="$store.state.variables.google_api"
		:center="center"
		:zoom="18"
		:tilt="45"
		:heading="heading"
		:disableDefaultUi="true"
		gestureHandling="cooperative"
		mapId="9a664a373c810533"
		language="de"
		style="width: 100%; height: calc(100vh - 2rem)"
	>
		<template #default="{ ready, api, map }">
			<Control :ready="ready" :map="map" :follow="follow" @follow="follow = $event" />
			<Car :position="position" :map="map" @heading="heading = $event" />
			<Router ref="router" :position="position" :ready="ready" :api="api" :map="map" />
		</template>
	</GoogleMap>
</template>

<style lang="scss" scoped>
.map {
	position: relative;
}
</style>
