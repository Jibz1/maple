import { describe, expect, it } from "vitest"
import { migration_0004_service_namespace_projections } from "./0004_service_namespace_projections"
import { migrations } from "./index"

describe("ClickHouse migrations", () => {
	it("keeps service.namespace migration ordered after the previous deltas", () => {
		expect(migrations.map((m) => m.version)).toEqual([1, 2, 3, 4])
		expect(migrations.at(-1)).toBe(migration_0004_service_namespace_projections)
	})

	it("rebuilds namespace-aware log aggregates and recreates affected materialized views", () => {
		const sql = migration_0004_service_namespace_projections.statements.join("\n\n")

		expect(sql).toContain("ServiceNamespace LowCardinality(String) DEFAULT ''")
		expect(sql).toContain("CREATE TABLE IF NOT EXISTS logs_aggregates_hourly__v4")
		expect(sql).toContain(
			"ORDER BY (OrgId, Hour, ServiceName, SeverityText, DeploymentEnv, ServiceNamespace)",
		)
		expect(sql).toContain("RENAME TABLE logs_aggregates_hourly TO logs_aggregates_hourly__v4_old")
		expect(sql).toContain("CREATE MATERIALIZED VIEW IF NOT EXISTS service_overview_spans_mv")
		expect(sql).toContain("CREATE MATERIALIZED VIEW IF NOT EXISTS trace_list_mv_mv")
		expect(sql).toContain("CREATE MATERIALIZED VIEW IF NOT EXISTS logs_aggregates_hourly_mv")
		expect(sql).toContain("INDEX idx_service_namespace ServiceNamespace TYPE set(1000) GRANULARITY 4")
	})

	it("uses explicit column lists for namespace backfills so appended columns do not drift by position", () => {
		const sql = migration_0004_service_namespace_projections.statements.join("\n\n")

		expect(sql).not.toMatch(
			/INSERT INTO (service_overview_spans|trace_list_mv|logs_aggregates_hourly__v4)\s+SELECT/,
		)
		expect(sql).toContain(`INSERT INTO service_overview_spans (
  OrgId,
  Timestamp,
  ServiceName,
  Duration,
  StatusCode,
  TraceState,
  DeploymentEnv,
  CommitSha,
  SampleRate,
  ServiceNamespace
)`)
		expect(sql).toContain(`INSERT INTO trace_list_mv (
  OrgId,
  TraceId,
  Timestamp,
  ServiceName,
  SpanName,
  SpanKind,
  Duration,
  StatusCode,
  HttpMethod,
  HttpRoute,
  HttpStatusCode,
  DeploymentEnv,
  HasError,
  TraceState,
  ServiceNamespace
)`)
		expect(sql).toContain(`INSERT INTO logs_aggregates_hourly__v4 (
  OrgId,
  Hour,
  ServiceName,
  SeverityText,
  DeploymentEnv,
  Count,
  SizeBytes,
  ServiceNamespace
)`)
	})
})
