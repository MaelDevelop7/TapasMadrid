import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/TapasMadrid/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'],
      manifest: {
        name: 'TapasRadar',
        short_name: 'TapasRadar',
        start_url: '/TapasMadrid/',
        display: 'standalone',
        background_color: '#fffbe6',
        theme_color: '#cc0000',
        icons: [
          {
            src: 'iconapp.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'iconapp.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
