module.exports = {
  locales: ['en'],
  defaultLocale: 'en',
  pages: {
    '*': ['common', 'dialog'],
    '/': ['home', 'pricing'],
    '/dashboard': ['home', 'pricing'],
    '/settings': ['settings', 'pricing'],
  },
  loadLocaleFrom(lang, ns) {
    return require(`locales/${lang}/${ns}.yml`);
  }
}