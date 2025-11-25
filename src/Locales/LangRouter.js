/**
 * LangRouter - A Proxy-based locale routing system
 * Inspired by Seyfert's locale system (https://github.com/tiramisulabs/seyfert)
 * @param {string} userLocale - The user's locale
 * @param {string} defaultLang - The default language to fall back to
 * @param {Object} langs - Object containing all loaded languages
 * @returns {Function} A proxy factory function
 */
function LangRouter(userLocale, defaultLang, langs) {
  /**
   * Creates a proxy for nested locale access
   * @param {string[]} route - The current path in the locale object
   * @param {any[]} args - Arguments for function-type locale values
   * @returns {Proxy} A proxy object for chained access
   */
  function createProxy(route = [], args = []) {
    const noop = () => {};

    return new Proxy(noop, {
      get: (_, key) => {
        if (key === "get") {
          /**
           * Gets the value from a specific locale
           * @param {string} locale - The locale to get the value from
           * @returns {any} The locale value
           */
          function getValue(locale) {
            if (typeof locale === "undefined") {
              throw new Error("Undefined locale");
            }

            let value = langs[locale];
            if (typeof value === "undefined") {
              throw new Error(`Locale "${locale}" not found`);
            }

            for (const i of route) {
              value = value[i];
            }

            return value;
          }

          return (locale) => {
            let result;
            try {
              result = getValue(locale ?? userLocale);
            } catch {
              result = getValue(defaultLang);
            }

            const value =
              typeof result === "function" ? result(...args) : result;
            return value;
          };
        }

        return createProxy([...route, key], args);
      },

      apply: (_, __, applyArgs) => {
        return createProxy(route, applyArgs);
      },
    });
  }

  return createProxy;
}

module.exports = { LangRouter };
