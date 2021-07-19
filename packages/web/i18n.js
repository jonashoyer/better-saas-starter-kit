module.exports = {
  locales: ['en'],
  defaultLocale: 'en',
  pages: {
    '*': ['common'],
    '/': ['home'],
  },
  async loadLocaleFrom(lang, ns) {
    return import(`./locales/${lang}/${ns}.yml`).then((m) => m.default)
  }
}