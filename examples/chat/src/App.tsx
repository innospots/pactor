import { message } from 'antd';
import {
  ChatServicesProvider,
  ConversationStore,
  registerChatComponent,
  type ChatServices,
} from 'pactor-chat';
import { Registry } from 'pactor-core';
import { createPageRuntime, type ActionHandler } from 'pactor-runtime';
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
import { Header } from './components/Header';
import { MentionListbox } from './components/MentionListbox';
import { ModelSelector } from './components/ModelSelector';
import { PlusMenu } from './components/PlusMenu';
import { downloadMessagesAsMarkdown } from './export-markdown';
import { createMockAiTransport } from './mock-ai';
import { PICKER_CHIP_PREFIX, type PickerKind } from './mock-data';
import { createChatSafeRegistry } from './safe-registry';

/**
 * examples/chat 是"DSL 页面 + 宿主装配"的参考实现（spec:
 * chat-dsl-component / example-chat）：
 *
 * - 聊天页面由 `chat.page.yaml` 声明（vite-plugin-dsl 编译为 PageDsl），
 *   body 是一等组件 `Chat` 节点——左侧菜单、greeting / suggestions 等
 *   标量配置全部在 YAML，菜单交互经 `events.onMenuSelect` + 页面 state
 *   （setState）表达；
 * - 运行时服务（transport / store / safeRegistry / capabilities /
 *   confirm / 附件伪上传 / 提及与 "+" 弹层 / 工具栏槽）经
 *   `ChatServicesProvider` 在根部注入一次，`Chat` 组件从 context 读取；
 * - 宿主只剩应用壳：顶栏 Header（可编辑标题 / 导出 / 明暗切换 / 清空）
 *   与全部弹层仍是 DSL 页面之外的宿主 UI。
 */

/**
 * 宿主槽位 context：工具栏槽内的动态内容（上下文 chips）经 context 读取
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
  // store 为外部自持（顶栏导出 / 清空与「新建对话」动作需要访问），
  // 经 ChatServicesProvider 注入工作区
  const store = useMemo(() => new ConversationStore(), []);
  const transport = useMemo(() => createMockAiTransport(), []);
  const safeRegistry = useMemo(() => createChatSafeRegistry(), []);
  const capabilities = useMemo(() => createChatCapabilities(), []);

  // 页壳状态：主题（写到 app 根的 data-pactor-theme）与会话标题
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [title, setTitle] = useState('新的对话');

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

  // 聊天服务：全部运行时依赖与交互回调经 provider 注入一次（useMemo
  // 保持稳定引用）。附件受控状态由 Chat 组件自持：onAttachFiles 回传
  // （data URL 伪上传）即追加，发送后自动清空
  const chatServices = useMemo<ChatServices>(
    () => ({
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

  // 页面运行时：registerChatComponent 注册 Chat 类型（不覆盖已有注册），
  // chat.page.yaml 经 createPageRuntime 校验并渲染；demo.newSession 是
  // 示例扩展动作（DSL 无法触达宿主 store），由菜单「新建对话」触发
  const runtime = useMemo(() => {
    const components = new Registry<unknown>('ComponentRegistry');
    registerChatComponent(components);
    // demo.newSession 是示例扩展动作（DSL 无法触达宿主 store），
    // 由菜单「新建对话」经 events.onMenuSelect 触发
    const actions = new Registry<ActionHandler>('ActionRegistry');
    actions.register('demo.newSession', () => {
      store.clear();
      setContextChips([]);
      setTitle('新的对话');
      return { ok: true };
    });
    return createPageRuntime(chatPageDsl, { components, actions });
  }, [store]);

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

  return (
    <DemoHostContext.Provider
      value={{
        chips: contextChips,
        onRemoveChip: (id) =>
          setContextChips((prev) => prev.filter((chip) => chip.id !== id)),
      }}
    >
      <ChatServicesProvider value={chatServices}>
        <div className="demo-app" data-pactor-theme={theme === 'dark' ? 'dark' : undefined}>
          {/* 宿主应用壳：顶栏（可编辑标题 / 导出 / 明暗 / 清空）在 DSL 页面之上 */}
          <Header
            title={title}
            onTitleChange={setTitle}
            theme={theme}
            onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            onExport={handleExport}
            onClear={handleClear}
          />
          {/* DSL 页面：Chat 组件自持 AppShell 侧栏（menu 数据驱动）+ 工作区 */}
          <main className="demo-main">{runtime.render()}</main>

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
      </ChatServicesProvider>
    </DemoHostContext.Provider>
  );
}

export default App;
