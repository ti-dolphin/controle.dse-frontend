import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint({
      include: ["src/**/*.ts", "src/**/*.tsx"], // Verifica arquivos .ts e .tsx
      exclude: ["node_modules/**", "dist/**"],
      failOnError: true, // Faz o build falhar se houver erros de linting
    }),
  ],
  build: {
    minify: 'esbuild',
  },
  esbuild: {
    keepNames: true,
    minifyIdentifiers: false,
  },
});
