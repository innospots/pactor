import { message } from 'antd';
import {
  AppShell,
  ConversationStore,
  createChatWorkspace,
} from 'pactor-chat';
import { Registry } from 'pactor-core';
import { createPageRuntime } from 'pactor-runtime';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { readAsAttachment } from './attachments';
import { createChatCapabilities } from './capabilities';
import chatPageDsl from './chat.page.yaml';
import { CapabilityChip } from './components/CapabilityChip';
import { ContextChips, type ContextChipData } from './components/ContextChips';
import { ContextPickerModal } from './components/ContextPickerModal';
import { DemoSidebar } from './components/DemoSidebar';
import { Header } from './components/Header';
import { MentionListbox } from './components/MentionListbox';
import { ModelSelector } from './components/ModelSelector';
import { PlusMenu } from './components/PlusMenu';
import { downloadMessagesAsMarkdown } from './export-markdown';
import { createMockAiTransport } from './mock-ai';
import { PICKER_CHIP_PREFIX, type PickerKind } from './mock-data';
import { createChatSafeRegistry } from './safe-registry';

/**
 * examples/chat 是"DSL 页面 + 宿主装配"的参考实现（spec: chat-dsl-page /
 * example-chat）：
 *
 * - 聊天页面由 `chat.page.yaml` 声明（vite-plugin-dsl 编译为 PageDsl），
 *   body 是 ChatWorkspace 节点，greeting / suggestions / title 等标量
 *   配置全部在 YAML；
 * - 运行时服务（transport / store / safeRegistry / capabilities /
 *   confirm / 附件伪上传 / 提及与 "+" 弹层 / 工具栏槽）由本文件经
 *   `createChatWorkspace(services)` 闭包注入，组件注册进页面运行时的
 *   组件注册表后以 `createPageRuntime` 渲染；
 * - AppShell + DemoSidebar + Header 仍是 DSL 页面之外的宿主外壳。
 */

/**
 * 宿主槽位 context：createChatWorkspace 只调用一次（组件身份稳定，store
 * 才不会重建），工具栏槽内的动态内容（上下文 chips）经 context 读取
 * 最新宿主状态，而不是把易变的 ReactNode 固化进服务闭包。
 */
interface DemoHost {
  chips: ContextChipData[];
  onRemoveChip: (id: string) => void;
}

const DemoHostContext = createContext<DemoHost | null>(null);

/** Composer 工具栏左槽：能力 chip + 已选上下文 chips（经 context 取最新） */
function ToolbarStartSlot() {
  const host = useContext(DemoHostContext);
  if (!host) {
    return null;
  }
  return (
    <>
      <CapabilityChip />
      <ContextChips chips={host.chips} onRemove={host.onRemoveChip} />
    </>
  );
}

/** 词边界 `@` 提及检测（与包内 Composer 同一规则）：返回 `@` 后 query */
function detectMention(text: string, caret: number): string | null {
  const match = /(?:^|\s)@([^\s@]*)$/.exec(text.slice(0, caret));
  return match ? match[1]! : null;
}

/** 当前 `@` 提及弹层状态 */
interface MentionState {
  query: string;
  rect: DOMRect;
}

