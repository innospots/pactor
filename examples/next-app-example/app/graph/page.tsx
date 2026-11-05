import type { Metadata } from "next";

import { GraphClient } from "./graph-client";

export const metadata: Metadata = {
  title: "关系图 - Pactor",
};

export default function GraphPage() {
  return <GraphClient />;
}
