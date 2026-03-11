
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three", "three-stdlib"],        // 3D alag chunk
          gsap: ["gsap"],                           // Animation alag chunk
          physics: ["@react-three/rapier"],         // Physics alag chunk
          react3f: ["@react-three/fiber", "@react-three/drei"], // R3F alag chunk
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});