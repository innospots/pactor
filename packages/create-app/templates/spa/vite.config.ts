import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // pactor 依赖经 link: 指向本仓 packages/*，去重避免多份 React 实例
    dedupe: ["react", "react-dom", "react-router-dom"],
  },
  server: {
    port: 9012,
    strictPort: true,
  },
});
