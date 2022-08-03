<script>
import Map from "@components/map.component.vue";
import Keyboard from "@components/keyboard.component.vue";
import axios from "axios";

export default {
	name: "TestView",
	components: {
		Map,
		Keyboard,
	},
	data() {
		return {
			gps: undefined,
			from: "",
			to: "",
			from_keyboard: false,
			to_keyboard: false,
			recording: false,
		};
	},
	computed: {
		visibility() {
			if (!this.gps?.pdop) return "n/a";
			if (this.gps.pdop <= 1) return "ideal (1)";
			if (this.gps.pdop <= 2) return "excellent (2)";
			if (this.gps.pdop <= 5) return "good (3)";
			if (this.gps.pdop <= 10) return "moderate (4)";
			if (this.gps.pdop <= 20) return "fair (5)";
			if (this.gps.pdop > 20) return "poor (6)";
			return "error";
		},
		horizontalAccuracy() {
			if (!this.gps?.hdop) return "n/a";
			if (this.gps.hdop <= 1) return "ideal (1)";
			if (this.gps.hdop <= 2) return "excellent (2)";
			if (this.gps.hdop <= 5) return "good (3)";
			if (this.gps.hdop <= 10) return "moderate (4)";
			if (this.gps.hdop <= 20) return "fair (5)";
			if (this.gps.hdop > 20) return "poor (6)";
			return "error";
		},
		verticalAccuracy() {
			if (!this.gps?.vdop) return "n/a";
			if (this.gps.vdop <= 1) return "ideal (1)";
			if (this.gps.vdop <= 2) return "excellent (2)";
			if (this.gps.vdop <= 5) return "good (3)";
			if (this.gps.vdop <= 10) return "moderate (4)";
			if (this.gps.vdop <= 20) return "fair (5)";
			if (this.gps.vdop > 20) return "poor (6)";
			return "error";
		},
	},
	sockets: {
		gps(data) {
			if (data) this.gps = data;
		},
	},
	methods: {
		startRecording() {
			new Notification("test");
			axios
				.post(process.env.VUE_APP_SERVER + "/record")
				.then(() => {
					this.recording = true;
					window.alert("start recording");
				})
				.catch(() => window.alert("error recording"));
		},
		stopRecording() {
			axios
				.put(process.env.VUE_APP_SERVER + "/record")
				.then(() => {
					this.recording = false;
				})
				.catch(() => window.alert("error recording"));
		},
	},
};
</script>

<template>
	<div class="test-main">
		<template v-if="gps">
			<Map ref="map" />
			<div class="map-control">
				<input v-model="from" type="text" placeholder="From" @focus="from_keyboard = true" />
				<input v-model="to" type="text" placeholder="To" @focus="to_keyboard = true" />
				<button @click="$refs.map.route(from, to)">Submit</button>
				<div style="flex: 1" />
				<Keyboard
					v-model:value="from_keyboard"
					@key="from += $event"
					@delete="from = from.slice(0, -1)"
					@submit="$refs.map.route(from, to)"
				/>
				<Keyboard v-model:value="to_keyboard" @key="to += $event" @delete="to = to.slice(0, -1)" @submit="$refs.map.route(from, to)" />
			</div>
		</template>
		<div class="map-control">
			<div>Recording: {{ recording }}</div>
			<button @click="startRecording">Record Start</button>
			<button @click="stopRecording">Record Stop</button>
		</div>
		<table v-if="gps">
			<tr>
				<th>Beschreibung</th>
				<th>Wert</th>
			</tr>
			<tr>
				<td>Latitude</td>
				<td>{{ gps.lat || "n/a" }}</td>
			</tr>
			<tr>
				<td>Longitude</td>
				<td>{{ gps.lon || "n/a" }}</td>
			</tr>
			<tr>
				<td>Altitude</td>
				<td>{{ gps.alt }} m ü. M.</td>
			</tr>
			<tr>
				<td>Geschwindigkeit</td>
				<td>{{ gps.speed }} km/h</td>
			</tr>
			<tr>
				<td>Sichtbarkeit</td>
				<td>{{ visibility }}</td>
			</tr>
			<tr>
				<td>Horizontale Genauigkeit</td>
				<td>{{ horizontalAccuracy }}</td>
			</tr>
			<tr>
				<td>Vertikale Genauigkeit</td>
				<td>{{ verticalAccuracy }}</td>
			</tr>
			<tr>
				<td>Sateliten</td>
				<td>{{ (gps.satsVisible || 0).length || 0 }}</td>
			</tr>
			<tr>
				<td>Zeit</td>
				<td>{{ new Date(gps.time).toLocaleTimeString() }}</td>
			</tr>
		</table>
	</div>
	<div class="home-button" @click="$router.push('/')">
		<Icon icon="mdi:home" height="2.5rem" color="white" />
	</div>
</template>

<style lang="scss" scoped>
.test-main {
	padding: 1rem;
	color: #ccc;
	overflow-y: auto;
	height: calc(100% - 2rem);

	table {
		font-family: arial, sans-serif;
		border-collapse: collapse;
		width: 100%;
		margin: 1rem 0;
	}

	td,
	th {
		width: 50%;
		border: 1px solid #1b1b1b;
		text-align: left;
		padding: 8px;
	}

	tr:nth-child(even) {
		background-color: #3f3f3f;
	}
}

.home-button {
	position: absolute;
	bottom: 1rem;
	right: 1rem;
	background: $primary;
	width: 4rem;
	height: 4rem;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
}

input,
button {
	font-size: 16px;
	padding: 0.5rem;
}

.map-control {
	display: flex;
	gap: 1rem;
	padding: 1rem 0;
}
</style>
