#!/usr/bin/env node
// One live turn against a Patch deployment through this package's transport —
// the same code the web and React Native chats run. Prints text as it streams,
// tool calls as they start and finish, and the terminal state.
//
//   TOKEN=$(datumctl auth get-token --output=token) \
//     node scripts/live-chat.mjs --project <project> "What resources do I have in this project?"
//
// Options: --api <url> (default https://api.staging.env.datum.net; the service
// URL is discovered from its AssistantEndpoint, --url overrides), --delete
// (delete the conversation afterwards). Run `pnpm build` first. Read-only
// prompts only: Patch acts with your identity.
import { randomUUID } from 'node:crypto'
import process from 'node:process'
import { parseArgs } from 'node:util'
// eslint-disable-next-line antfu/no-import-dist -- a script over the built package, as consumers get it
import { createAssistantTransport, deleteConversation, getAssistantEndpointUrl } from '../dist/index.js'

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    project: { type: 'string' },
    api: { type: 'string', default: 'https://api.staging.env.datum.net' },
    url: { type: 'string' },
    delete: { type: 'boolean', default: false },
  },
})
const token = process.env.TOKEN
const prompt = positionals.join(' ')
if (!token || !values.project || !prompt) {
  console.error('usage: TOKEN=… node scripts/live-chat.mjs --project <project> [--delete] "<read-only prompt>"')
  process.exit(2)
}

const project = values.project
function scopedFetch(path, init = {}) {
  return fetch(`${values.api}/apis/resourcemanager.miloapis.com/v1alpha1/projects/${project}/control-plane${path}`, {
    ...init,
    headers: { ...init.headers, Authorization: `Bearer ${token}` },
  })
}
const baseUrl = values.url ?? await getAssistantEndpointUrl(scopedFetch)
console.error(`service ${baseUrl}  project ${project}`)

const transport = createAssistantTransport({ baseUrl, fetch, getToken: async () => token })
const contextId = randomUUID()
const t0 = Date.now()
const ms = () => `${((Date.now() - t0) / 1000).toFixed(1)}s`
for await (const event of transport.sendStreaming({
  text: prompt,
  contextId,
  projectName: project,
  onTask: ({ taskId }) => console.error(`[${ms()}] task ${taskId}`),
})) {
  switch (event.type) {
    case 'tool_start':
      console.error(`\n[${ms()}] tool_start  ${event.name}${event.summary ? ` (${event.summary})` : ''}`)
      break
    case 'tool_finish':
      console.error(`[${ms()}] tool_finish ${event.name} ok=${event.ok} ${event.elapsedMs}ms`)
      break
    case 'text_delta':
      process.stdout.write(event.text)
      break
    case 'text_replace':
      process.stdout.write(`\n[recovered]\n${event.text}`)
      break
    case 'done':
      console.error(`\n[${ms()}] done ${event.state}${event.error ? `: ${event.error}` : ''}`)
      break
  }
}
console.error(`conversation ${contextId}`)
if (values.delete) {
  await deleteConversation(scopedFetch, project, contextId)
  console.error('deleted')
}
