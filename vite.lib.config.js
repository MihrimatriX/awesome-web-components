import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist-lib",
    lib: {
      entry: "src/index.js",
      name: "MihrimatrixAwesome",
      fileName: (format) =>
        `mihrimatrix-awesome.${format === "es" ? "es.js" : "umd.cjs"}`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "three"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "jsxRuntime",
          three: "THREE",
        },
      },
    },
  },
});
