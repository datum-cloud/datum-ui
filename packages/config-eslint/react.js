const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
	extends: [
		"@vercel/style-guide/eslint/browser",
		"@vercel/style-guide/eslint/typescript",
		"@vercel/style-guide/eslint/react",
	].map(require.resolve),
	parserOptions: {
		project,
	},
	globals: {
		JSX: true,
	},
	settings: {
		"import/resolver": {
			typescript: {
				project,
			},
			node: {
				extensions: [".mjs", ".js", ".jsx", ".ts", ".tsx"],
			},
		},
	},
	ignorePatterns: ["node_modules/", "dist/", ".eslintrc.js", "**/*.css"],
	// add rules configurations here
	rules: {
		"import/no-default-export": "off",
		"no-console": 1,
		"no-alert": 1,
		"@typescript-eslint/no-confusing-void-expression": 0,
		"react/function-component-definition": ["off", {
			namedComponents: "arrow-function",
			unnamedComponents: "arrow-function",
		}],
	},
};
