// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  runtimeConfig: {
    public: {
      jamendoApiUrl: process.env.NUXT_PUBLIC_JAMENDO_API_URL,
      jamendoApiClientKey: process.env.NUXT_PUBLIC_JAMENDO_API_CLIENT_KEY,
    }
  },

  fontMetrics: {
    fonts: ['Nerko One'],
  },

  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      'Nerko+One': [100, 200, 300, 400, 500, 600, 700]
    },
  },

  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt', '@nuxtjs/google-fonts']
})
