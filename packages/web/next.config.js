const nextTranslate = require('next-translate')

module.exports = nextTranslate({
  reactStrictMode: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {

    config.module.rules.push(
      {
        test: /\.ya?ml$/,
        type: 'json',
        use: 'yaml-loader'
      },
    )

    return config
  },
})
