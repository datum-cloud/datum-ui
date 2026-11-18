# Error Content

Shows errors in plain language, with the technical text one click away. `describeApiError` turns common API and Kubernetes errors into a headline and a next step; `ErrorContent` displays one. DataTable, TaskQueue and your own components share the same wording.

## Usage

```tsx
import { ErrorContent } from '@datum-cloud/datum-ui/error-content'

<ErrorContent error={error} actions={[{ label: 'Retry', onClick: retry }]} />
```

It shows the headline, the next step, any actions, and a collapsed **Error details** section with the raw text and request id, which can be copied. Pass `title` or `description` to replace the described ones, and `variant="minimal"` to drop the border.

## What gets translated

Known Kubernetes errors get a plain headline: permission denied (`You don't have permission to change dnsrecordsets.`), session expired, not found, already exists, changed by someone else, too many requests, timeouts and network failures. Anything else keeps its own message as the headline, because many errors are already written for people. The raw text is always kept as `detail`.

`describeApiError` reads Kubernetes `Status` objects, `Error`s, objects with `status`/`statusCode`, cloud-portal's `AppError` (`k8sReason`, `originalMessage`, `requestId`), and one level of `cause`.

## Customising

App-wide, wrap the app once:

```tsx
import { ErrorDescriptionProvider } from '@datum-cloud/datum-ui/error-content'

<ErrorDescriptionProvider
  // Name product areas in permission errors: "Permission denied for changes to Networking/DNS."
  apiGroupLabels={{ 'dns.networking.miloapis.com': 'Networking/DNS' }}
  // Adjust or replace any description. `base` is what describeApiError produced.
  describe={(error, base) => myWording(error) ?? base}
>
  <App />
</ErrorDescriptionProvider>
```

`ErrorContent`, DataTable's built-in error and TaskQueue all read it. In your own components, `useDescribeError()` returns the same describer.

Per use:

- `DataTable.Content`'s `errorContent` replaces the table's error, as a node or `(error, retry) => node`.
- TaskQueue's `formatError`, on the queue config or one `enqueue`, replaces how that task's thrown errors read.
- `ErrorContent`'s `title` and `description` replace the described wording.
