import { useContext } from 'react';
import { TranslationContext } from '../../translation-context';
import { TranslateTextProps } from '../../models/translate-text-props';

/**
 * TranslateText Component
 *
 * This component is responsible for translating a given text key using the translation service provided by the TranslationContext.
 *
 * @param {TranslateTextProps} props - Component properties.
 *
 * @returns {JSX.Element} A translated text.
 */
export const TranslateText = ({
  translationKey,
  translationParams,
}: TranslateTextProps) => {
  const { currentLanguage, translationService } =
    useContext(TranslationContext);
  const translation = translationService.translate(
    translationKey,
    currentLanguage,
    translationParams,
  );
  return translation ? (
    <span dangerouslySetInnerHTML={{ __html: translation }} />
  ) : (
    <>translationKey</>
  );
};
