import { useSidebarDrawer } from 'pactor-chat';
import { Plus } from 'lucide-react';

import { MOCK_SESSIONS } from '../mock-data';

/**
 * 演示侧栏（AppShell 的 sidebar 插槽内容）：「新建对话」+ mock 历史会话列表。
 * 纯演示状态——消息存在单一内存 store 中，切换会话只改 active 高亮
 * 与会话 id（locationKey），不加载/保存历史消息。
 * 点击导航后经 useSidebarDrawer()?.close() 关闭移动端抽屉（桌面为 no-op）。
 */
export function DemoSidebar({
  activeSessionId,
  onSelectSession,
  onNewSession,
}: {
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
}) {
  const drawer = useSidebarDrawer();

  return (
    <div className="demo-sidebar">
      <button
        type="button"
        className="demo-sidebar__new"
        onClick={() => {
          onNewSession();
          drawer?.close();
        }}
      >
        <Plus size={15} />
        新建对话
      </button>
      <div className="demo-sidebar__section">历史会话</div>
      <ul className="demo-sidebar__list">
        {MOCK_SESSIONS.map((session) => (
          <li key={session.id}>
            <button
              type="button"
              className={`demo-sidebar__item${
                session.id === activeSessionId ? ' demo-sidebar__item--active' : ''
              }`}
              onClick={() => {
                onSelectSession(session.id);
                drawer?.close();
              }}
            >
              {session.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
