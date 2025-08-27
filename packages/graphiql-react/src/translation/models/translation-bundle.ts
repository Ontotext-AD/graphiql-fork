import type { Translation } from './translations';

/**
 * Class representing a bundle of translations.
 */
export class TranslationBundle {
  /**
   * Stores the flattened translation key-value pairs.
   *
   * Example:
   * {
   *   "graphiql.editor.btn.headers.label": "Headers"
   * }
   */
  translationBundle: Record<string, string>;

  /**
   * Creates a new TranslationBundle instance.
   * @param {Record<string, string | Translation>} translationBundle - The initial translation bundle.
   */
  constructor(translationBundle: Record<string, string | Translation>) {
    this.translationBundle = this.flattenObject(translationBundle);
  }

  /**
   * Retrieves a translation string by key.
   *
   * @param {string} key - The translation key.
   * @returns {string | undefined} The translated string, or undefined if the key is not found.
   */
  getTranslation(key: string): string | undefined {
    return this.translationBundle[key];
  }

  /**
   * Merges a new translation bundle into the existing one.
   *
   * @param {Record<string, string | Translation>} translationBundle - The translation bundle to merge.
   */
  merge(translationBundle: Record<string, string | Translation>) {
    this.translationBundle = {
      ...this.translationBundle,
      ...this.flattenObject(translationBundle),
    };
  }

  /**
   * Flattens a nested translation object into a key-value map.
   *
   * @param {any} obj - The object to flatten.
   * @param {string} [prefix=''] - The prefix for nested keys.
   * @returns {Record<string, string>} The flattened object.
   *
   * @example
   * If the <code>obj</code> is:
   * ```json
   * {
   *   "editor": {
   *     "btn": {
   *       "headers": {
   *         "label": "Headers"
   *       }
   *     }
   *   }
   * }
   * ```
   * then the result is:
   * ```json
   * {
   *   "editor.btn.headers.label": "Headers"
   * }
   * ```
   */
  private flattenObject(obj: any, prefix = ''): Record<string, string> {
    const result: Record<string, string> = {};
    for (const key in obj) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (
        typeof obj[key] === 'object' &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        Object.assign(result, this.flattenObject(obj[key], newKey));
      } else {
        result[newKey] = obj[key] as string;
      }
    }
    return result;
  }
}
