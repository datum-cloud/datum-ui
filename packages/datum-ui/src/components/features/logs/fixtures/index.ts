import type { LokiQueryRangeResponse } from '../types'
import albRaw from './alb_query_range.json'
import raw from './query_range.json'

export const queryRangeFixture = raw as unknown as LokiQueryRangeResponse

/** Staging Envoy OTEL access logs: empty Body, HTTP fields on stream labels. */
export const albQueryRangeFixture = albRaw as unknown as LokiQueryRangeResponse
