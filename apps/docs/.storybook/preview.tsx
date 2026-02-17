import type { Preview } from "@storybook/react";
import "../stories/styles.css";

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className="theme-alpha">
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
