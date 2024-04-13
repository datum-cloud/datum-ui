import React from "react";
import {
  GroupLayout,
  RankedTester,
  rankWith,
  RendererProps,
  uiTypeIs
} from "@jsonforms/core";
import { withJsonFormsLayoutProps } from "@jsonforms/react";
import { VanillaRendererProps } from "@jsonforms/vanilla-renderers";
import { withVanillaControlProps } from "@jsonforms/vanilla-renderers";

export const GroupLayoutRenderer: React.FC<
  RendererProps & VanillaRendererProps
> = ({
  schema,
  uischema,
  path,
  visible,
  getStyle,
  getStyleAsClassName
}: RendererProps & VanillaRendererProps) => {
    const [active, setActive] = React.useState(false);
    const [height, setHeight] = React.useState("0px");

    const contentSpace = React.useRef(null);

    function toggleAccordion() {
      setActive(active === false ? true : false);
      // @ts-ignore
      setHeight(active ? "0px" : `${contentSpace.current.scrollHeight}px`);
    }

    const group = uischema as GroupLayout;
    const elementsSize = group.elements ? group.elements.length : 0;
    const childClassNames = ["group-layout-item"]
      .concat(getStyle?.("group.layout.item", elementsSize) || [])
      .join(" ");

    return (
      <div className="accordion">
        <div className={getStyleAsClassName?.("group.layout")}>
          <h2 className="accordion-header mb-0" id="headingOne">
            <button
              className={getStyleAsClassName?.("group.label")}
              type="button"
              aria-expanded="false"
              aria-controls="collapseOne"
              onClick={toggleAccordion}
            >
              {group.label}
            </button>
          </h2>
          <div
            id="collapseOne"
            className="overflow-auto transition-max-height duration-700 ease-in-out"
            aria-labelledby="headingOne"
            data-bs-parent=".accordion"
            ref={contentSpace}
            style={{ maxHeight: `${height}` }}
          >
          </div>
        </div>
      </div>
    );
  };

export const Group = withVanillaControlProps(
  withJsonFormsLayoutProps(GroupLayoutRenderer)
);

export const groupTester: RankedTester = rankWith(3, uiTypeIs("Group"));
