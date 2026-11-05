import type { Metadata } from "next";

import { FilePreviewClient } from "./file-preview-client";

export const metadata: Metadata = {
  title: "文件预览 - Pactor",
};

export default function FilePreviewPage() {
  return <FilePreviewClient />;
}
