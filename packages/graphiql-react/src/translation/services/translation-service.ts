import { TranslationBundle } from '../models/translation-bundle';

/**
 * Service for managing translations across multiple languages.
 */
export class TranslationService {
  /**
   * Stores translation bundles for different languages.
   */
  private readonly translationBundles: Record<string, TranslationBundle> = {};

  /**
   * The default language used as a fallback when a translation is not found.
   */
  private readonly defaultLanguage: string;

  /**
   * Initializes the translation service with predefined translation bundles.
   *
   * @param {Record<string, TranslationBundle>} [translationBundles={}] - A record of language codes mapped to their respective translation bundles.
   * @param {string} [defaultLanguage='en'] - The default language to use when a translation is missing.
   *
   * @example
   * ```typescript
   * const service = new TranslationService({
   *   en: new TranslationBundle({ "plugin.btn.show_plugin": "Show {{pluginTitle}}" }),
   *   fr: new TranslationBundle({ "plugin.btn.show_plugin": "Afficher {{pluginTitle}}" })
   * }, 'en');
   * ```
   */
  constructor(
    translationBundles: Record<string, TranslationBundle> = {},
    defaultLanguage = 'en',
  ) {
    this.translationBundles = translationBundles;
    this.defaultLanguage = defaultLanguage;
  }

  /**
   * Retrieves the translated text for a given key in the specified language.
   * Falls back to the default language if the key is not found in the selected language.
   *
   * @param {string} key - The translation key.
   * @param {string} language - The language code (e.g., "en", "fr").
   * @param {Record<string, string>} [params={}] - Optional parameters to replace placeholders in the translation.
   * @returns {string} The translated string, or the key itself if no translation is found.
   *
   * @example
   * ```typescript
   * const service = new TranslationService({
   *   en: new TranslationBundle({ "plugin.btn.show_plugin": "Show {{pluginTitle}}" }),
   *   fr: new TranslationBundle({ "plugin.btn.show_plugin": "Afficher {{pluginTitle}}" })
   * }, 'en');
   *
   * service.translate("plugin.btn.show_plugin", "fr", { pluginTitle: "GraphiQL Explorer" });
   * // Returns: "Afficher GraphiQL Explorer"
   *
   * service.translate("plugin.btn.unknown_key", "fr");
   * // Falls back to English, returns: "plugin.btn.unknown_key"
   * ```
   */
  translate(
    key: string,
    language: string,
    params: Record<string, string> = {},
  ): string {
    const translationBundle = this.translationBundles[language];
    let translation = undefined;

    if (translationBundle) {
      translation = translationBundle.getTranslation(key);
    }

    // Fallback to the default language if translation not found
    translation ||=
      this.translationBundles[this.defaultLanguage]?.getTranslation(key);

    return translation ? this.applyParameters(translation, params) : key;
  }

  /**
   * Replaces placeholders in a translation string with actual parameter values.
   *
   * @param {string} translation - The translation string with placeholders (e.g., "Show {{pluginTitle}}").
   * @param {Record<string, string>} [parameters={}] - The key-value pairs for replacing placeholders.
   * @returns {string} The translation with placeholders replaced.
   *
   * @example
   * ```typescript
   * const service = new TranslationService({
   *   en: new TranslationBundle({ "plugin.btn.show_plugin": "Show {{pluginTitle}}" })
   * }, 'en');
   *
   * service.translate("plugin.btn.show_plugin", "en", { pluginTitle: "GraphiQL Explorer" });
   * // Returns: "Show GraphiQL Explorer"
   * ```
   */
  private applyParameters(
    translation: string,
    parameters: Record<string, string> = {},
  ): string {
    if (!parameters || Object.keys(parameters).length === 0) {
      return translation;
    }

    let filledTranslation = translation;
    for (const key in parameters) {
      filledTranslation = filledTranslation.replaceAll(
        `{{${key}}}`,
        parameters[key],
      );
    }
    return filledTranslation;
  }

  /**
   * Retrieves the list of supported language codes.
   *
   * @returns {string[]} An array of supported language codes.
   *
   * @example
   * ```typescript
   * const service = new TranslationService({
   *   en: new TranslationBundle({ "plugin.btn.show_plugin": "Show {{pluginTitle}}" }),
   *   fr: new TranslationBundle({ "plugin.btn.show_plugin": "Afficher {{pluginTitle}}" })
   * }, 'en');
   *
   * service.getSupportedLanguages(); // Returns: ["en", "fr"]
   * ```
   */
  getSupportedLanguages(): string[] {
    return Object.keys(this.translationBundles);
  }
}
