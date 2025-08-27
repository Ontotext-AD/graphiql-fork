import {
  forwardRef,
  MouseEventHandler,
  useState,
  useContext,
  ComponentPropsWithoutRef,
} from 'react';
import { cn } from '../../utility';
import { Tooltip } from '../tooltip';
import { UnStyledButton } from '../button';
import './index.css';
import { TranslationContext } from '../../translation';

interface ToolbarButtonProps extends ComponentPropsWithoutRef<'button'> {
  label: string;
  labelKey?: string;
}

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ label, onClick, labelKey, ...props }, ref) => {
    const [error, setError] = useState<Error | null>(null);
    const { currentLanguage, translationService } =
      useContext(TranslationContext);
    const handleClick: MouseEventHandler<HTMLButtonElement> = event => {
      try {
        // Optional chaining inside try-catch isn't supported yet by react-compiler
        if (onClick) {
          onClick(event);
        }
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error(`Toolbar button click failed: ${err}`),
        );
      }
    };

    const translatedLabel =
      label ||
      (labelKey ? translationService.translate(labelKey, currentLanguage) : '');

    return (
      <Tooltip label={translatedLabel}>
        <UnStyledButton
          {...props}
          ref={ref}
          type="button"
          className={cn(
            'graphiql-toolbar-button',
            error && 'error',
            props.className,
          )}
          onClick={handleClick}
          aria-label={error ? error.message : translatedLabel}
          aria-invalid={error ? 'true' : props['aria-invalid']}
        />
      </Tooltip>
    );
  },
);
ToolbarButton.displayName = 'ToolbarButton';
