const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
	extends: [
		"@vercel/style-guide/eslint/typescript",
		"@vercel/style-guide/eslint/browser",
		"@vercel/style-guide/eslint/react",
	].map(require.resolve),
	plugins: [
		"eslint-plugin-tsdoc",
	],
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
		"import/no-default-export": 0,
		"no-console": 1,
		"@typescript-eslint/no-unsafe-assignment": 0,
		"@typescript-eslint/no-unsafe-unassignment": 0,
		"@typescript-eslint/no-unsafe-member-access": 0,
		"@typescript-eslint/no-unsafe-return": 0,
		"@typescript-eslint/no-unsafe-call": 0,
		"no-alert": 1,
		"tsdoc/syntax": 0,
		"@typescript-eslint/no-confusing-void-expression": 0,
		"react/function-component-definition": ["off", {
			namedComponents: "arrow-function",
			unnamedComponents: "arrow-function",
		}],
		"@typescript-eslint/no-unsafe-argument": 0,
		"@typescript-eslint/no-explicit-any": 0,
		"@typescript-eslint/no-floating-promises": 0,
		"@typescript-eslint/explicit-function-return-type": 0
	},
};
