import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/', // Explicitly set base path for GitHub Pages
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              // Separate React and React DOM into their own chunk
              'react-vendor': ['react', 'react-dom'],
              // Separate Google GenAI SDK (likely large)
              'genai-vendor': ['@google/genai'],
              // Separate lucide-react icons
              'icons-vendor': ['lucide-react'],
            },
          },
        },
        // Increase chunk size warning limit to 600kb (optional, but helps reduce noise)
        chunkSizeWarningLimit: 600,
      },
    };
});
