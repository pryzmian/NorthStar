const fs = require("node:fs");
const path = require("node:path");
const { LangRouter } = require("./LangRouter");

/**
 * LangsHandler - A handler for managing multiple language files
 * Inspired by Seyfert's locale system (https://github.com/tiramisulabs/seyfert)
 */
class LangsHandler {
  constructor() {
    /** @type {Object<string, Object>} Loaded language values */
    this.values = {};
    /** @type {Object<string, string>} Paths to language files for reloading */
    this._paths = {};
    /** @type {string|undefined} Default language code */
    this.defaultLang = undefined;
    /** @type {Array<[string, string[]]>} Locale aliases */
    this.aliases = [];
  }

  /**
   * Filters files to only load valid language files
   * @param {string} filePath - Path to the file
   * @returns {boolean} Whether the file should be loaded
   */
  filter(filePath) {
    return (
      filePath.endsWith(".js") ||
      filePath.endsWith(".json") ||
      (filePath.endsWith(".ts") && !filePath.endsWith(".d.ts"))
    );
  }

  /**
   * Gets the locale code from aliases
   * @param {string} locale - The locale to look up
   * @returns {string} The resolved locale code
   */
  getLocale(locale) {
    const found = this.aliases.find(([_, aliases]) =>
      aliases.includes(locale)
    );
    return found ? found[0] : locale;
  }

  /**
   * Gets a specific key from a language
   * @param {string} lang - The language code
   * @param {string} message - The dot-notation path to the message
   * @returns {string|undefined} The message value or undefined
   */
  getKey(lang, message) {
    let value = this.values[lang];

    try {
      for (const i of message.split(".")) {
        value = value[i];
      }
    } catch {
      return undefined;
    }

    if (typeof value !== "string") {
      return undefined;
    }

    return value;
  }

  /**
   * Gets a LangRouter for accessing locale strings
   * @param {string} userLocale - The user's locale
   * @returns {Proxy} A LangRouter proxy for accessing locale strings
   */
  get(userLocale) {
    const locale = this.getLocale(userLocale);
    return LangRouter(locale, this.defaultLang ?? locale, this.values)();
  }

  /**
   * Recursively gets all files in a directory
   * @param {string} dir - The directory to search
   * @returns {Promise<string[]>} Array of file paths
   */
  async getFiles(dir) {
    const files = [];
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await this.getFiles(fullPath)));
      } else if (this.filter(fullPath)) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Loads a single language file
   * @param {string} filePath - Path to the language file
   * @returns {Promise<{name: string, file: Object, path: string}>}
   */
  async loadFile(filePath) {
    const file = require(filePath);
    return {
      name: path.basename(filePath),
      file: file,
      path: filePath,
    };
  }

  /**
   * Parses a loaded language file
   * @param {{name: string, file: Object, path: string}} langInstance
   */
  parse(langInstance) {
    const oldLocale =
      langInstance.name.split(".").slice(0, -1).join(".") || langInstance.name;
    const result = this.onFile(oldLocale, langInstance);

    if (!result) return;

    if (langInstance.path) {
      this._paths[result.locale] = langInstance.path;
    }

    this.values[result.locale] = result.file;
  }

  /**
   * Loads all language files from a directory
   * @param {string} dir - The directory containing language files
   * @returns {Promise<void>}
   */
  async load(dir) {
    const files = await this.getFiles(dir);

    for (const filePath of files) {
      const loaded = await this.loadFile(filePath);
      this.parse(loaded);
    }
  }

  /**
   * Manually sets language instances
   * @param {Array<{name: string, file: Object, path?: string}>} instances
   */
  set(instances) {
    for (const instance of instances) {
      this.parse(instance);
    }
  }

  /**
   * Reloads a specific language
   * @param {string} lang - The language code to reload
   * @returns {Promise<Object|null>} The reloaded language object or null
   */
  async reload(lang) {
    const filePath = this._paths[lang];
    if (!filePath) return null;

    delete require.cache[require.resolve(filePath)];

    const loaded = await this.loadFile(filePath);
    const result = this.onFile(lang, loaded);

    if (!result) return null;

    return (this.values[lang] = result.file);
  }

  /**
   * Reloads all languages
   * @param {boolean} stopIfFail - Whether to stop if a reload fails
   * @returns {Promise<void>}
   */
  async reloadAll(stopIfFail = true) {
    for (const lang in this._paths) {
      try {
        await this.reload(lang);
      } catch (e) {
        if (stopIfFail) throw e;
      }
    }
  }

  /**
   * Processes a loaded file
   * @param {string} locale - The locale code
   * @param {{file: Object}} langInstance - The loaded file instance
   * @returns {{file: Object, locale: string}|false} Processed result or false
   */
  onFile(locale, { file }) {
    // Support both default exports and direct exports
    const content = file.default || file;
    if (typeof content !== "object" || content === null) {
      return false;
    }
    return { file: content, locale };
  }
}

module.exports = { LangsHandler };
