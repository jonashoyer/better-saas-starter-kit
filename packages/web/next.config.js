const nextTranslate = require('next-translate');
const i18n = require('./i18n');

module.exports = nextTranslate({
  reactStrictMode: true,
  i18n: {
    locales: i18n.locales,
    defaultLocale: i18n.defaultLocale,
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
