---
"@datum-cloud/datum-ui": minor
---

Card gains layout variants so dashboards and settings pages can be built without overriding its padding at every call site.

The root now publishes `--card-px` / `--card-py` and takes `size` (`sm` | `md`) to scale the whole card's inset at once; rows rendered inside a card can use `px-(--card-px)` to line up with the header. A `sectioned` card drops the root padding and gap so each slot owns its own inset and slots are separated by dividers: `CardHeader` takes `size` (`sm` | `md` | `lg`) and `bordered`, `CardFooter` takes `bordered`, and both `CardContent` and `CardFooter` take `padding` (`default` | `x-none` | `none`) for flush lists and tables. `CardAction` places a trailing control in the header alongside the title and description. Defaults are unchanged.

Tabs gains `variant="line"` on `TabsList`: underline page tabs with a start-aligned list and a sliding active indicator. The indicator is driven by the Tabs root, so controlled and uncontrolled usage both animate, and it renders inside the link when combined with `TabsLinkTrigger`. Several line tab bars on one page never share an indicator.
