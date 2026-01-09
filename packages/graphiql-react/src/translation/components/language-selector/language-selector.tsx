import { useContext, useState } from 'react';
import { TranslationContext } from '../../translation-context';
import { DropdownMenu } from '../../../ui';
import { ChevronDownIcon, ChevronUpIcon } from '../../../icons';
import './language-selector.css';

/**
 * LanguageSelector Component
 *
 * A dropdown menu component that allows users to select a language from the supported languages.
 *
 * @returns {JSX.Element} A dropdown menu for selecting a language.
 */
export const LanguageSelector = () => {
  const {
    currentLanguage,
    setCurrentLanguage,
    supportedLanguages,
    translationService,
  } = useContext(TranslationContext);
  const [isOpen, setOpen] = useState(false);

  const buttonProps = {
    type: 'button' as const,
    className: 'language-selector graphiql-button',
    children: isOpen ? (
      <ChevronUpIcon className="graphiql-chevron-icon" aria-hidden="true" />
    ) : (
      <ChevronDownIcon className="graphiql-chevron-icon" aria-hidden="true" />
    ),
    'aria-label': translationService.translate(
      'dialog.settings.language.btn.language_selector.aria_label',
      currentLanguage,
    ),
  };

  return (
    <DropdownMenu onOpenChange={() => setOpen(isOpen)}>
      <DropdownMenu.Button
        {...buttonProps}
        className="language-selector graphiql-button"
      >
        {currentLanguage.toUpperCase()}
      </DropdownMenu.Button>

      <DropdownMenu.Content align="end" className="language-selector-content">
        {supportedLanguages.map(language => (
          <DropdownMenu.Item
            key={language}
            onSelect={() => setCurrentLanguage(language)}
            aria-label={translationService.translate(
              'dialog.settings.language.btn.language_selector.item_aria_label',
              language,
            )}
          >
            {language}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
