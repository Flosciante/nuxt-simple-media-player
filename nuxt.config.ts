// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  runtimeConfig: {
    public: {
      jamendoApiUrl: process.env.NUXT_PUBLIC_JAMENDO_API_URL,
      jamendoApiClientKey: process.env.NUXT_PUBLIC_JAMENDO_API_CLIENT_KEY,
    }
  },

  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxt/ui', '@pinia/nuxt']
})
