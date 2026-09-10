/**
 * Host shown for an HTTP access log. An explicit `host` label (set by the
 * host app) wins; otherwise prefer the name the client asked for
 * (`requested_server_name`, `x_forwarded_host`) over the upstream
 * `authority`, then fall back to `resource_name`.
 */
export function logRequestHost(labels: Record<string, string>): string | undefined {
  const host
    = labels.host?.trim()
      || labels.requested_server_name?.trim()
      || labels.x_forwarded_host?.trim()
      || labels.authority?.trim()
      || labels.resource_name?.trim()
  return host || undefined
}
