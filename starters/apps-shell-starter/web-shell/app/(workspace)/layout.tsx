// 模块自带样式：装配器按各模块 manifest 的 styles 生成 import。
import "@generated/pactor/module-styles";

// 皮肤 / 主题令牌由 Shell 统一提供（晨雾奶芙）：皮肤系统的默认基底，
// 用户选择预置皮肤后由 @pactor-app/theme 注入的样式覆盖。
import "@/modules/styles/theme.css";

// AppShell 外壳与 SkinSwitcher 样式。
import "@pactor-app/shell/styles.css";

// 默认页面（工作台 / 数据概览 / 系统管理）样式：移植自 next-app-starter。
import "@/styles/starter-pages.css";

import { WorkspaceShell } from "@/components/WorkspaceShell";

/**
 * 工作区 layout 挂载 WorkspaceShell（AppShell + PactorShellHost，跨导航常驻）。
 * 具体 URL 是否合法由 [...slug] page 在服务端用装配路由表校验。
 */
export default function WorkspaceLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <WorkspaceShell />
      {children}
    </>
  );
}
