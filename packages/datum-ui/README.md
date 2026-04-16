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

## Requirements

- **React 19**
- **Tailwind CSS v4.0.7+** (v4.2.1+ recommended)

## Setup

### 1. Import Styles

Add datum-ui styles to your CSS file, after Tailwind:

```css
/* app.css */
@import 'tailwindcss';
@import '@datum-cloud/datum-ui/styles';

/* Optional — import only if you use these components */
@import '@datum-cloud/datum-ui/grid';
@import '@datum-cloud/datum-ui/nprogress';
```

datum-ui ships uncompiled CSS that is processed by your Tailwind build in a single pass. The styles import automatically configures Tailwind to scan datum-ui's components for class usage via `@source`, so utilities like `bg-primary` and `text-foreground` work out of the box.

### 2. Add ThemeProvider

Wrap your app with `ThemeProvider` for light/dark/system theme switching:

```tsx
import { ThemeProvider } from '@datum-cloud/datum-ui/theme'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* your app */}
    </ThemeProvider>
  )
}
```

## Imports

Each component has its own subpath export. Import only what you need:

```tsx
import { Button } from '@datum-cloud/datum-ui/button'
import { Dialog } from '@datum-cloud/datum-ui/dialog'
import { Form, FormField, FormInput } from '@datum-cloud/datum-ui/form'
```

This keeps your bundle small. Some components require additional dependencies — check the component tables below for what to install.

### Shared Exports

| Import Path                       | Description                                                    |
| --------------------------------- | -------------------------------------------------------------- |
| `@datum-cloud/datum-ui`           | Root barrel — all components (requires all peer deps)          |
| `@datum-cloud/datum-ui/styles`    | Core CSS (fonts, tokens, theme variables, component styles)    |
| `@datum-cloud/datum-ui/grid`      | Grid system CSS (optional — import if using Grid component)    |
| `@datum-cloud/datum-ui/nprogress` | NProgress CSS (optional — import if using NProgress component) |
| `@datum-cloud/datum-ui/theme`     | Theme utilities and types                                      |
| `@datum-cloud/datum-ui/hooks`     | `useCopyToClipboard`, `useDebounce`                            |
| `@datum-cloud/datum-ui/icons`     | `CloseIcon`, `IconWrapper`, `SpinnerIcon`                      |
| `@datum-cloud/datum-ui/utils`     | `cn` (className merge utility)                                 |

### Grouped Exports

Some components with shared heavy dependencies are grouped under a single subpath:

