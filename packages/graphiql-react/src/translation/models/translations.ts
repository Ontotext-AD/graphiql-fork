/**
 * Represents a flat key-value pair translation structure.
 * The keys can either be dot-separated paths or nested objects.
 *
 * @example
 * ```typescript
 * const translation: Translation = {
 *   "editor.title": "Editor",
 *   "editor": {
 *     "description": "This is the editor"
 *   }
 * };
 * ```
 */
export interface Translation {
  [key: string]: string | Translation;
}

/**
 * Represents a collection of translations for multiple languages,
 * using a flat structure with dot-separated keys or nested objects.
 *
 * @example
 * ```typescript
 * const translations: Translations = {
 *   en: {
 *     "editor.title": "Editor",
 *     "editor": {
 *       "description": "This is the editor"
 *     }
 *   },
 *   fr: {
 *     "editor.title": "Éditeur",
 *     "editor": {
 *       "description": "C'est l'éditeur"
 *     }
 *   }
 * };
 * ```
 */
export interface Translations {
  [language: string]: Translation;
}
