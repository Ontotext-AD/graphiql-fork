import {
  forwardRef,
  MouseEventHandler,
  useCallback,
  useContext,
  useState,
} from 'react';
import { clsx } from 'clsx';
import { Tooltip, UnStyledButton } from '../ui';

import './button.css';
import { TranslationContext } from '../translation';

type ToolbarButtonProps = {
  label?: string;
  labelKey?: string;
};

export const ToolbarButton = forwardRef<
  HTMLButtonElement,
  ToolbarButtonProps & JSX.IntrinsicElements['button']
>(({ label, onClick, labelKey, ...props }, ref) => {
  const [error, setError] = useState<Error | null>(null);
  const { currentLanguage, translationService } =
    useContext(TranslationContext);
  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    event => {
      try {
        onClick?.(event);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error(`Toolbar button click failed: ${err}`),
        );
      }
    },
    [onClick],
  );

  const translatedLabel =
    label ||
    (labelKey ? translationService.translate(labelKey, currentLanguage) : '');

  return (
    <Tooltip label={translatedLabel}>
      <UnStyledButton
        {...props}
        ref={ref}
        type="button"
        className={clsx(
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
});
ToolbarButton.displayName = 'ToolbarButton';
