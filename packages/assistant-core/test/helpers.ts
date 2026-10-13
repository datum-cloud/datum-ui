import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/** Real `SendStreamingMessage` SSE body captured from staging (answer text and project replaced). */
export const A2A_STREAM_FIXTURE: string = readFileSync(join(import.meta.dirname, 'fixtures/a2a-stream.sse'), 'utf8')

/** A ReadableStream of `text`, split into chunks of `size` bytes (or at the given byte offsets). */
export function streamOf(text: string, size = 64): ReadableStream<Uint8Array> {
  const bytes = new TextEncoder().encode(text)
  let offset = 0
  return new ReadableStream({
    pull(controller) {
      if (offset >= bytes.length) {
        controller.close()
        return
      }
      controller.enqueue(bytes.slice(offset, offset + size))
      offset += size
    },
  })
}

/** Every `data:` JSON payload in an SSE body, in order. */
export function framesOf(sse: string): unknown[] {
  return sse
    .split('\n\n')
    .map(block => block.split('\n').filter(l => l.startsWith('data:')).map(l => l.slice(5).trim()).join('\n'))
    .filter(Boolean)
    .map(data => JSON.parse(data) as unknown)
}
