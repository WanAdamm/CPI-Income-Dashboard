import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => ({
  base: mode === "pages" ? "/CPI-Income-Dashboard/" : "/",
  plugins: [react(), tailwindcss()],
}));
