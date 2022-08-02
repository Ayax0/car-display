module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: ["plugin:vue/vue3-recommended", "eslint:recommended", "prettier"],
	parserOptions: {
		parser: "@babel/eslint-parser",
	},
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		"vue/attribute-hyphenation": "off",
		"vue/v-on-event-hyphenation": "off",
		"vue/no-v-html": "off",
		// "vue/html-self-closing": [
		// 	"error",
		// 	{
		// 		html: {
		// 			void: "always",
		// 			normal: "always",
		// 			component: "always",
		// 		},
		// 		svg: "always",
		// 		math: "always",
		// 	},
		// ],
		// "vue/max-attributes-per-line": [
		// 	"error",
		// 	{
		// 		singleline: {
		// 			max: 10,
		// 		},
		// 		multiline: {
		// 			max: 10,
		// 		},
		// 	},
		// ],
		// "vue/html-indent": [
		// 	"error",
		// 	"tab",
		// 	{
		// 		attribute: 1,
		// 		baseIndent: 1,
		// 		closeBracket: 0,
		// 		alignAttributesVertically: true,
		// 		ignores: [],
		// 	},
		// ],
	},
};
