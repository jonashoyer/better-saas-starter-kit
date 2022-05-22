module.exports = {
  locales: ['en'],
  defaultLocale: 'en',
  pages: {
    '*': ['common', 'dialog'],
    '/': ['home', 'pricing'],
    '/dashboard': ['home', 'pricing'],
    '/settings': ['settings', 'pricing'],
  },
  async loadLocaleFrom(lang, ns) {
    return import(`./locales/${lang}/${ns}.yml`).then((m) => m.default)
  }
}