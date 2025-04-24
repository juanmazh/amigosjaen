import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(async () => ({
  plugins: [
    react(),
    tailwindcss(),
  ],
  css: {
    preprocessorOptions: {
      css: {
        charset: false, // Evita problemas con el tipo MIME
      },
    },
  },
}));