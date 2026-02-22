import type { Preview } from "@storybook/react";
import { useEffect } from "react";
import "../stories/styles.css";

const preview: Preview = {
  decorators: [
    (Story) => {
      useEffect(() => {
        document.documentElement.classList.add("theme-alpha");
        return () => {
          document.documentElement.classList.remove("theme-alpha");
        };
      }, []);
      return <Story />;
    },
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
