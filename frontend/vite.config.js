import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-backgrounds',
      closeBundle() {
        try {
          const sourceDir = join(__dirname, 'public', 'backgrounds')
          const targetDir = join(__dirname, '..', 'src', 'main', 'resources', 'static', 'backgrounds')
          
          if (existsSync(sourceDir)) {
            if (!existsSync(targetDir)) {
              mkdirSync(targetDir, { recursive: true })
            }
            
            const files = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg']
            files.forEach(file => {
              const source = join(sourceDir, file)
              const target = join(targetDir, file)
              if (existsSync(source)) {
                copyFileSync(source, target)
              }
            })
          }
        } catch (error) {
          console.warn('Failed to copy backgrounds:', error)
        }
      }
    }
  ],
  build: {
    outDir: '../src/main/resources/static',
    emptyOutDir: false,
    assetsDir: 'assets',
    minify: 'esbuild',
    target: 'es2015',
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react-plotly.js')) {
              return null;
            }
            if (id.includes('plotly.js')) {
              return 'plotly';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler') || id.includes('react-redux') || id.includes('redux') || id.includes('@reduxjs')) {
              return null;
            }
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3621',
        changeOrigin: true,
        secure: false
      }
    }
  }
})


