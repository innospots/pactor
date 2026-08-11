import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import pactor from 'pactor-vite-plugin';

export default defineConfig({
  plugins: [react(), pactor()],
  server: {
    port: 5199,
    strictPort: true,
  },
});
