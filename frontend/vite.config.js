import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 12003,
    strictPort: true,
    cors: true,
    hmr: {
      host: 'work-2-tttjawtuglcpntpt.prod-runtime.all-hands.dev',
      port: 12003,
      protocol: 'wss',
    },
  },
});