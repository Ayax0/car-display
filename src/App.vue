<script>
export default {
    watch: {
        $route: {
            immediate: true,
            handler (to) {
                document.title = `Lorem - ${to.name}`
            }
        }
    }
}
</script>

<template>
	<div id="app">
		<router-view/>
	</div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
	margin: 0;
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
        &:hover {
            background: rgb(50, 50, 50);
            background-clip: padding-box;
            border: 5px solid transparent;
        }
    }
}
</style>
