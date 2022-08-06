<!-- eslint-disable vue/attribute-hyphenation -->
<script>
import { GoogleMap } from "vue3-google-map";
import Control from "@components/control.component.vue";
import Movement from "@components/movement.component.vue";

export default {
	name: "MapComponent",
	components: {
		GoogleMap,
		Control,
		Movement,
	},
	data() {
		return {
			gps: {
				lat: undefined,
				lng: undefined,
				hdop: undefined,
				pdop: undefined,
				vdop: undefined,
				alt: undefined,
				speed: undefined,
				track: undefined,
				satsVisible: 0,
			},
			follow: true,
		};
	},
	sockets: {
		gps(data) {
			if (data.lat) this.gps.lat = data.lat;
			if (data.lon) this.gps.lng = data.lon;
			if (data.hdop) this.gps.hdop = data.hdop;
			if (data.pdop) this.gps.pdop = data.pdop;
			if (data.vdop) this.gps.vdop = data.vdop;
			if (data.alt) this.gps.alt = data.alt;
			if (data.speed) this.gps.speed = data.speed;
			if (data.track) {
				const _track = data.track - 180;
				if (_track == 0) this.gps.track = 180;
				if (_track < 0) this.gps.track = _track + 180;
				if (_track > 0) this.gps.track = _track - 180;
			}
			if (data.satsVisible) this.gps.satsVisible = data.satsVisible.length || 0;
		},
	},
	methods: {
		route(to) {
			if (to == undefined) return;
			this.$refs.movement.route({ lat: this.gps.lat, lng: this.gps.lng }, to);
		},
	},
};
</script>

<template>
	<GoogleMap
		class="map"
		:api-key="$store.state.variables.google_api"
		:zoom="18"
		:tilt="60"
		:disableDefaultUi="true"
		:draggable="false"
		gestureHandling="cooperative"
		mapId="9a664a373c810533"
		language="de"
		style="width: 100%; height: calc(100vh - 2rem)"
	>
		<template #default="{ ready, api, map }">
			<Movement ref="movement" :ready="ready" :api="api" :position="gps" :map="map" :follow="follow" />
			<Control :ready="ready" :map="map" :position="gps" :follow="follow" @follow="follow = $event" />
		</template>
	</GoogleMap>
</template>

<style lang="scss" scoped>
.map {
	position: relative;
}
</style>
