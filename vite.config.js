import { defineConfig } from 'vite'

export default defineConfig({
  publicDir: 'assets',
  resolve: {
    alias: {
      '/pretext.js': '/node_modules/@chenglou/pretext/dist/layout.js',
    },
  },
})
