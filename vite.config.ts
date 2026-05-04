import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isSsr = process.env.SSR_BUILD === '1';
  return ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // 只代理这一个接口
      "/api/uploadImage": {
        target: "https://us-central1-<project-id>.cloudfunctions.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/uploadImage$/, "/uploadImage"),
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  build: isSsr
    ? {}
    : {
        rollupOptions: {
          output: {
            manualChunks: {
              framer: ['framer-motion'],
              lucide: ['lucide-react'],
              radix: [
                '@radix-ui/react-navigation-menu',
                '@radix-ui/react-dialog',
                '@radix-ui/react-accordion',
                '@radix-ui/react-tabs',
              ],
            },
          },
        },
      },

  ssr: {
    noExternal: ['react-helmet-async'],
  },
});
});