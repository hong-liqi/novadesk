-- CreateTable
CREATE TABLE "ticket_metrics_daily" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "open_count" INTEGER NOT NULL,
    "created_count" INTEGER NOT NULL,
    "resolved_count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ticket_metrics_daily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_kpi_snapshots" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "open_tickets" INTEGER NOT NULL,
    "resolved_tickets" INTEGER NOT NULL,
    "avg_resolution_time_hours" DOUBLE PRECISION NOT NULL,
    "captured_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workspace_kpi_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ticket_metrics_daily_workspace_id_date_idx" ON "ticket_metrics_daily"("workspace_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "ticket_metrics_daily_workspace_id_date_key" ON "ticket_metrics_daily"("workspace_id", "date");

-- CreateIndex
CREATE INDEX "workspace_kpi_snapshots_workspace_id_captured_at_idx" ON "workspace_kpi_snapshots"("workspace_id", "captured_at");
