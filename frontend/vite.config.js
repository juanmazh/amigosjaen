import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: '/',
    plugins: [
      react(),
      tailwindcss(),
    ],
    css: {
      preprocessorOptions: {
        css: {
          charset: false,
        },
      },
    },
    server: {
      hmr: true
    },
    define: {
      'process.env': env
    },
    build: {
      outDir: 'dist'
    }
  };
});