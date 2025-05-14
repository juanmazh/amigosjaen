import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    base: './', // Asegura que las rutas sean relativas
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
    server: {
      hmr: true, // Asegura que HMR esté habilitado
    },
    define: {
      'process.env': env, // Cargar variables de entorno
    },
    build: {
      outDir: 'dist', // Carpeta de salida
    },
  };
});

/**import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(async () => ({
  base: './', // Asegura que las rutas sean relativas
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
  server: {
    hmr: true, // Asegura que HMR esté habilitado
  },
  build: {
    outDir: 'dist', // Carpeta de salida
  },
})); */