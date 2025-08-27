import type { TranslationService } from '../services/translation-service';

/**
 * Type definition for the {@link TranslationContext}, which holds all related language data.
 */
export type TranslationContextType = {
  /**
   * The currently selected language.
   */
  currentLanguage: string;

  /**
   * An array of all supported languages.
   */
  supportedLanguages: string[];

  /**
   * Sets the currently selected language.
   */
  setCurrentLanguage: (language: string) => void;

  /**
   * Sets the list of all supported languages.
   */
  setSupportedLanguages: (languages: string[]) => void;

  /**
   * The translation service used for text translations.
   */
  translationService: TranslationService;
};