function App() {
  // store / transport / 白名单在会话内保持稳定，只创建一次。
  // store 为外部自持（顶栏导出 / 清空需要访问），经服务闭包传给工作区
  const store = useMemo(() => new ConversationStore(), []);
  const transport = useMemo(() => createMockAiTransport(), []);
  const safeRegistry = useMemo(() => createChatSafeRegistry(), []);
  const capabilities = useMemo(() => createChatCapabilities(), []);

  // 页壳状态：主题（写到 app 根的 data-pactor-theme）与会话标题
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [title, setTitle] = useState('新的对话');

  // 侧栏会话状态（纯演示）：active 会话 id 同时作为 AppShell 的
  // locationKey——切换会话即关移动端抽屉。消息在单一内存 store 中，
  // 「新建对话」清空 store；切换历史会话只改高亮，不加载历史消息
  const [activeSessionId, setActiveSessionId] = useState('new-0');
  const sessionSeq = useMemo(() => ({ value: 0 }), []);

  // 已选上下文 chips（"+" 菜单选择器 / `@` 提及选中产生，可移除）
  const [contextChips, setContextChips] = useState<ContextChipData[]>([]);

  // 弹层状态："+" 菜单（锚定）、picker Modal、`@` 提及列表（锚定）
  const [plusRect, setPlusRect] = useState<DOMRect | null>(null);
  const [pickerKind, setPickerKind] = useState<PickerKind | null>(null);
  const [mention, setMention] = useState<MentionState | null>(null);

  // `@` 提及的关闭兜底：Composer 只在仍处于 `@` 语境时回调，
  // 若用户删掉 `@`（不再有回调），这里监听输入事件复检并收起
  useEffect(() => {
    if (!mention) {
      return;
    }
    const handleInput = (event: Event): void => {
      const target = event.target;
      if (!(target instanceof HTMLTextAreaElement)) {
        return;
      }
      const caret = target.selectionStart ?? target.value.length;
      if (detectMention(target.value, caret) === null) {
        setMention(null);
      }
    };
    document.addEventListener('input', handleInput, true);
    return () => document.removeEventListener('input', handleInput, true);
  }, [mention]);

  // 聊天工作区组件：全部运行时服务经工厂闭包注入（只创建一次——组件
  // 身份变化会导致子树重挂载、store 丢失）。附件受控状态由工作区自持：
  // onAttachFiles 回传（data URL 伪上传）即追加，发送后自动清空
  const ChatWorkspace = useMemo(
    () =>
      createChatWorkspace({
        transport,
        store,
        safeRegistry,
        capabilities,
        confirm: ({ name }) =>
          Promise.resolve(window.confirm(`高风险操作「${name}」，确认执行？`)),
        onAttachFiles: (files) => Promise.all(files.map(readAsAttachment)),
        onAttachmentClick: (attachment) => {
          if (attachment.url) {
            window.open(attachment.url, '_blank');
          } else {
            void message.info(`附件「${attachment.name}」无 url（伪上传未产出 data URL）`);
          }
        },
        toolbarStart: <ToolbarStartSlot />,
        toolbarEnd: <ModelSelector />,
        onMentionTrigger: (query, anchorRect) =>
          setMention({ query, rect: anchorRect }),
        onPlusMenu: (anchorRect) =>
          setPlusRect((prev) => (prev ? null : anchorRect)),
      }),
    [store, transport, safeRegistry, capabilities],
  );

  // 页面运行时：ChatWorkspace 注册进组件注册表，chat.page.yaml 经
  // createPageRuntime 校验并渲染
  const runtime = useMemo(() => {
    const components = new Registry<unknown>('ComponentRegistry');
    components.register('ChatWorkspace', ChatWorkspace);
    return createPageRuntime(chatPageDsl, { components });
  }, [ChatWorkspace]);

  const addChip = (label: string): void => {
    setContextChips((prev) => {
      if (prev.some((chip) => chip.label === label)) {
        return prev;
      }
      return [...prev, { id: `${Date.now()}-${prev.length}`, label }];
    });
  };

  const handleExport = (): void => {
    const messages = store.getMessages();
    if (messages.length === 0) {
      void message.info('当前会话还没有消息');
      return;
    }
    downloadMessagesAsMarkdown(title, messages);
    void message.success('已导出 Markdown');
  };

  const handleClear = (): void => {
    store.clear();
    setContextChips([]);
    void message.success('会话已清空');
  };

  const handleNewSession = (): void => {
    store.clear();
    setContextChips([]);
    sessionSeq.value += 1;
    setActiveSessionId(`new-${sessionSeq.value}`);
    setTitle('新的对话');
  };

  return (
    <DemoHostContext.Provider
      value={{
        chips: contextChips,
        onRemoveChip: (id) =>
          setContextChips((prev) => prev.filter((chip) => chip.id !== id)),
      }}
    >
      <div className="demo-app" data-pactor-theme={theme === 'dark' ? 'dark' : undefined}>
        <AppShell
          sidebar={
            <DemoSidebar
              activeSessionId={activeSessionId}
              onSelectSession={setActiveSessionId}
              onNewSession={handleNewSession}
            />
          }
          brand={<span className="demo-brand">Pactor Chat</span>}
          locationKey={activeSessionId}
        >
          <Header
            title={title}
            onTitleChange={setTitle}
            theme={theme}
            onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            onExport={handleExport}
            onClear={handleClear}
          />
          <main className="demo-main">{runtime.render()}</main>
        </AppShell>

        {plusRect && (
          <PlusMenu
            rect={plusRect}
            onClose={() => setPlusRect(null)}
            onOpenPicker={(kind) => setPickerKind(kind)}
          />
        )}
        {pickerKind && (
          <ContextPickerModal
            kind={pickerKind}
            onCancel={() => setPickerKind(null)}
            onConfirm={(entries) => {
              for (const entry of entries) {
                addChip(`${PICKER_CHIP_PREFIX[pickerKind]}：${entry.name}`);
              }
              setPickerKind(null);
            }}
          />
        )}
        {mention && (
          <MentionListbox
            query={mention.query}
            rect={mention.rect}
            onClose={() => setMention(null)}
            onSelect={(name) => addChip(`@${name}`)}
          />
        )}
      </div>
    </DemoHostContext.Provider>
  );
}

export default App;
