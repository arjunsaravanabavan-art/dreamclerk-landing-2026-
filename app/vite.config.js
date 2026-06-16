import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import seoInject from './vite.seoPlugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [seoInject(), react()],
})
