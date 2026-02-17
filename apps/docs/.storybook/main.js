import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
  stories: ["../stories/*.stories.tsx", "../stories/**/*.stories.tsx"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  async viteFinal(config) {
    config.plugins = [...(config.plugins || []), tailwindcss()];
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: [
          ...(Array.isArray(config.resolve?.alias) ? config.resolve.alias : []),
          {
            find: /^@olli\/ui$/,
            replacement: path.resolve(__dirname, "../../../packages/olli/src/index.ts"),
          },
        ],
      },
      define: { "process.env": {} },
    };
  },

  docs: {
    autodocs: true,
  },
};

export default config;
