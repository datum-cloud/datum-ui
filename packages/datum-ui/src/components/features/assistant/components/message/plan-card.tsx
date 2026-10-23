'use client'

import type { LucideIcon } from 'lucide-react'
import type { AssistantPlanData, AssistantPlanResource } from '../../types'
import { Box, Check, ClipboardList, Code, Globe, Network, Server, Split } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../../../../utils/cn'
import { Button } from '../../../../base/button'
import { Icon } from '../../../../icons/icon-wrapper'

/** How a few common kinds read to someone who doesn't know their API names. */
const KIND_LABELS: Record<string, string> = {
  HTTPProxy: 'Load balancer',
  NetworkService: 'Network service',
  Workload: 'Workload',
  Domain: 'Domain',
  Network: 'Network',
}

const KIND_ICONS: Record<string, LucideIcon> = {
  HTTPProxy: Split,
  NetworkService: Network,
  Workload: Server,
  Domain: Globe,
  Network,
}

/** What the card says about where the plan is, worked out on render. */
type CardState = 'pending' | 'applying' | 'applied' | 'failed' | 'expired' | 'replaced'

const BADGES: Record<CardState, { label: string, className: string }> = {
  pending: { label: 'Nothing created yet', className: 'bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300' },
  applying: { label: 'Applying', className: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  applied: { label: 'Applied', className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  failed: { label: 'Not applied', className: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300' },
  expired: { label: 'Expired', className: 'bg-muted text-muted-foreground' },
  replaced: { label: 'Replaced', className: 'bg-muted text-muted-foreground' },
}

function cardState(data: AssistantPlanData, latest: boolean, now: number): CardState {
  if (data.status !== 'pending')
    return data.status
  if (!latest)
    return 'replaced'
  const expires = Date.parse(data.expiresAt)
  if (!Number.isNaN(expires) && expires <= now)
    return 'expired'
  return 'pending'
}

/** "3 resources to create", "1 resource to change", "2 resources to create or change". */
function headline(resources: AssistantPlanResource[]): string {
  const creates = resources.some(r => r.action === 'create')
  const updates = resources.some(r => r.action === 'update')
  const verb = creates && updates ? 'create or change' : updates ? 'change' : 'create'
  return `${resources.length} ${resources.length === 1 ? 'resource' : 'resources'} to ${verb}`
}

function approveLabel(resources: AssistantPlanResource[]): string {
  const updates = resources.some(r => r.action === 'update')
  const creates = resources.some(r => r.action === 'create')
  return creates && !updates ? 'Approve and create' : updates && !creates ? 'Approve and update' : 'Approve and apply'
}

function timeOf(iso: string | undefined): string | undefined {
  if (!iso)
    return undefined
  const t = new Date(iso)
  return Number.isNaN(t.getTime()) ? undefined : t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export interface AssistantPlanCardProps {
  data: AssistantPlanData
  /** Whether this is the newest plan in the conversation; an older one reads as replaced. */
  latest?: boolean
  /** Whether Approve can be clicked now (the conversation is idle). */
  canApprove?: boolean
  onApprove?: () => void
  /** "Change something": the host puts the person in the composer to say what. */
  onChange?: () => void
  /** The clock, for tests. */
  now?: number
}

/**
 * A plan the assistant settled, as a card: one row per resource with what it
 * does, the YAML and differences on request, and the person's two answers.
 * Nothing is created until they click Approve, and the card then shows how it
 * went.
 */
export function AssistantPlanCard({
  data,
  latest = true,
  canApprove = false,
  onApprove,
  onChange,
  now = Date.now(),
}: AssistantPlanCardProps) {
  const [showYaml, setShowYaml] = useState(false)
  const state = cardState(data, latest, now)
  const badge = BADGES[state]
  const approvedAt = timeOf(data.approvedAt)
  const appliedNames = new Set((data.applied ?? []).map(a => `${a.kind}/${a.name}`))

  return (
    <section
      aria-label={`Plan: ${headline(data.resources)}`}
      data-slot="assistant-plan"
      data-state={state}
      className="bg-card my-2 overflow-hidden rounded-xl border"
    >
      <header className="bg-muted/40 flex items-center gap-2 border-b px-4 py-3">
        <Icon icon={ClipboardList} className="size-4 shrink-0" />
        <span className="flex-1 font-medium">
          Plan ·
          {' '}
          {headline(data.resources)}
        </span>
        <span className={cn('rounded-full px-2.5 py-0.5 text-xs', badge.className)}>{badge.label}</span>
      </header>

      <ul className="divide-y">
        {data.resources.map((r) => {
          const kindIcon = KIND_ICONS[r.kind] ?? Box
          const done = state === 'applied' && appliedNames.has(`${r.kind}/${r.name}`)
          return (
            <li key={`${r.kind}/${r.namespace ?? ''}/${r.name}`} className="flex gap-3 px-4 py-3">
              <span className="bg-btn-primary/10 text-btn-primary flex size-8 shrink-0 items-center justify-center rounded-md">
                <Icon icon={kindIcon} className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p>
                  <span className="font-medium">{KIND_LABELS[r.kind] ?? r.kind}</span>
                  {' '}
                  <span className="text-muted-foreground font-mono text-[0.9em]">{r.name}</span>
                </p>
                {r.summary && <p className="text-muted-foreground">{r.summary}</p>}
                {r.diff && r.diff.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {r.diff.map(line => (
                      <code key={line} className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-xs text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                        {line}
                      </code>
                    ))}
                  </div>
                )}
              </div>
              <span
                className={cn(
                  'h-fit shrink-0 rounded-full px-2.5 py-0.5 text-xs',
                  r.action === 'update'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
                )}
              >
                {done ? (r.action === 'update' ? 'Updated' : 'Created') : r.action === 'update' ? 'Update' : 'Create'}
              </span>
            </li>
          )
        })}
      </ul>

      {showYaml && (
        <div className="bg-muted/30 space-y-3 border-t px-4 py-3">
          {data.resources.map(r => (
            <div key={`yaml-${r.kind}/${r.name}`}>
              <p className="text-muted-foreground mb-1 text-xs">
                {r.kind}
                {' '}
                {r.name}
              </p>
              <pre className="bg-card overflow-x-auto rounded-md border p-2 font-mono text-xs">{r.manifest}</pre>
            </div>
          ))}
        </div>
      )}

      <footer className="flex flex-wrap items-center gap-2 border-t px-4 py-3">
        <button
          type="button"
          onClick={() => setShowYaml(v => !v)}
          aria-expanded={showYaml}
          className="text-muted-foreground hover:text-foreground mr-auto inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <Icon icon={Code} className="size-4" />
          {showYaml ? 'Hide YAML and diff' : 'View YAML and diff'}
        </button>

        {state === 'pending' && (
          <>
            <Button type="tertiary" theme="outline" onClick={onChange} disabled={!canApprove}>
              Change something
            </Button>
            <Button
              type="primary"
              theme="solid"

              icon={<Icon icon={Check} className="size-4" />}
              onClick={onApprove}
              disabled={!canApprove}
            >
              {approveLabel(data.resources)}
            </Button>
          </>
        )}
        {state === 'applying' && (
          <Button type="primary" theme="solid" loading disabled>
            Applying
          </Button>
        )}
        {(state === 'applied' || state === 'failed') && approvedAt && (
          <span className="text-muted-foreground text-sm">
            Approved by you at
            {' '}
            {approvedAt}
          </span>
        )}
        {state === 'expired' && (
          <span className="text-muted-foreground text-sm">This plan expired. Ask for a new one to go ahead.</span>
        )}
      </footer>

      {state === 'failed' && data.error && (
        <p role="alert" className="text-destructive border-t px-4 py-3 text-sm">{data.error}</p>
      )}
    </section>
  )
}
