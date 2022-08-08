<!-- eslint-disable vue/attribute-hyphenation -->
<script>
import { GoogleMap } from "vue3-google-map";
import Movement from "@components/movement.component.vue";
import Spinner from "@components/spinner.component.vue";

export default {
	name: "MapComponent",
	components: {
		GoogleMap,
		Movement,
		Spinner,
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
		};
	},
	sockets: {
		gps(data) {
			if (data.lat != undefined) this.gps.lat = data.lat;
			if (data.lon != undefined) this.gps.lng = data.lon;
			if (data.hdop != undefined) this.gps.hdop = data.hdop;
			if (data.pdop != undefined) this.gps.pdop = data.pdop;
			if (data.vdop != undefined) this.gps.vdop = data.vdop;
			if (data.alt != undefined) this.gps.alt = data.alt;
			if (data.speed != undefined) this.gps.speed = data.speed;
			if (data.track != undefined) {
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
		v-if="gps.lat && gps.lng"
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
			<Movement v-if="ready" ref="movement" :ready="ready" :api="api" :position="gps" :map="map" />
		</template>
	</GoogleMap>
	<div v-else class="map-empty">
		<Spinner color="white" style="margin-bottom: 2rem" />
		<div>GPS-Position wird gesucht</div>
		<div>{{ gps.satsVisible }} Sateliten</div>
	</div>
</template>

<style lang="scss" scoped>
.map {
	position: relative;
}

.map-empty {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	color: white;
	font-weight: 100;

	*:last-child {
		margin-bottom: 6rem;
		font-size: 14px;
	}
}
</style>
