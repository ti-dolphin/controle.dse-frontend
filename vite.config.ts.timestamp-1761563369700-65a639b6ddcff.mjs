// vite.config.ts
import { defineConfig } from "file:///C:/Users/leoro/Documents/Projetos/Dolphin/controle.dse-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/leoro/Documents/Projetos/Dolphin/controle.dse-frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    react()
    // eslint({
    //   include: ["src/**/*.ts", "src/**/*.tsx"], // Verifica arquivos .ts e .tsx
    //   exclude: ["node_modules/**", "dist/**"],
    //   failOnError: true, // Faz o build falhar se houver erros de linting
    // }),
  ],
  build: {
    minify: "esbuild"
  },
  esbuild: {
    keepNames: true,
    minifyIdentifiers: false
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxsZW9yb1xcXFxEb2N1bWVudHNcXFxcUHJvamV0b3NcXFxcRG9scGhpblxcXFxjb250cm9sZS5kc2UtZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGxlb3JvXFxcXERvY3VtZW50c1xcXFxQcm9qZXRvc1xcXFxEb2xwaGluXFxcXGNvbnRyb2xlLmRzZS1mcm9udGVuZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvbGVvcm8vRG9jdW1lbnRzL1Byb2pldG9zL0RvbHBoaW4vY29udHJvbGUuZHNlLWZyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgZXNsaW50IGZyb20gXCJ2aXRlLXBsdWdpbi1lc2xpbnRcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIC8vIGVzbGludCh7XHJcbiAgICAvLyAgIGluY2x1ZGU6IFtcInNyYy8qKi8qLnRzXCIsIFwic3JjLyoqLyoudHN4XCJdLCAvLyBWZXJpZmljYSBhcnF1aXZvcyAudHMgZSAudHN4XHJcbiAgICAvLyAgIGV4Y2x1ZGU6IFtcIm5vZGVfbW9kdWxlcy8qKlwiLCBcImRpc3QvKipcIl0sXHJcbiAgICAvLyAgIGZhaWxPbkVycm9yOiB0cnVlLCAvLyBGYXogbyBidWlsZCBmYWxoYXIgc2UgaG91dmVyIGVycm9zIGRlIGxpbnRpbmdcclxuICAgIC8vIH0pLFxyXG4gIF0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIG1pbmlmeTogJ2VzYnVpbGQnLFxyXG4gIH0sXHJcbiAgZXNidWlsZDoge1xyXG4gICAga2VlcE5hbWVzOiB0cnVlLFxyXG4gICAgbWluaWZ5SWRlbnRpZmllcnM6IGZhbHNlLFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTZYLFNBQVMsb0JBQW9CO0FBQzFaLE9BQU8sV0FBVztBQUlsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBTVI7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxXQUFXO0FBQUEsSUFDWCxtQkFBbUI7QUFBQSxFQUNyQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
