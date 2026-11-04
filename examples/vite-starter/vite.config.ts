import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import pactor from '@pactor-app/vite-plugin';
import { fileViewerRenderers } from '@file-viewer/vite-plugin';

export default defineConfig({
  plugins: [react(), pactor(), fileViewerRenderers({ copyAssets: true })],
  server: {
    port: 5499,
    strictPort: true,
  },
});
