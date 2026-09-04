import type { Metadata } from "next";

import { RemoteDemoClient } from "./remote-demo-client";

export const metadata: Metadata = {
  title: "动态引用演示 - Pactor",
};

export default function RemoteDemoPage() {
  return <RemoteDemoClient />;
}
