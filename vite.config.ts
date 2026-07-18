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
        "/api/uploadImage": {
          target: "https://us-central1-<project-id>.cloudfunctions.net",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/uploadImage$/, "/uploadImage"),
        },
      },
    },
    
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    // 🚀 新增 1：生产环境自动剔除 console.log 和 debugger，免费减小 JS 体积
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    
    build: isSsr
      ? {
          // SSR 预渲染必须与客户端构建使用相同的资源命名，否则预渲染 HTML
          // 中的 <img src> 会指向不存在的 /assets/xxx.webp（客户端在 /assets/webp/）
          rollupOptions: {
            output: {
              assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
            },
          },
        }
      : {
          // 🚀 新增 2：强制开启 CSS 代码分割（默认是 true，但显式声明确保生效）
          cssCodeSplit: true, 
          // 🚀 新增 3：优化打包产物名称，防止缓存失效
          rollupOptions: {
            output: {
              chunkFileNames: 'assets/js/[name]-[hash].js',
              entryFileNames: 'assets/js/[name]-[hash].js',
              assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
              manualChunks: {
                // 1. React 核心（极少变动，最适合让浏览器长期缓存 1 年）
                'react-core': ['react', 'react-dom', 'react-router-dom'],
                // 2. 数据库与后端客户端（体积较大，剥离出主包）
                'supabase': ['@supabase/supabase-js'],
                // 3. 动画与 UI 图标库
                'framer': ['framer-motion'],
                'lucide': ['lucide-react'],
                // 4. Radix UI 核心组件
                'radix': [
                  '@radix-ui/react-navigation-menu',
                  '@radix-ui/react-dialog',
                  '@radix-ui/react-accordion',
                  '@radix-ui/react-tabs',
                  '@radix-ui/react-slot', // 通常 radix 强依赖 slot，可以顺手加上
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