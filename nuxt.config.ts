// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Atomic Ambitions'
    }
  },
  modules: ['@nuxt/content', '@nuxt/ui', '@nuxt/eslint'],
  css: ['~~/assets/css/main.css'],
  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  },
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit']
    }
  },
  content: {
    experimental: { nativeSqlite: true },
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 3
        },
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark'
          },
          langs: ['json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'yaml', 'markdown']
        }
      }
    },
    renderer: {
      anchorLinks: true
    }
  }
})