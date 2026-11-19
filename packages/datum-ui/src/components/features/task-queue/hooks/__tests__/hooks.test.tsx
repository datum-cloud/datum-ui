/// <reference types="@testing-library/jest-dom/vitest" />
import type { ReactNode } from 'react'
import type { Task } from '../../types'
import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MemoryTaskStorage } from '../../engine/storage/memory-storage'
import { TaskQueueProvider } from '../../provider/task-queue-provider'
import { createOrgMetadata, createProjectMetadata, createUserMetadata } from '../../utils'
import { useTaskQueue } from '../use-task-queue'
import { getContextLabel, matchesCurrentScope, useCurrentScope, useTasksWithLabels } from '../use-task-scope'

function wrapper({ children }: { children: ReactNode }) {
  return <TaskQueueProvider config={{ storage: new MemoryTaskStorage() }}>{children}</TaskQueueProvider>
}

const org = { id: 'org-1', name: 'Acme' }
const project = { id: 'proj-1', name: 'Web' }

describe('useTaskQueue', () => {
  it('throws outside a TaskQueueProvider', () => {
    expect(() => renderHook(() => useTaskQueue())).toThrow('useTaskQueue must be used within a TaskQueueProvider')
  })

  it('lists an enqueued task and cancels it', async () => {
    const { result } = renderHook(() => useTaskQueue(), { wrapper })
    let id = ''
    act(() => {
      id = result.current.enqueue({
        title: 'Slow task',
        cancelable: true,
        processor: ctx => new Promise<void>((resolve) => {
          const timer = setInterval(() => {
            if (ctx.cancelled) {
              clearInterval(timer)
              resolve()
            }
          }, 5)
        }),
      }).id
    })
    await waitFor(() => expect(result.current.tasks.map(task => task.title)).toContain('Slow task'))
    act(() => result.current.cancel(id))
    await waitFor(() => expect(result.current.tasks.find(task => task.id === id)?.status).toBe('cancelled'))
  })

  it('filters by status and dismisses a finished task', async () => {
    const { result } = renderHook(() => useTaskQueue({ status: 'completed' }), { wrapper })
    let id = ''
    act(() => {
      id = result.current.enqueue({ title: 'Quick task', processor: async () => {} }).id
    })
    await waitFor(() => expect(result.current.tasks.map(task => task.id)).toEqual([id]))
    act(() => result.current.dismiss(id))
    await waitFor(() => expect(result.current.tasks).toHaveLength(0))
  })
})

describe('useCurrentScope', () => {
  it('prefers the project, then the org, then the global scope', () => {
    expect(renderHook(() => useCurrentScope({ projectId: 'proj-1', orgId: 'org-1' })).result.current)
      .toEqual({ type: 'project', projectId: 'proj-1', orgId: 'org-1' })
    expect(renderHook(() => useCurrentScope({ orgId: 'org-1' })).result.current).toEqual({ type: 'org', orgId: 'org-1' })
    expect(renderHook(() => useCurrentScope({})).result.current).toEqual({ type: 'global' })
  })
})

describe('matchesCurrentScope', () => {
  const projectTask = createProjectMetadata(project, org)
  const orgTask = createOrgMetadata(org)
  const userTask = createUserMetadata()

  it('matches a project task only in that project', () => {
    expect(matchesCurrentScope(projectTask, { type: 'project', projectId: 'proj-1' })).toBe(true)
    expect(matchesCurrentScope(projectTask, { type: 'project', projectId: 'proj-2' })).toBe(false)
  })

  it('matches an org task in that org, but not the org\'s project tasks', () => {
    expect(matchesCurrentScope(orgTask, { type: 'org', orgId: 'org-1' })).toBe(true)
    expect(matchesCurrentScope(projectTask, { type: 'org', orgId: 'org-1' })).toBe(false)
  })

  it('matches nothing on a global page or without metadata', () => {
    expect(matchesCurrentScope(userTask, { type: 'global' })).toBe(false)
    expect(matchesCurrentScope(undefined, { type: 'project', projectId: 'proj-1' })).toBe(false)
  })
})

describe('getContextLabel', () => {
  it('labels each scope', () => {
    expect(getContextLabel(createProjectMetadata(project, org))).toBe('Project: Web')
    expect(getContextLabel(createOrgMetadata(org))).toBe('Org: Acme')
    expect(getContextLabel(createUserMetadata())).toBe('User')
    expect(getContextLabel({ scope: 'edge', projectName: 'Web' })).toBe('AI Edge: Web')
    expect(getContextLabel({ scope: 'billing' })).toBe('Billing')
    expect(getContextLabel(undefined)).toBeUndefined()
  })
})

describe('useTasksWithLabels', () => {
  const task = (metadata: Task['metadata']) => ({ id: String(Math.random()), metadata }) as Task

  it('shows no labels without tasks or when every task belongs to the current project', () => {
    expect(renderHook(() => useTasksWithLabels([], { projectId: 'proj-1' })).result.current.showLabels).toBe(false)
    const tasks = [task(createProjectMetadata(project, org))]
    expect(renderHook(() => useTasksWithLabels(tasks, { projectId: 'proj-1' })).result.current.showLabels).toBe(false)
  })

  it('shows labels on a global page and for mixed scopes', () => {
    const tasks = [task(createProjectMetadata(project, org)), task(createOrgMetadata(org))]
    expect(renderHook(() => useTasksWithLabels(tasks, {})).result.current.showLabels).toBe(true)
    expect(renderHook(() => useTasksWithLabels(tasks, { projectId: 'proj-1' })).result.current.showLabels).toBe(true)
  })
})
