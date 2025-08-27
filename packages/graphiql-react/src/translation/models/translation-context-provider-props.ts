import type { Translations } from './translations';

export interface TranslationContextProviderProps {
  /**
   * Determined the language that has to be used.
   */
  selectedLanguage?: string
  
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
  translations?: Translations;
}
