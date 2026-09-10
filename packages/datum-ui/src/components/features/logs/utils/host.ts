/** Host shown for an HTTP access log, preferring the name the client used. */
export function logRequestHost(labels: Record<string, string>): string | undefined {
  const host
    = labels.host?.trim()
      || labels.requested_server_name?.trim()
      || labels.x_forwarded_host?.trim()
      || labels.authority?.trim()
      || labels.resource_name?.trim()
  return host || undefined
}
