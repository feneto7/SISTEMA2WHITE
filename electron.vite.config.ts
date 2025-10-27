import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist/main',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist/preload',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          format: 'cjs',
          entryFileNames: 'index.cjs'
        }
      }
    }
  },
  renderer: {
    plugins: [react()],
    build: {
      outDir: 'dist/renderer',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info']
        }
      },
      // Code splitting otimizado
      rollupOptions: {
        output: {
          manualChunks: {
            // Separar vendor libraries
            vendor: ['react', 'react-dom'],
            // Separar componentes por página
            pages: [
              './src/renderer/pages/Home/Home',
              './src/renderer/pages/Products/Products',
              './src/renderer/pages/Clients/Clients'
            ],
            // Separar componentes modais
            modals: [
              './src/renderer/components/NewProductModal',
              './src/renderer/components/NewClientModal'
            ]
          },
          // Otimizar nomes dos chunks
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
            return `js/[name]-[hash].js`;
          },
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      },
      // Otimizações de build
      target: 'esnext',
      cssCodeSplit: true,
      sourcemap: false, // Desabilitar sourcemaps em produção para reduzir tamanho
      reportCompressedSize: false // Desabilitar relatório de tamanho para builds mais rápidos
    },
    resolve: {
      alias: {
        '@renderer': '/src/renderer',
        '@main': '/src/main',
        '@styles': '/src/renderer/styles',
        '@pages': '/src/renderer/pages',
        '@components': '/src/renderer/components'
      }
    },
    // Otimizações de desenvolvimento
    optimizeDeps: {
      include: ['react', 'react-dom'],
      exclude: ['electron']
    },
    // Configurações de servidor para desenvolvimento mais rápido
    server: {
      hmr: {
        overlay: false // Desabilitar overlay de erros para melhor performance
      }
    }
  }
});


