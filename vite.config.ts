// vite.config.ts
import { defineConfig } from "vite";
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "notification-service-worker",
      fileName: "notification-service-worker",
      formats: ["es", "cjs"],
    },
    outDir: "dist",
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [dts()],
});
