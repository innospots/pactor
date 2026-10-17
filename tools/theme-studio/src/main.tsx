import { createPactorApplication } from '@pactor-app/app';
import {
  ChatServicesProvider,
  ConversationStore,
  registerChatComponent,
  type ChatEvent,
  type ChatInput,
  type ChatServices,
  type ChatTransport,
} from '@pactor-app/chat';
// 默认 UI 为 @pactor-app/ui 内置实现，样式表导入为必需步骤
import '@pactor-app/ui/styles.css';
import { StaticDslLoader } from '@pactor-app/resource';
// Chat 一等组件（画廊页 chat 系验收面）的皮肤样式表
import '@pactor-app/chat/styles.css';
// 工作室局部样式微调（须在 ui / chat 样式表之后加载）
import './studio.css';
import { createComponentRegistry } from '@pactor-app/ui/components';
import type { ReactNode } from 'react';

import { createBootstrap } from './bootstrap';
import { AiGenerateButton } from './components/AiGenerateButton';
import { AiThemeDrawer } from './components/AiThemeDrawer';
import { SkinDownloadButton } from './components/SkinDownloadButton';
import { SkinPreviewFrame } from './components/SkinPreviewFrame';
import { ThemePresetList } from './components/ThemePresetList';
import { TokenEditor } from './components/TokenEditor';
import { announceGalleryReady, installGalleryBridge } from './gallery-bridge';
import demoPage from './pages/demo.page.yaml';
import galleryPage from './pages/gallery.page.yaml';
import studioPage from './pages/studio.page.yaml';

// 皮肤注入桥：监听器同步安装（不丢消息）；ready 在 mount 之后发送
installGalleryBridge();

// 本地 DSL：静态加载器直接喂入构建期 import 的页面与模拟 bootstrap
const loader = new StaticDslLoader({
  bootstrap: createBootstrap(),
  pages: {
    studio: studioPage,
    gallery: galleryPage,
    demo: demoPage,
  },
});

// 画廊页 Chat 验收面：预置两条演示消息（Bubble / Message 静态可见），
// transport 为极简 echo（发送后原样回显，验证交互态）
const galleryChatStore = new ConversationStore();
galleryChatStore.appendMessage({
  id: 'demo-user',
  role: 'user',
  status: 'completed',
  parts: [{ type: 'text', content: '这套皮肤的聊天气泡长什么样？' }],
  createdAt: Date.now() - 60_000,
});
galleryChatStore.appendMessage({
  id: 'demo-assistant',
  role: 'assistant',
  status: 'completed',
  parts: [
    {
      type: 'markdown',
      content:
        '就像现在这样——气泡、输入框、按钮都实时跟随左侧的皮肤令牌。试试切换主题或修改 `--bubble-background`。',
    },
  ],
  createdAt: Date.now() - 30_000,
});

const echoTransport: ChatTransport = {
  async *send(input: ChatInput): AsyncIterable<ChatEvent> {
    const messageId = 'echo';
    yield {
      type: 'text.delta',
      messageId,
      delta: `画廊 echo：「${input.text}」`,
      format: 'markdown',
    };
    yield { type: 'message.end', messageId };
  },
};

const chatServices: ChatServices = {
  transport: echoTransport,
  store: galleryChatStore,
};

/** providers 槽（Router 之内、InteractionKit 之外）：向 DSL 页内 Chat 注入聊天服务 */
function ChatProvider({ children }: { children?: ReactNode }) {
  return (
    <ChatServicesProvider value={chatServices}>{children}</ChatServicesProvider>
  );
}

// 工作室页强制 light（编辑的是亮色皮肤令牌，避免"跟随系统"暗色时暗色兜底块
// 压住皮肤的 :root 覆盖）；预览路由（gallery / demo）由预览模式消息控制亮/暗，默认 light
const PREVIEW_ROUTES = ['/gallery', '/demo'];
if (!PREVIEW_ROUTES.includes(window.location.pathname)) {
  document.documentElement.setAttribute('data-pactor-theme', 'light');
}

createPactorApplication({
  appId: 'theme-studio',
  loader,
  locale: 'zh-CN',
  // 内置组件 + Chat/ChatShell（chat 包注册函数）+ 工作室自定义组件
  componentRegistry: () => {
    const registry = createComponentRegistry();
    registerChatComponent(registry);
    registry.register('ThemePresetList', ThemePresetList);
    registry.register('TokenEditor', TokenEditor);
    registry.register('SkinPreviewFrame', SkinPreviewFrame);
    registry.register('SkinDownloadButton', SkinDownloadButton);
    registry.register('AiGenerateButton', AiGenerateButton);
    registry.register('AiThemeDrawer', AiThemeDrawer);
    return registry;
  },
  providers: ChatProvider,
}).mount('#root');

// 预览页挂载完成后向父页面通告 ready（左栏收到后才发送首次皮肤 CSS）
if (PREVIEW_ROUTES.includes(window.location.pathname)) {
  announceGalleryReady();
}
