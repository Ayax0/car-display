<script>
export default {
	name: "SpinnerComponent",
	props: {
		size: {
			type: String,
			default: "50px",
		},
		color: {
			type: String,
			default: "#000",
		},
	},
	computed: {
		styles() {
			return {
				width: this.size,
				height: this.size,
				"--bg-color": this.color,
			};
		},
	},
};
</script>

<template>
	<div class="half-circle-spinner" :style="styles">
		<div class="circle circle-1"></div>
		<div class="circle circle-2"></div>
	</div>
</template>

<style lang="scss" scoped>
.half-circle-spinner,
.half-circle-spinner * {
	box-sizing: border-box;
}

.half-circle-spinner {
	width: 60px;
	height: 60px;
	border-radius: 100%;
	position: relative;
}

.half-circle-spinner .circle {
	content: "";
	position: absolute;
	width: 100%;
	height: 100%;
	border-radius: 100%;
	border: calc(60px / 10) solid transparent;
}

.half-circle-spinner .circle.circle-1 {
	border-top-color: var(--bg-color);
	animation: half-circle-spinner-animation 1s infinite;
}

.half-circle-spinner .circle.circle-2 {
	border-bottom-color: var(--bg-color);
	animation: half-circle-spinner-animation 1s infinite alternate;
}

@keyframes half-circle-spinner-animation {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
