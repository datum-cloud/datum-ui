# @datum-cloud/datum-ui

Datum Cloud's React design system and component library. Themed, composable components built on [shadcn/ui](https://ui.shadcn.com), [Radix UI](https://www.radix-ui.com), and [Tailwind CSS v4](https://tailwindcss.com).

## Install

```bash
npm install @datum-cloud/datum-ui
# or
yarn add @datum-cloud/datum-ui
# or
pnpm add @datum-cloud/datum-ui
# or
bun add @datum-cloud/datum-ui
```

## Setup

Wrap your app with `DatumProvider` to enable theming and styles:

```tsx
import { DatumProvider } from '@datum-cloud/datum-ui'
import '@datum-cloud/datum-ui/styles'

function App() {
  return (
    <DatumProvider>
      {/* your app */}
    </DatumProvider>
  )
}
```

## Entry Points

| Import Path | Description |
|---|---|
| `@datum-cloud/datum-ui` | All components, hooks, providers, and utilities |
| `@datum-cloud/datum-ui/components` | Components only (base + features) |
| `@datum-cloud/datum-ui/providers` | `DatumProvider` |
| `@datum-cloud/datum-ui/hooks` | `useCopyToClipboard`, `useDebounce` |
| `@datum-cloud/datum-ui/icons` | `CloseIcon`, `IconWrapper`, `SpinnerIcon` |
| `@datum-cloud/datum-ui/utils` | `cn` (className merge utility) |
| `@datum-cloud/datum-ui/styles` | Global CSS (fonts, tokens, component styles) |

## Components

### Base Components

Thin wrappers around shadcn/Radix primitives with Datum styling.

| Component | Peer Dependencies | Description |
|---|---|---|
| `Alert`, `AlertTitle`, `AlertDescription` | — | Status alert banners |
| `Badge` | — | Labels and status indicators with `type` and `theme` variants |
| `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbSeparator`, `BreadcrumbList`, `BreadcrumbPage`, `BreadcrumbEllipsis` | — | Navigation breadcrumbs |
| `Button` | `@radix-ui/react-slot` | Button with `type` (primary/secondary/danger/warning/success) and `theme` (solid/outline/ghost/link) variants |
| `ButtonGroup` | — | Group buttons horizontally |
| `Calendar` | `react-day-picker` | Date picker calendar |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | — | Content container |
| `Chart` (ChartContainer, ChartTooltip, etc.) | `recharts` | Data visualization wrapper |
| `Checkbox` | `@radix-ui/react-checkbox` | Toggle checkbox |
| `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` | `@radix-ui/react-collapsible` | Expandable sections |
| `Command`, `CommandInput`, `CommandList`, `CommandItem`, `CommandGroup` | `cmdk` | Command palette / search |
| `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose` | `@radix-ui/react-dialog` | Modal dialog |
| `HoverCard`, `HoverCardTrigger`, `HoverCardContent` | `@radix-ui/react-hover-card` | Hover-triggered popover |
| `Input` | — | Text input |
| `InputGroup`, `InputGroupInput`, `InputGroupText` | — | Input with prefix/suffix elements |
| `Label` | `@radix-ui/react-label` | Form label |
| `Map`, `MapTileLayer`, `MapMarker`, `MapPopup`, `MapTooltip`, `MapZoomControl`, `MapFullscreenControl`, `MapLayers`, `MapLayersControl`, `MapLayerGroup`, `MapCircle`, `MapPolygon`, `MapRectangle`, `MapPolyline`, `MapDrawControl`, `MapDrawMarker`, `MapDrawPolyline`, `MapDrawCircle`, `MapDrawPolygon`, `MapDrawEdit`, `MapDrawDelete`, `MapDrawUndo`, `MapLocateControl`, `MapSearchControl`, `MapControlContainer` | `leaflet`, `react-leaflet`, `leaflet-draw`, `leaflet.fullscreen`, `leaflet.markercluster`, `react-leaflet-markercluster` | Interactive map (SSR-safe, lazy-loaded) |
| `PlaceAutocomplete` | — | Google Places address autocomplete |
| `Popover`, `PopoverTrigger`, `PopoverContent` | `@radix-ui/react-popover` | Click-triggered popover |
| `RadioGroup`, `RadioGroupItem` | `@radix-ui/react-radio-group` | Radio button group |
| `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue`, `SelectGroup`, `SelectLabel`, `SelectSeparator` | `@radix-ui/react-select` | Dropdown select |
| `Separator` | `@radix-ui/react-separator` | Visual divider |
| `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetFooter`, `SheetClose` | `@radix-ui/react-dialog` | Slide-out panel |
| `Skeleton` | — | Loading placeholder |
| `Spinner` | — | Loading spinner |
| `Switch` | `@radix-ui/react-switch` | Toggle switch |
| `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`, `TableCaption` | — | Data table |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | `@radix-ui/react-tabs` | Tabbed interface |
| `Textarea` | — | Multi-line text input |
| `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider` | `@radix-ui/react-tooltip` | Hover tooltip |
| `Title`, `Text`, `Paragraph`, `Link`, `List`, `ListItem`, `Blockquote`, `Code` | — | Typography components with `level`, `size`, `weight`, `color`, `type` variants |
| `VisuallyHidden` | `@radix-ui/react-visually-hidden` | Screen-reader only content |

