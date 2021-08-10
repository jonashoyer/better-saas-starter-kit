module.exports = {
  locales: ['en'],
  defaultLocale: 'en',
  pages: {
    '*': ['common', 'dialog'],
    '/': ['home', 'pricing'],
    '/settings': ['settings'],
  },
  async loadLocaleFrom(lang, ns) {
    return import(`./locales/${lang}/${ns}.yml`).then((m) => m.default)
  }
}