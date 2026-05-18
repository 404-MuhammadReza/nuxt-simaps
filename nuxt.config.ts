// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: true },
  modules: ['@nuxt/a11y', '@nuxt/eslint', '@nuxt/hints', '@pinia/nuxt', '@vueuse/nuxt', 'nuxt-svgo'],
  css: ['~/assets/css/base.css'],
  runtimeConfig: {
    backendUrl: '',
    public: { googleApiKey: '', googleMapId: '' }
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Office Maps - PT Timah Industri',
      meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  },
})
