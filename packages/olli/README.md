# @datum-cloud/olli

A React component library by Datum.

## Installation

```bash
npm install @datum-cloud/olli
```

## Usage

Import components and the base styles in your app entry point:

```tsx
// Import styles once at the root of your app
import "@datum-cloud/olli/styles";

// Import components
import { Button } from "@datum-cloud/olli";

export default function App() {
  return <Button type="primary">Click me</Button>;
}
```

## Peer Dependencies

- **React 18+** (required)
- **react-router ^7.0.0** (optional — only needed if you use routing-aware components)

## License

MIT
