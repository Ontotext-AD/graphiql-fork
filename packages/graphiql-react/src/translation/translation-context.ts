import { createContext } from 'react';
import type { TranslationContextType } from './models/translation-context-type';
import { TranslationService } from './services/translation-service';

/**
 * A context that stores all translation-related properties.
 */
export const TranslationContext = createContext<TranslationContextType>({
  currentLanguage: 'en',
  supportedLanguages: [],
  setCurrentLanguage() {},
  setSupportedLanguages() {},
  translationService: new TranslationService(),
});
