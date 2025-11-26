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
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              // Keep React, React DOM, React Router, React Spring, and Lucide React in main bundle
              // These libraries need React to be available during initialization
              // React Spring tries to set React.Activity, Lucide React needs React.forwardRef
              if (id.includes('node_modules/react') || 
                  id.includes('node_modules/react-dom') ||
                  id.includes('node_modules/react-router') ||
                  id.includes('node_modules/@react-spring') ||
                  id.includes('node_modules/lucide-react')) {
                // Return undefined to put in main bundle
                return undefined;
              }
              
              // Three.js and related 3D libraries
              if (id.includes('node_modules/three') || 
                  id.includes('node_modules/@react-three') ||
                  id.includes('node_modules/maath')) {
                return 'three-vendor';
              }
              
              // Terminal component and its dependencies
              if (id.includes('components/terminal')) {
                return 'terminal';
              }
              
              // 3D effects components
              if (id.includes('components/effects/3D')) {
                return 'effects-3d';
              }
              
              // Other heavy effects
              if (id.includes('components/effects')) {
                return 'effects';
              }
              
              // Code snippets section (has syntax highlighting logic)
              if (id.includes('components/sections/CodeSnippets')) {
                return 'code-snippets';
              }
              
              // All other node_modules go into vendor chunk
              if (id.includes('node_modules')) {
                return 'vendor';
              }
            },
          },
        },
        // Increase chunk size warning limit to 1100kb
        // Three.js is inherently large (~1060kb) but lazy-loaded, so it doesn't affect initial load
        // Gzipped size is reasonable (~300kb)
        chunkSizeWarningLimit: 1100,
      },
    };
});
