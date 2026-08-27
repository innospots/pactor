import 'katex/dist/katex.min.css';
import 'pactor-ui/styles.css';
import 'pactor-chat/styles.css';
// 示例自有样式：仅页面壳高度链/外壳皮肤令牌/DSL 页面限宽（见 app.css 头注释）——
// 聊天页交互 UI（header 操作组/模型 chip/上下文弹层）为包内建特性，样式自持
import './app.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
