import 'katex/dist/katex.min.css';
import 'pactor-ui/styles.css';
import 'pactor-chat/styles.css';
// 示例自有样式：仅页面壳高度链/外壳皮肤令牌/DSL 页面限宽（见 app.css 头注释）——
// 槽位自定义 UI 的视觉由 pactor-ui/ui 原语与语义令牌承担，删除本导入后仍完整可用
import './app.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
