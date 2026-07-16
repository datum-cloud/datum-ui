'use client'

/** A user's message — a right-aligned bubble rendering the sanitized input HTML. */
export function UserMessage({ html }: { html: string }) {
  return (
    <div className="flex justify-end">
      <div className="bg-border text-foreground max-w-[80%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm">
        <div
          className="[&_em]:italic [&_p]:my-0.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_s]:line-through [&_strong]:font-semibold [&_u]:underline"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
