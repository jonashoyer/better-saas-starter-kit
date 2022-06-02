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
  webpack(config, { isServer }) {

    if (isServer)
      config.externals.push('_http_common');

    config.module.rules.push(
      {
        test: /\.ya?ml$/,
        type: 'json',
        use: 'yaml-loader'
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      }
    )

    return config
  },
})
