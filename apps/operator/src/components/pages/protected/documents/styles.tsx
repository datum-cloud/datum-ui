import {
  StyleContext,
  vanillaRenderers
} from "@jsonforms/vanilla-renderers";

import { SelectControl, SelectTester } from "./select";
import { Group, groupTester } from "./group";

export const renderers = [
  ...vanillaRenderers,
  //register custom renderers
  { tester: SelectTester, renderer: SelectControl },
  { tester: groupTester, renderer: Group }
];

// TODO (hannah): update the styling to match the branding
export const styleContextValue: StyleContext = {
  styles: [
    {
      name: "control",
      classNames: ["my-5"]
    },
    {
      name: "control.input",
      classNames:
        ["w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out font-sans"]
    },
    {
      name: "control.select",
      classNames:
        ["w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out appearance-none"]
    },
    {
      name: "control.label",
      classNames:
        ["block uppercase tracking-wide text-gray-700 text-xs font-bold pb-4"]
    },
    {
      name: "array.button",
      classNames: ["custom-array-button"]
    },
    {
      name: "control.validation",
      classNames: ["text-red-500 font-normal mt-2 text-xs"]
    },
    {
      name: "vertical.layout",
      classNames:
        ["block uppercase tracking-wide text-gray-700 text-s font-bold mb-2"]
    },
    {
      name: "group.layout",
      classNames: ["accordion-item bg-white"]
    },
    {
      name: "group.label",
      classNames:
        ["accordion-button relative flex w-full py-4 transition focus:outline-none block uppercase tracking-wide text-gray-700 text-s font-bold pb-4"]
    }
  ]
};