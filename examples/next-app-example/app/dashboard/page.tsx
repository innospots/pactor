import type { Metadata } from "next";

import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "工作台 - Pactor",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
