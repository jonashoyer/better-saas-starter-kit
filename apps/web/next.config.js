const nextTranslate = require('next-translate');
const i18n = require('./i18n');
const { withSentryConfig } = require("@sentry/nextjs");

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const isProd = process.env.NODE_ENV === 'production';

/**
 * @type {import('next').NextConfig}
 */
module.exports = withBundleAnalyzer(
  withSentryConfig(
    nextTranslate({
      reactStrictMode: true,
      i18n: {
        locales: i18n.locales,
        defaultLocale: i18n.defaultLocale,
      },
      typescript: {
        ignoreBuildErrors: true,
      },
      sentry: {
        hideSourceMaps: true,
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
    }), {
    silent: true,
  }
  )
);
