import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Load all environment variables
    const env = loadEnv(mode, process.cwd(), '');

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      // FIX 1: Explicitly tell Vite to name the output folder "dist"
      build: {
        outDir: 'dist',
      },
      define: {
        // FIX 2: Check for ANY of the names we might have used
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.GOOGLE_API_KEY || env.VITE_API_KEY || env.API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.GOOGLE_API_KEY || env.VITE_API_KEY || env.API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});