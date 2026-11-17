import type { NextConfig } from "next";

import { withShell } from "@pactor-app/shell/next";

const nextConfig: NextConfig = withShell({
  /** 容器部署时可改为 standalone，并确认 .generated 与 public/modules 进入镜像 */
  // output: "standalone",
  // 接入 UI 模块后按需登记，如：transpilePackages: ["@your-scope/ui-module"]
  transpilePackages: [],
  /** 根路径与框架欢迎页让位给 general-app 的业务工作台。 */
  async redirects() {
    return [
      { source: "/", destination: "/general-app/workspace", permanent: false },
      { source: "/workspace", destination: "/general-app/workspace", permanent: false },
    ];
  },
});

export default nextConfig;
