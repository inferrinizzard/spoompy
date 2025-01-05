import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		globals: true,
		cache: {
			dir: "./node_modules/.vitest",
		},
		environment: "jsdom",
		include: ["src/**/*.test.{js,mjs,cjs,ts,mts,cts}"],
		typecheck: { tsconfig: "./tsconfig.test.json" },
	},
});
