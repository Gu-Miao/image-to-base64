import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import path from 'node:path'

export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [
    createHtmlPlugin({
      minify: mode === 'production',
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        nested: path.resolve(__dirname, 'base64_to_image.html'),
      },
    },
  },
}))
