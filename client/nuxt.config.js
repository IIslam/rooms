const pkg = require('./package')

const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const webpack = require('webpack')

module.exports = {
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config.output.filename('[name].[hash].js').end()
    }
  },
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#8b0000' },
  auth: {
    redirect: {
      login: '/auth/login'
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/user/login',
            method: 'post',
            propertyName: 'meta.token'
          },
          user: {
            url: '/user',
            method: 'get'
          },
          logout: {
            url: '/user/logout',
            method: 'post',
            propertyName: 'data'
          }
        }
      }
    }
  },
  /*
   ** Global CSS
   */
  css: ['~/assets/style/app.styl'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/mixins/user.js',
    '@/plugins/api.js',
    '@/plugins/axios.js'
  ],

  /*
   ** Nuxt.js modules
   */
  router: {
    middleware: []
  },
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa',
    [
      '@nuxtjs/toast',
      {
        duration: 1000
      }
    ],

    [
      'nuxt-validate',
      {
        lang: 'es'
      }
    ]
  ],
  toast: {
    position: 'top-right',
    duration: 800
  },
  /*
   ** Axios module configuration
   */
  axios: {
    baseURL: 'http://127.0.0.1:4000/api/',
    redirectError: {
      401: '/auth/login',
      500: '/'
    }
  },

  /*
   ** Build configuration
   */
  build: {
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    transpile: ['vuetify/lib'],
    plugins: [
      new VuetifyLoaderPlugin(),
      new webpack.ProvidePlugin({
        _: 'lodash'
      })
    ],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },

    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
