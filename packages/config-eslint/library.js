const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
	extends: [
		"@vercel/style-guide/eslint/node",
		"@vercel/style-guide/eslint/typescript",
		"@vercel/style-guide/eslint/browser",
		"@vercel/style-guide/eslint/react",
		"@vercel/style-guide/eslint/next",
		"eslint-config-turbo",
	].map(require.resolve),
	plugins: [
		"eslint-plugin-tsdoc",
		"@typescript-eslint",
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project,
	},
	globals: {
		React: true,
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
	ignorePatterns: ["node_modules/", "dist/"],
	rules: {
		"import/no-default-export": 0,
		"no-console": "warn",
		"no-unsafe-unassignment": 0,
		"tsdoc/syntax": "warn",
		"@typescript-eslint/no-unsafe-argument": 0,
		"@typescript-eslint/no-explicit-any": 0,
		"@typescript-eslint/no-floating-promises": 0,
	},
};
