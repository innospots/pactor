import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import pactor from '@pactor-app/vite-plugin';

export default defineConfig({
  plugins: [react(), pactor()],
  server: {
    port: 5710,
    strictPort: true,
    proxy: {
      // AI 生成代理：本地开发时转发到 wrangler dev（8781）运行的 Worker
      '/api': 'http://localhost:8781',
    },
  },
});
