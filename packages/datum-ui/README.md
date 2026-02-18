# @datum-cloud/datum-ui

A React component library by Datum.

## Installation

```bash
npm install @datum-cloud/datum-ui
```

## Usage

Import components and the base styles in your app entry point:

```tsx
// Import styles once at the root of your app
import "@datum-cloud/datum-ui/styles";

// Import components
import { Button } from "@datum-cloud/datum-ui";

export default function App() {
  return <Button type="primary">Click me</Button>;
}
```

## Peer Dependencies

- **React 18+** (required)
- **react-router ^7.0.0** (optional — only needed if you use routing-aware components)

## License

MIT
