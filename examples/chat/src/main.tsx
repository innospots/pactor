import 'antd/dist/reset.css';
import 'katex/dist/katex.min.css';
import 'pactor-chat/styles.css';
import './app.css';

import { message } from 'antd';
import {
  ChatLayout,
  ChatView,
  ConversationStore,
  createChatId,
  type ChatAttachment,
  type ChatSuggestion,
} from 'pactor-chat';
import { StrictMode, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { createChatCapabilities } from './capabilities';
import { createMockAiTransport } from './mock-ai';
import { createChatSafeRegistry } from './safe-registry';

/**
 * examples/chat 同时是 pactor-chat 的"调用方参考实现"（设计决策 D0）：
 * 空状态问候与建议、活动轨迹、消息操作、附件与 Composer 扩展槽的数据
 * 全部由调用方经导出接口注入，包内不发起任何网络请求。
 */

/** 空状态起始建议：点击即以 prompt 走与 Composer 相同的发送路径 */
const SUGGESTIONS: ChatSuggestion[] = [
  { label: '今天天气怎么样', prompt: '今天天气怎么样' },
  { label: '看一下本月报表', prompt: '看一下本月报表' },
  { label: '导出客户数据', prompt: '导出客户数据' },
];

/** 把 File 读成 data URL，产出 ChatAttachment（伪上传：无网络，引用留在内存） */
function readAsAttachment(file: File): Promise<ChatAttachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        id: createChatId('attachment'),
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        url: typeof reader.result === 'string' ? reader.result : undefined,
      });
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function App() {
  // store / transport / 白名单在会话内保持稳定，只创建一次
  const store = useMemo(() => new ConversationStore(), []);
  const transport = useMemo(() => createMockAiTransport(), []);
  const safeRegistry = useMemo(() => createChatSafeRegistry(), []);
  const capabilities = useMemo(() => createChatCapabilities(), []);

  // 受控附件：粘贴 / 拖拽 / 文件选择产出的 File[] 经 onAttachFiles
  // 读为 data URL 伪上传，回写 attachments；发送后清空
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);

  const handleAttachFiles = (files: File[]): void => {
    void Promise.all(files.map(readAsAttachment)).then((created) => {
      setAttachments((prev) => [...prev, ...created]);
    });
  };

  return (
    <ChatLayout title="Pactor Chat 示例（mock AI）">
      <ChatView
        store={store}
        transport={transport}
        safeRegistry={safeRegistry}
        capabilities={capabilities}
        confirm={({ name }) =>
          Promise.resolve(window.confirm(`高风险操作「${name}」，确认执行？`))
        }
        conversationId="conv-demo"
        greeting="你好，我是 Pactor Chat 示例"
        subtitle="数据全部由调用方经接口注入；点击下方建议立即开始"
        suggestions={SUGGESTIONS}
        attachments={attachments}
        onAttachmentsChange={setAttachments}
        onAttachFiles={handleAttachFiles}
        onAttachmentClick={(attachment) => {
          if (attachment.url) {
            window.open(attachment.url, '_blank');
          } else {
            void message.info(`附件「${attachment.name}」无 url（伪上传未产出 data URL）`);
          }
        }}
        toolbarEnd={<span className="demo-composer__chip">模型: demo-mock</span>}
        onMentionTrigger={(query) =>
          void message.info(`@ 提及触发，query: "${query}"（弹层由调用方渲染）`)
        }
        onPlusMenu={() => void message.info('+ 菜单触发（弹层由调用方渲染）')}
        onSend={() => setAttachments([])}
      />
    </ChatLayout>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
