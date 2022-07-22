const path = require("path");

module.exports = {
	transpileDependencies: ["vuetify"],
	configureWebpack: {
		resolve: {
			alias: {
				"@src": path.resolve(__dirname, "src"),
				"@router": path.resolve(__dirname, "src/router"),
				"@layouts": path.resolve(__dirname, "src/router/layouts"),
				"@views": path.resolve(__dirname, "src/router/views"),
				"@components": path.resolve(__dirname, "src/components"),
				"@assets": path.resolve(__dirname, "src/assets"),
				"@mixins": path.resolve(__dirname, "src/mixins"),
				"@stores": path.resolve(__dirname, "src/stores"),
			},
		},
	},
	pwa: {
		name: "CarRadio",
		themeColor: "#4DBA87",
		msTileColor: "#000000",
		appleMobileWebAppCapable: "yes",
		appleMobileWebAppStatusBarStyle: "black",
	},
	css: {
		loaderOptions: {
			sass: {
				additionalData: `
					@import "@src/scss/variables.scss";
				`,
			},
		},
	},
};
