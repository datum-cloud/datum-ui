import type { SummaryRenderContent, TaskSummaryData, TaskSummaryItem } from '../types'

/**
 * Holds the summary-dialog UI state that is intentionally decoupled from the
 * task-scheduling engine. Keeping this separate from {@link TaskQueue} means the
 * scheduler is not responsible for presentation state.
 */
export class SummaryStore {
  private activeSummary: TaskSummaryData | null = null
  private globalRenderContent: SummaryRenderContent | undefined

  constructor(globalRenderContent?: SummaryRenderContent) {
    this.globalRenderContent = globalRenderContent
  }

  show(
    title: string,
    items: TaskSummaryItem[],
    options?: { renderContent?: SummaryRenderContent },
  ): void {
    this.activeSummary = { title, items, renderContent: options?.renderContent }
  }

  close(): void {
    this.activeSummary = null
  }

  getActive(): TaskSummaryData | null {
    return this.activeSummary
  }

  getGlobalRenderContent(): SummaryRenderContent | undefined {
    return this.globalRenderContent
  }
}
