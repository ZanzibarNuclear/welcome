// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/ui', '@nuxt/eslint'],

  nitro: {
    preset: 'cloudflare_pages',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  },
  css: ['~~/assets/css/main.css'],

  ui: {
    colorMode: {
      preference: 'dark',
      fallback: 'dark'
    }
  },

  content: {
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