import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
    /* @react-three/rapier ships a WASM binary (@dimforge/rapier3d-compat)
       that esbuild's dependency pre-bundler mishandles — the .wasm never
       gets fetched and the Physics world hangs forever waiting on it.
       Excluding it forces the browser to load it natively instead. */
    exclude: ['@react-three/postprocessing', '@react-three/rapier', '@dimforge/rapier3d-compat'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'motion-vendor': ['framer-motion', 'gsap'],
        },
      },
    },
  },
});
