import type { Metadata } from "next";

import { GridDashboardClient } from "./grid-dashboard-client";

export const metadata: Metadata = {
  title: "可拖拽仪表盘 - Pactor",
};

export default function GridDashboardPage() {
  return <GridDashboardClient />;
}
