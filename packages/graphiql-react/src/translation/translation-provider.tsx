import React, { useState, useEffect } from 'react';
import { TranslationService } from './services/translation-service';
import { TranslationContext } from './translation-context';

import en from '../assets/i18n/en.json';
import fr from '../assets/i18n/fr.json';
import { TranslationBundle } from './models/translation-bundle';
import type { Translations } from './models/translations';

/**
 * TranslationProvider component is responsible for managing the translation state and providing the translation service
 * to the application through context.
 *
 * It provides the following context values:
 * - `currentLanguage`: The language currently selected.
 * - `supportedLanguages`: An array of supported languages.
 * - `setCurrentLanguage`: A function to set the current language.
 * - `setSupportedLanguages`: A function to update supported languages.
 * - `translationService`: An instance of `TranslationService` for translating strings.
 *
 * @param {Object} props - Component props.
 * @param {Translations} [props.translations] - Optional external translation bundles to merge with the internal ones.
 * @param {string} [props.selectedLanguage] - The initially selected language, defaults to 'en'.
 *
 * @example
 * ```typescript
 * <TranslationProvider selectedLanguage="fr" translations={translations}>
 *   <App />
 * </TranslationProvider>
 * ```
 */
export const TranslationProvider = (props: any) => {
  const translationService = new TranslationService(
    getTranslationBundles(props.translations),
  );

  const allSupportedLanguages = translationService.getSupportedLanguages();
  const selectedLanguage = allSupportedLanguages.find(
    language => language === props.selectedLanguage,
  );

  const [currentLanguage, setCurrentLanguage] = useState<string>(
    selectedLanguage ?? 'en',
  );
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>(
    allSupportedLanguages,
  );

  useEffect(() => {
    if (selectedLanguage && selectedLanguage !== currentLanguage) {
      setCurrentLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  return (
    <TranslationContext.Provider
      value={{
        currentLanguage,
        supportedLanguages,
        setCurrentLanguage,
        setSupportedLanguages,
        translationService,
      }}
    >
      {props.children}
    </TranslationContext.Provider>
  );
};

/**
 * Merges external translations with internal translation bundles. This function takes the translations object and merges them with internal
 * translation bundles (like `en` and `fr`).
 *
 * @param {Translations} translations - An object containing translations for different languages.
 * @returns {Record<string, TranslationBundle>} A record of language codes mapped to their translation bundles.
 *
 * @example
 * ```typescript
 * const translations = {
 *   en: { "editor.title": "Editor" },
 *   fr: { "editor.title": "Éditeur" },
 * };
 * getTranslationBundles(translations);
 * ```
 */
const getTranslationBundles = (translations: Translations) => {
  const translationBundles: Record<string, TranslationBundle> =
    getInternalTranslationBundles();

  for (const language of Object.keys(translations)) {
    const internalTranslationBundle = translationBundles[language];
    const translationConfiguration = translations[language];
    if (!translationConfiguration) {
      continue;
    }
    if (internalTranslationBundle) {
      internalTranslationBundle.merge(translationConfiguration);
    } else {
      translationBundles[language] = new TranslationBundle(translationConfiguration);
    }
  }
  return translationBundles;
};

/**
 * Initializes the internal translation bundles with the default language translations. This includes the `en` (English) and `fr` (French) translations.
 *
 * @returns {Record<string, TranslationBundle>} A record of language codes mapped to their translation bundles.
 */
const getInternalTranslationBundles = (): Record<string, TranslationBundle> => {
  const translationBundles: Record<string, TranslationBundle> = {};
  translationBundles.en = new TranslationBundle(en);
  translationBundles.fr = new TranslationBundle(fr);
  return translationBundles;
};
