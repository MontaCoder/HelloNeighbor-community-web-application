// vite.config.ts
import { defineConfig } from "file:///workspaces/HelloNeighbor-community-web-application/node_modules/vite/dist/node/index.js";
import react from "file:///workspaces/HelloNeighbor-community-web-application/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///workspaces/HelloNeighbor-community-web-application/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "/workspaces/HelloNeighbor-community-web-application";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    // Only enable minification in production
    minify: mode === "production" ? "esbuild" : false,
    // Configure chunk size optimization
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"]
          // Remove the problematic UI chunk configuration
        }
      }
    },
    // Enable source maps only in development
    sourcemap: mode === "development",
    // Optimize chunk size
    chunkSizeWarningLimit: 1e3
  },
  // Optimize dependency pre-bundling
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "@tanstack/react-query"]
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvd29ya3NwYWNlcy9IZWxsb05laWdoYm9yLWNvbW11bml0eS13ZWItYXBwbGljYXRpb25cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi93b3Jrc3BhY2VzL0hlbGxvTmVpZ2hib3ItY29tbXVuaXR5LXdlYi1hcHBsaWNhdGlvbi92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vd29ya3NwYWNlcy9IZWxsb05laWdoYm9yLWNvbW11bml0eS13ZWItYXBwbGljYXRpb24vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIG1vZGUgPT09ICdkZXZlbG9wbWVudCcgJiYgY29tcG9uZW50VGFnZ2VyKCksXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgLy8gT25seSBlbmFibGUgbWluaWZpY2F0aW9uIGluIHByb2R1Y3Rpb25cbiAgICBtaW5pZnk6IG1vZGUgPT09ICdwcm9kdWN0aW9uJyA/ICdlc2J1aWxkJyA6IGZhbHNlLFxuICAgIC8vIENvbmZpZ3VyZSBjaHVuayBzaXplIG9wdGltaXphdGlvblxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICB2ZW5kb3I6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICAvLyBSZW1vdmUgdGhlIHByb2JsZW1hdGljIFVJIGNodW5rIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAvLyBFbmFibGUgc291cmNlIG1hcHMgb25seSBpbiBkZXZlbG9wbWVudFxuICAgIHNvdXJjZW1hcDogbW9kZSA9PT0gJ2RldmVsb3BtZW50JyxcbiAgICAvLyBPcHRpbWl6ZSBjaHVuayBzaXplXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxuICB9LFxuICAvLyBPcHRpbWl6ZSBkZXBlbmRlbmN5IHByZS1idW5kbGluZ1xuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJywgJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSddLFxuICB9LFxufSkpOyJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlUsU0FBUyxvQkFBb0I7QUFDeFcsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHVCQUF1QjtBQUhoQyxJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWEsQ0FBQyxFQUFFLEtBQUssT0FBTztBQUFBLEVBQ3pDLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixTQUFTLGlCQUFpQixnQkFBZ0I7QUFBQSxFQUM1QyxFQUFFLE9BQU8sT0FBTztBQUFBLEVBQ2hCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBLElBRUwsUUFBUSxTQUFTLGVBQWUsWUFBWTtBQUFBO0FBQUEsSUFFNUMsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osUUFBUSxDQUFDLFNBQVMsYUFBYSxrQkFBa0I7QUFBQTtBQUFBLFFBRW5EO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUEsV0FBVyxTQUFTO0FBQUE7QUFBQSxJQUVwQix1QkFBdUI7QUFBQSxFQUN6QjtBQUFBO0FBQUEsRUFFQSxjQUFjO0FBQUEsSUFDWixTQUFTLENBQUMsU0FBUyxhQUFhLG9CQUFvQix1QkFBdUI7QUFBQSxFQUM3RTtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