### Feature Components

Complex, fully-customized components with significant business logic.

| Component | Peer Dependencies | Description |
|---|---|---|
| `Autocomplete` | `cmdk` | Search autocomplete input |
| `AvatarStack` | `@radix-ui/react-avatar`, `@radix-ui/react-tooltip` | Stacked avatar display |
| `CalendarDatePicker` | `react-day-picker`, `date-fns` | Date/range picker with presets |
| `Dropdown`, `DropdownHeader`, `DropdownItem`, `DropdownSection` | `@radix-ui/react-dropdown-menu` | Dropdown menu |
| `Dropzone` | `react-dropzone` | File drag-and-drop upload area |
| `EmptyContent` | — | Empty state placeholder |
| `FileInputButton` | — | File upload button |
| `Form`, `FormField`, `FormInput`, `FormTextarea`, `FormSelect`, `FormCheckbox`, `FormSwitch`, `FormRadioGroup`, `FormFieldArray` | `@conform-to/react`, `@conform-to/zod`, `zod` | Form system with validation |
| `Grid` | `@tanstack/react-virtual` | Virtualized data grid |
| `InputNumber` | `react-number-format` | Numeric input with formatting |
| `InputWithAddons` | — | Input with prefix/suffix addons |
| `LoaderOverlay` | — | Full-screen loading overlay |
| `MoreActions` | `@radix-ui/react-dropdown-menu` | Three-dot actions menu |
| `NProgress` | `nprogress` | Page navigation progress bar |
| `PageTitle` | — | Page header with breadcrumbs |
| `Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton` | — | App sidebar navigation |
| `Stepper` | `@stepperize/react` | Multi-step wizard |
| `TagInput` | — | Tag/chip input |
| `TaskQueue`, `TaskQueueProvider`, `TaskQueueDropdown`, `TaskPanelHeader`, `TaskSummaryDialog` | — | Background task queue with progress UI |
| `TimeRangePicker` | `date-fns`, `date-fns-tz` | Time range selector with timezone support |
| `Toast`, `Toaster`, `useToast` | `sonner` | Toast notifications |

## Usage Examples

### Button

```tsx
import { Button } from '@datum-cloud/datum-ui'

// Variants: type × theme
<Button type="primary" theme="solid">Save</Button>
<Button type="danger" theme="outline">Delete</Button>
<Button type="secondary" theme="ghost">Cancel</Button>
```

### Typography

