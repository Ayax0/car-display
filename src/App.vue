<script>
import { mapActions } from "vuex";

export default {
	watch: {
		$route: {
			immediate: true,
			handler(to) {
				document.title = `Lorem - ${to.name}`;
			},
		},
	},
	created() {
		this.init();
	},
	methods: {
		...mapActions(["init"]),
	},
};
</script>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
	font-family: "CircularStd", Helvetica, Arial, sans-serif;
	// font-family: "CircularStd";
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	height: 100vh;
	width: 100vw;
	background: rgb(22, 22, 22);
	background: linear-gradient(0deg, rgba(22, 22, 22, 1) 0%, rgba(48, 48, 48, 1) 100%);
	overflow: hidden;
}

body {
	margin: 0;
}

html, body {
  overscroll-behavior-x: none;
}

* {
	&::-webkit-scrollbar {
		width: 15px;
	}
	&::-webkit-scrollbar-track {
		background: transparent;
	}
	&::-webkit-scrollbar-thumb {
		background: rgb(40, 40, 40);
		background-clip: padding-box;
		border: 5px solid transparent;
		border-radius: 8px;
		&:hover {
			background: rgb(50, 50, 50);
			background-clip: padding-box;
			border: 5px solid transparent;
		}
	}
}

.spacer {
	flex: 1;
}
</style>
