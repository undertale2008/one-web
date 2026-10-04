import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { feedsPlugin } from "./scripts/vite-plugin-feeds";
import { postsPlugin } from "./scripts/vite-plugin-posts";

export default defineConfig({
  plugins: [react(), tailwindcss(), postsPlugin(), feedsPlugin()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true,
  },
});