```tsx
import { Title, Text, Paragraph, Code } from '@datum-cloud/datum-ui'

<Title level={1}>Page Title</Title>
<Title level={3} color="primary">Section</Title>
<Text size="sm" color="secondary">Subtitle text</Text>
<Paragraph>Body paragraph with default styling.</Paragraph>
<Code copyable>npm install @datum-cloud/datum-ui</Code>
```

### Form with Validation

```tsx
import { Form, FormField, FormInput, FormSelect } from '@datum-cloud/datum-ui'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  role: z.enum(['admin', 'user']),
})

<Form schema={schema} onSubmit={handleSubmit}>
  <FormField name="name">
    <FormInput label="Name" />
  </FormField>
  <FormField name="role">
    <FormSelect label="Role" options={[
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
    ]} />
  </FormField>
</Form>
```

### Map

```tsx
import {
  Map, MapTileLayer, MapMarker, MapPopup, MapZoomControl,
} from '@datum-cloud/datum-ui'

<div className="h-[500px] w-full">
  <Map center={[51.505, -0.09]} zoom={13}>
    <MapTileLayer />
    <MapZoomControl position="topright" />
    <MapMarker position={[51.505, -0.09]}>
      <MapPopup>Hello from London!</MapPopup>
    </MapMarker>
  </Map>
</div>
```

### Dialog

```tsx
import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
} from '@datum-cloud/datum-ui'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm</DialogTitle>
      <DialogDescription>Are you sure?</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### Toast

```tsx
import { Toaster, useToast } from '@datum-cloud/datum-ui'

function App() {
  return (
    <DatumProvider>
      <Toaster />
      <MyComponent />
    </DatumProvider>
  )
}

function MyComponent() {
  const { toast } = useToast()
  return <Button onClick={() => toast.success('Saved!')}>Save</Button>
}
```

### Task Queue

```tsx
import {
  TaskQueueProvider, TaskQueueDropdown, useTaskQueue,
} from '@datum-cloud/datum-ui'

<TaskQueueProvider config={{ concurrency: 3 }}>
  <TaskQueueDropdown />
  <MyComponent />
</TaskQueueProvider>

function MyComponent() {
  const { enqueue } = useTaskQueue()

  const handleUpload = () => {
    enqueue({
      id: 'upload-1',
      label: 'Uploading file.pdf',
      run: async () => { /* upload logic */ },
    })
  }

  return <Button onClick={handleUpload}>Upload</Button>
}
```

## Theming

`DatumProvider` includes a theme provider with dark mode support:

```tsx
import { DatumProvider } from '@datum-cloud/datum-ui'

// Props: defaultTheme, storageKey, disableTransitionOnChange
<DatumProvider defaultTheme="system">
  {children}
</DatumProvider>
```

Theme values: `'light'`, `'dark'`, `'system'`.

Access the current theme:

```tsx
import { useTheme } from '@datum-cloud/datum-ui'

const { theme, setTheme, resolvedTheme } = useTheme()
```

## Peer Dependencies

All peer dependencies are **optional** — install only what you use.

> Replace `npm install` with `yarn add`, `pnpm add`, or `bun add` for your package manager.

```bash
# Forms
npm install @conform-to/react @conform-to/zod zod

# Maps
npm install leaflet react-leaflet leaflet-draw leaflet.fullscreen leaflet.markercluster react-leaflet-markercluster

# Charts
npm install recharts

# Date pickers
npm install react-day-picker date-fns date-fns-tz

# Animations
npm install motion
```

## Tech Stack

- **React 19** with server component support
- **Tailwind CSS v4** for styling
- **Radix UI** for accessible primitives
- **CVA** (class-variance-authority) for variant-based component APIs
- **TypeScript** — fully typed with exported types

## Links

- [GitHub](https://github.com/datum-cloud/datum-ui)
- [npm](https://www.npmjs.com/package/@datum-cloud/datum-ui)

## License

MIT
