import 'antd/dist/reset.css';
import './app.css';

import { ChatLayout, ChatView, ConversationStore } from 'pactor-chat';
import { StrictMode, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

import { createChatCapabilities } from './capabilities';
import { createMockAiTransport } from './mock-ai';
import { createChatSafeRegistry } from './safe-registry';

function App() {
  // store / transport / 白名单在会话内保持稳定，只创建一次
  const store = useMemo(() => new ConversationStore(), []);
  const transport = useMemo(() => createMockAiTransport(), []);
  const safeRegistry = useMemo(() => createChatSafeRegistry(), []);
  const capabilities = useMemo(() => createChatCapabilities(), []);

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
      />
    </ChatLayout>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
