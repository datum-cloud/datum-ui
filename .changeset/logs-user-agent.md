---
"@datum-cloud/datum-ui": minor
---

Logs detail summarises the client from the User-Agent header. When an HTTP entry carries a `user_agent` label (or `http_user_agent`, `useragent`, `ua`, `http.user_agent`), the Request section gains a Client row with a device icon and a short summary such as "Chrome 128 on macOS", "Safari 17 on iOS 17.5.1", or "curl 8", with the raw header underneath and a copy button.

`parseUserAgent(raw)` and `logUserAgent(labels)` are exported, along with the `ParsedUserAgent` and `UserAgentDevice` types. The parser is deliberately small and dependency-free: mainstream browsers and their forks, mobile and desktop platforms, common CLI and SDK clients, and self-declared bots and probes.