| Import Path                         | Includes                                   | Required Dependencies                         |
| ----------------------------------- | ------------------------------------------ | --------------------------------------------- |
| `@datum-cloud/datum-ui/date-picker` | `CalendarDatePicker`, `TimeRangePicker`    | `react-day-picker`, `date-fns`, `date-fns-tz` |
| `@datum-cloud/datum-ui/map`         | `Map`, `PlaceAutocomplete`, + map controls | `leaflet`, `react-leaflet`, + leaflet plugins |
| `@datum-cloud/datum-ui/dropzone`    | `Dropzone`, `FileInputButton`              | `react-dropzone`                              |
| `@datum-cloud/datum-ui/chart`       | `ChartContainer`, `ChartTooltip`, etc.     | `recharts`                                    |
| `@datum-cloud/datum-ui/form`        | `Form`, `FormField`, `FormInput`, etc.     | See [Form Adapters](#form-adapters) below     |

## Components

### Base Components

Thin wrappers around shadcn/Radix primitives with Datum styling. **Radix UI dependencies are bundled** — no additional installation required for these components.

| Component                                                                                                                                                                                                                                                                                                                                                                                                                 | Additional Dependencies                                                                                                  | Description                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `Alert`, `AlertTitle`, `AlertDescription`                                                                                                                                                                                                                                                                                                                                                                                 | —                                                                                                                        | Status alert banners                                                                                          |
| `Avatar`, `AvatarImage`, `AvatarFallback`                                                                                                                                                                                                                                                                                                                                                                                 | —                                                                                                                        | User profile image with fallback support                                                                      |
| `Badge`                                                                                                                                                                                                                                                                                                                                                                                                                   | —                                                                                                                        | Labels and status indicators with `type` and `theme` variants                                                 |
| `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbSeparator`, `BreadcrumbList`, `BreadcrumbPage`, `BreadcrumbEllipsis`                                                                                                                                                                                                                                                                                         | —                                                                                                                        | Navigation breadcrumbs                                                                                        |
| `Button`                                                                                                                                                                                                                                                                                                                                                                                                                  | —                                                                                                                        | Button with `type` (primary/secondary/danger/warning/success) and `theme` (solid/outline/ghost/link) variants |
| `ButtonGroup`                                                                                                                                                                                                                                                                                                                                                                                                             | —                                                                                                                        | Group buttons horizontally                                                                                    |
| `Calendar`                                                                                                                                                                                                                                                                                                                                                                                                                | `react-day-picker`                                                                                                       | Date picker calendar                                                                                          |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`                                                                                                                                                                                                                                                                                                                                         | —                                                                                                                        | Content container                                                                                             |
| `Chart` (ChartContainer, ChartTooltip, etc.)                                                                                                                                                                                                                                                                                                                                                                              | `recharts`                                                                                                               | Data visualization wrapper                                                                                    |
| `Checkbox`                                                                                                                                                                                                                                                                                                                                                                                                                | —                                                                                                                        | Toggle checkbox                                                                                               |
| `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`                                                                                                                                                                                                                                                                                                                                                                 | —                                                                                                                        | Expandable sections                                                                                           |
| `Command`, `CommandInput`, `CommandList`, `CommandItem`, `CommandGroup`                                                                                                                                                                                                                                                                                                                                                   | —                                                                                                                        | Command palette / search                                                                                      |
| `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`                                                                                                                                                                                                                                                                                             | —                                                                                                                        | Modal dialog                                                                                                  |
| `HoverCard`, `HoverCardTrigger`, `HoverCardContent`                                                                                                                                                                                                                                                                                                                                                                       | —                                                                                                                        | Hover-triggered popover                                                                                       |
| `Input`                                                                                                                                                                                                                                                                                                                                                                                                                   | —                                                                                                                        | Text input                                                                                                    |
| `InputGroup`, `InputGroupInput`, `InputGroupText`                                                                                                                                                                                                                                                                                                                                                                         | —                                                                                                                        | Input with prefix/suffix elements                                                                             |
| `Label`                                                                                                                                                                                                                                                                                                                                                                                                                   | —                                                                                                                        | Form label                                                                                                    |
| `Map`, `MapTileLayer`, `MapMarker`, `MapPopup`, `MapTooltip`, `MapZoomControl`, `MapFullscreenControl`, `MapLayers`, `MapLayersControl`, `MapLayerGroup`, `MapCircle`, `MapPolygon`, `MapRectangle`, `MapPolyline`, `MapDrawControl`, `MapDrawMarker`, `MapDrawPolyline`, `MapDrawCircle`, `MapDrawPolygon`, `MapDrawEdit`, `MapDrawDelete`, `MapDrawUndo`, `MapLocateControl`, `MapSearchControl`, `MapControlContainer` | `leaflet`, `react-leaflet`, `leaflet-draw`, `leaflet.fullscreen`, `leaflet.markercluster`, `react-leaflet-markercluster` | Interactive map (SSR-safe, lazy-loaded)                                                                       |
| `PlaceAutocomplete`                                                                                                                                                                                                                                                                                                                                                                                                       | —                                                                                                                        | Google Places address autocomplete                                                                            |
| `Popover`, `PopoverTrigger`, `PopoverContent`                                                                                                                                                                                                                                                                                                                                                                             | —                                                                                                                        | Click-triggered popover                                                                                       |
| `RadioGroup`, `RadioGroupItem`                                                                                                                                                                                                                                                                                                                                                                                            | —                                                                                                                        | Radio button group                                                                                            |
| `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectValue`, `SelectGroup`, `SelectLabel`, `SelectSeparator`                                                                                                                                                                                                                                                                                                  | —                                                                                                                        | Dropdown select                                                                                               |
| `Separator`                                                                                                                                                                                                                                                                                                                                                                                                               | —                                                                                                                        | Visual divider                                                                                                |
| `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetFooter`, `SheetClose`                                                                                                                                                                                                                                                                                                     | —                                                                                                                        | Slide-out panel                                                                                               |
| `Skeleton`                                                                                                                                                                                                                                                                                                                                                                                                                | —                                                                                                                        | Loading placeholder                                                                                           |
| `Spinner`                                                                                                                                                                                                                                                                                                                                                                                                                 | —                                                                                                                        | Loading spinner                                                                                               |
| `Switch`                                                                                                                                                                                                                                                                                                                                                                                                                  | —                                                                                                                        | Toggle switch                                                                                                 |
| `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`, `TableCaption`                                                                                                                                                                                                                                                                                                                  | —                                                                                                                        | Data table                                                                                                    |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`                                                                                                                                                                                                                                                                                                                                                                          | —                                                                                                                        | Tabbed interface                                                                                              |
| `Textarea`                                                                                                                                                                                                                                                                                                                                                                                                                | —                                                                                                                        | Multi-line text input                                                                                         |
| `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`                                                                                                                                                                                                                                                                                                                                                          | —                                                                                                                        | Hover tooltip                                                                                                 |
| `Title`, `Text`, `Paragraph`, `Link`, `List`, `ListItem`, `Blockquote`, `Code`                                                                                                                                                                                                                                                                                                                                            | —                                                                                                                        | Typography components with `level`, `size`, `weight`, `color`, `type` variants                                |
| `VisuallyHidden`                                                                                                                                                                                                                                                                                                                                                                                                          | —                                                                                                                        | Screen-reader only content                                                                                    |

### Feature Components

Complex, fully-customized components with significant business logic.

| Component                                                                                                                        | Additional Dependencies                   | Description                                |
| -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------ |
| `Autocomplete`                                                                                                                   | —                                         | Search autocomplete input                  |
| `Autosearch`                                                                                                                     | —                                         | Search-first input with async results      |
| `AvatarStack`                                                                                                                    | —                                         | Stacked avatar display                     |
| `CalendarDatePicker`                                                                                                             | `react-day-picker`, `date-fns`            | Date/range picker with presets             |
| `Combobox`                                                                                                                       | —                                         | Searchable single-select dropdown          |
| `CodeEditor`, `CodeEditorTabs`                                                                                                   | `@monaco-editor/react`, `monaco-editor`   | Monaco-based code editor with VS Code UX   |
| `DataTable`, `DataTableColumnHeader`, `DataTablePagination`, `DataTableToolbar`, `DataTableViewOptions`                          | `@tanstack/react-table`                   | Advanced data table with sorting/filtering |
| `DateTimePicker`, `TimePicker`                                                                                                   | `date-fns`, `date-fns-tz`                 | Date/time picker with timezone support     |
| `Dropdown`, `DropdownHeader`, `DropdownItem`, `DropdownSection`                                                                  | —                                         | Dropdown menu                              |
| `Dropzone`                                                                                                                       | `react-dropzone`                          | File drag-and-drop upload area             |
| `EmptyContent`                                                                                                                   | —                                         | Empty state placeholder                    |
| `FileInputButton`                                                                                                                | —                                         | File upload button                         |
| `Form`, `FormField`, `FormInput`, `FormTextarea`, `FormSelect`, `FormCheckbox`, `FormSwitch`, `FormRadioGroup`, `FormFieldArray` | See [Form Adapters](#form-adapters) below | Form system with pluggable adapter support |
| `Grid`                                                                                                                           | `@tanstack/react-virtual`                 | Virtualized data grid                      |
| `InputNumber`                                                                                                                    | `react-number-format`                     | Numeric input with formatting              |
| `InputWithAddons`                                                                                                                | —                                         | Input with prefix/suffix addons            |
| `LoaderOverlay`                                                                                                                  | —                                         | Full-screen loading overlay                |
| `MoreActions`                                                                                                                    | —                                         | Three-dot actions menu                     |
| `NProgress`                                                                                                                      | `nprogress`                               | Page navigation progress bar               |
| `PageTitle`                                                                                                                      | —                                         | Page header with breadcrumbs               |
| `Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`             | —                                         | App sidebar navigation                     |
| `Stepper`                                                                                                                        | `@stepperize/react`                       | Multi-step wizard                          |
| `TagInput`                                                                                                                       | —                                         | Tag/chip input                             |
| `TaskQueue`, `TaskQueueProvider`, `TaskQueueDropdown`, `TaskPanelHeader`, `TaskSummaryDialog`                                    | —                                         | Background task queue with progress UI     |
| `TimeRangePicker`                                                                                                                | `date-fns`, `date-fns-tz`                 | Time range selector with timezone support  |
| `Transfer`                                                                                                                       | —                                         | Dual-panel item selector with search       |
| `Toast`, `Toaster`, `useToast`                                                                                                   | `sonner`                                  | Toast notifications                        |

## Usage Examples

### Avatar

```tsx
import { Avatar, AvatarImage, AvatarFallback } from '@datum-cloud/datum-ui/avatar'

// With image and fallback
<Avatar>
  <AvatarImage src="https://example.com/avatar.jpg" alt="User Name" />
  <AvatarFallback>UN</AvatarFallback>
</Avatar>

// Custom size
<Avatar className="size-16">
  <AvatarImage src="https://example.com/avatar.jpg" alt="User Name" />
  <AvatarFallback className="text-lg">UN</AvatarFallback>
</Avatar>

// Fallback only (no image)
<Avatar>
  <AvatarFallback>AB</AvatarFallback>
</Avatar>
```

### Button

```tsx
import { Button } from '@datum-cloud/datum-ui/button'

// Variants: type × theme
<Button type="primary" theme="solid">Save</Button>
<Button type="danger" theme="outline">Delete</Button>
<Button type="secondary" theme="ghost">Cancel</Button>
```

### Typography

```tsx
import { Title, Text, Paragraph, Code } from '@datum-cloud/datum-ui/typography'

<Title level={1}>Page Title</Title>
<Title level={3} color="primary">Section</Title>
<Text size="sm" color="secondary">Subtitle text</Text>
<Paragraph>Body paragraph with default styling.</Paragraph>
<Code copyable>npm install @datum-cloud/datum-ui</Code>
```

### Form with Validation

The form system uses a pluggable adapter pattern. Wrap your app with an adapter, then use `Form.*` components as usual:

```tsx
import { Form } from '@datum-cloud/datum-ui/form'
import { ConformAdapter } from '@datum-cloud/datum-ui/form/adapters/conform'
// or: import { RHFAdapter } from '@datum-cloud/datum-ui/form/adapters/rhf'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['admin', 'user']),
})

// Wrap your app once with an adapter
function App() {
  return (
    <ConformAdapter>
      <MyForm />
    </ConformAdapter>
  )
}

// Form code is identical regardless of adapter
function MyForm() {
  return (
    <Form.Root schema={schema} onSubmit={handleSubmit}>
      <Form.Field name="name" label="Name" required>
        <Form.Input />
      </Form.Field>
      <Form.Field name="role" label="Role" required>
        <Form.Select placeholder="Select a role">
          <Form.SelectItem value="admin">Admin</Form.SelectItem>
          <Form.SelectItem value="user">User</Form.SelectItem>
        </Form.Select>
      </Form.Field>
      <Form.Submit>Save</Form.Submit>
    </Form.Root>
  )
}
```

### Map

```tsx
import {
  Map, MapTileLayer, MapMarker, MapPopup, MapZoomControl,
} from '@datum-cloud/datum-ui/map'

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
} from '@datum-cloud/datum-ui/dialog'

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
import { ThemeProvider } from '@datum-cloud/datum-ui/theme'
import { Toaster, useToast } from '@datum-cloud/datum-ui/toast'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster />
      <MyComponent />
    </ThemeProvider>
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
} from '@datum-cloud/datum-ui/task-queue'

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

`ThemeProvider` supports light, dark, and system theme modes:

```tsx
import { ThemeProvider } from '@datum-cloud/datum-ui/theme'

<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

Access the current theme:

```tsx
import { useTheme } from '@datum-cloud/datum-ui/theme'

const { theme, setTheme, resolvedTheme } = useTheme()
```

## Peer Dependencies

### Required

These dependencies are **required** to use datum-ui:

```bash
npm install react react-dom tailwindcss lucide-react
```

- **React 19+** and **React DOM 19+**: Framework requirements
- **Tailwind CSS v4** (v4.0.7+, v4.2.1+ recommended): Required for styling
- **lucide-react**: Icon library used throughout components

**All Radix UI packages are bundled** — you don't need to install them separately.

### Optional (Component-Specific)

Many components require additional packages. Install only what you use:

> Replace `npm install` with `yarn add`, `pnpm add`, or `bun add` for your package manager.

```bash
# Forms — Conform adapter
npm install @conform-to/react @conform-to/zod zod

# Forms — React Hook Form adapter (alternative)
npm install react-hook-form @hookform/resolvers zod

# Maps (Map, MapMarker, MapPopup, etc.)
npm install leaflet react-leaflet leaflet-draw leaflet.fullscreen leaflet.markercluster react-leaflet-markercluster

# Charts (ChartContainer, ChartTooltip, etc.)
npm install recharts

# Code editor (CodeEditor, CodeEditorTabs)
npm install @monaco-editor/react monaco-editor

# Date pickers (Calendar, CalendarDatePicker, TimeRangePicker)
npm install react-day-picker date-fns date-fns-tz

# File upload (Dropzone)
npm install react-dropzone

# Number formatting (InputNumber)
npm install react-number-format

# Stepper (multi-step flows)
npm install @stepperize/react

# Toast notifications (Toast, Toaster)
npm install sonner

# Progress bar (NProgress)
npm install nprogress

# Data grid (Grid - virtualized tables)
npm install @tanstack/react-virtual

# Data Table (DataTable component)
npm install @tanstack/react-table

# Data Table with URL state (optional)
npm install nuqs

# Animations (motion components)
npm install motion
```

## Form Adapters

The form system supports pluggable adapters. Choose one and wrap your app:

| Adapter             | Import Path                                   | Dependencies                                                         |
| ------------------- | --------------------------------------------- | -------------------------------------------------------------------- |
| **Conform.js**      | `@datum-cloud/datum-ui/form/adapters/conform` | `@conform-to/react`, `@conform-to/zod`, `zod` (>=4)                  |
| **React Hook Form** | `@datum-cloud/datum-ui/form/adapters/rhf`     | `react-hook-form` (>=7.55), `@hookform/resolvers` (>=5), `zod` (>=4) |

The `Form.*` component API is identical with either adapter. Switch adapters by changing only the root provider -- no form code changes needed.

See the [Form README](./src/components/features/form/README.md) for detailed documentation.

## Tech Stack

- **React 19** with server component support
- **Tailwind CSS v4** (v4.0.7+) for styling — ships uncompiled CSS processed by consumer's build
- **Radix UI** for accessible primitives
- **CVA** (class-variance-authority) for variant-based component APIs
- **TypeScript** — fully typed with exported types

## Links

- [GitHub](https://github.com/datum-cloud/datum-ui)
- [npm](https://www.npmjs.com/package/@datum-cloud/datum-ui)

## License

MIT

## Optional: Canela font

Datum-branded surfaces can opt into Canela Text for the `font-title` Tailwind utility:

```ts
import '@datum-cloud/datum-ui/styles/canela'
```

Consumers who do not import this file use the default system font stack declared in tokens — no visual degradation.
