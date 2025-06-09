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
    //No funciona HMR, no se porque, pero no afecta al desarrollo demasiado
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